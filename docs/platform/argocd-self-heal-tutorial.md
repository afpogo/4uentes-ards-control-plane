# Tutorial De Argo CD Self-Heal

Observado el: 2026-05-19

## Proposito

Este tutorial explica que significa `selfHeal` en la infraestructura SST actual,
por que ayuda, donde es riesgoso y como evolucionarlo.

Esta basado en el setup GitOps local actual:

- Argo CD Application: `sst-app`
- Repo de desired state: `sst-4uentes-infra`
- Target path: `k8s-manifests/overlays/development`

## Estado Local Actual

`selfHeal` esta habilitado hoy en la Argo CD application de SST:

- `C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra\argocd\argocd-app.yml`
- `C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra\specs\infra\gitops\sst-app.yaml`

Politica actual:

```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
```

## Que Es Self-Heal

En Argo CD, `selfHeal` significa:

- Argo CD observa el live cluster state.
- Si alguien o algo cambia directamente en Kubernetes un recurso gestionado,
  Argo CD detecta drift contra Git.
- Si automated sync esta habilitado, Argo CD intenta devolver el recurso al
  estado definido en Git.

No es lo mismo que "reiniciar pods fallidos" ni "reparar logica de app".

Es especificamente:

- correccion de drift de Kubernetes resources gestionados

no:

- auto-recuperacion a nivel aplicacion
- reparacion de base de datos
- regeneracion de secrets
- build/publish de imagenes

## Que Significa En SST

En el setup SST actual, Argo CD debe ser dueno del desired state de:

- `sst-fend`
- `sst-bend`
- `node-auth`
- `node-auth-mongo`
- `sst-postgres`
- `sst-bend-migrations`
- `sst-ingress`

Entonces, si una persona edita directamente uno de esos recursos con
`kubectl edit`, `kubectl patch` o un `kubectl apply` ad hoc, Argo CD puede
revertir ese cambio a lo que existe en Git.

## Ejemplo

### Escenario

Alguien cambia directamente en el cluster el replica count del `sst-bend`
Deployment:

```yaml
spec:
  replicas: 3
```

pero Git todavia dice:

```yaml
spec:
  replicas: 1
```

### Con `selfHeal: true`

Argo CD detecta drift y reconcilia el Deployment de vuelta a `replicas: 1`.

### Con `selfHeal: false`

Argo CD muestra drift, pero no repara automaticamente ese cambio que existe solo
en el live cluster.

## En Que Ayuda Self-Heal

- Previene config drift cuando operadores modifican recursos gestionados a mano.
- Preserva Git como source of truth real.
- Reduce la necesidad de que pipelines CI accedan directamente al cluster.
- Hace mas fuerte y predecible la aplicacion de GitOps.
- Ayuda a que clusters locales de desarrollo vuelvan a un estado conocido luego
  de cambios accidentales.

## Pros

- Correccion rapida de drift.
- Modelo operativo claro: cambiar Git, no el cluster.
- Util cuando varias personas o herramientas pueden tocar el cluster.
- Buen fit para ambientes repetibles donde los manifests deben mantenerse
  estables.

## Contras

- Hotfixes manuales en cluster pueden desaparecer rapidamente.
- El troubleshooting se vuelve confuso si alguien edita recursos live y Argo CD
  los revierte silenciosamente.
- Si Git contiene un cambio malo, Argo CD va a seguir aplicando fielmente ese
  desired state malo.
- Puede pelear con otros controllers u operators si los limites de ownership no
  estan claros.
- En local/dev, puede ocultar que el equipo depende de intervenciones manuales
  en vez de corregir manifests.

## Limite Importante Con `prune`

`selfHeal` y `prune` estan relacionados, pero son distintos.

- `selfHeal` repara recursos gestionados que tienen drift.
- `prune` elimina recursos gestionados que ya no existen en Git.

En SST, ambos estan habilitados.

Eso significa que el modelo actual es agresivo para desarrollo:

- si un recurso tiene drift, Argo CD puede restaurarlo
- si un recurso desaparece de Git, Argo CD puede eliminarlo del cluster

## Que No Resuelve

- No publica Docker images.
- No garantiza que existan secrets.
- No valida si el comportamiento de la app es correcto.
- No reemplaza una politica de rollout.
- No decide si un cambio en Git era seguro.

En SST especificamente, `selfHeal` no resuelve el gap de workflow en repos de
app. Si el image tag en Git apunta a una imagen incorrecta, Argo CD puede
reconciliar consistentemente hacia esa imagen incorrecta.

## Tutorial Operativo

### 1. Leer La Politica Actual

Revisar el Application manifest:

```powershell
Get-Content argocd\argocd-app.yml
```

### 2. Confirmar Source De Desired State

El desired state es:

- repo: `sst-4uentes-infra`
- branch: `develop`
- path: `k8s-manifests/overlays/development`

Entonces, si queres que un cambio persista, cambiar Git ahi primero.

### 3. Saber Cuando No Editar El Cluster Directamente

Evitar ediciones directas de recursos gestionados como:

- Deployments
- Services
- Ingress
- ConfigMaps

Si los cambias live, Argo CD puede revertirlos.

### 4. Usar Ediciones Live Solo Como Debug Temporal

Si tenes que parchear live state para debug:

- asumir que es temporal
- capturar el motivo
- promover el fix real a Git si debe persistir

### 5. Troubleshooting De Drift

Si Argo CD sigue "deshaciendo" cambios en el cluster, preguntar:

1. Este recurso esta gestionado por `sst-app`?
2. Git todavia define el valor viejo?
3. `selfHeal` esta habilitado?

Si las tres respuestas son verdaderas, probablemente Argo CD esta comportandose
correctamente.

## Cuando Self-Heal Es Buen Fit

- Ambientes compartidos estables.
- Equipos GitOps-first.
- Plataformas donde debe desalentarse la mutacion directa del cluster.
- Casos donde el drift es mas peligroso que revertir un ajuste manual.

## Cuando Tener Mas Cuidado

- Fases tempranas de bootstrap.
- Ambientes con mucho debug manual.
- Apps con diffs ruidosos o campos mutados por otros controllers.
- Equipos que todavia dependen de fixes de emergencia en cluster.

## Como Puede Evolucionar SST

### Stage 1: desarrollo local actual

Mantener:

- `automated: true`
- `prune: true`
- `selfHeal: true`

pero tratarlo como:

- enforcement GitOps util
- no como reemplazo de workflows correctos de entrega de apps

### Stage 2: postura de validacion mas segura

Agregar:

- validacion mas fuerte de manifests antes de merge
- runbooks mas claros para excepciones de live-debug
- lista explicita de recursos gestionados por Argo
- evidencia de incidentes de drift y root causes

### Stage 3: hardening de staging

Considerar:

- mantener automated sync
- mantener `selfHeal`
- usar sync windows o approval gates para cambios de mayor riesgo
- ajustar RBAC para que menos actores puedan mutar recursos gestionados
- reducir tags mutables y pasar a image tags o digests inmutables

### Stage 4: GitOps Production-Grade

Apuntar a:

- referencias de artefactos inmutables
- limites explicitos de ownership
- alertas de drift y fallos de reconcile
- rollback documentado por Git revision o image rollback
- diff ignores selectivos solo donde se esperan campos gestionados por
  controllers

## Mejoras Recomendadas Para SST

1. Reemplazar image tags mutables `develop` por tags o digests inmutables.
2. Agregar workflows en repos hijos que publiquen los artefactos exactos que
   consume infra.
3. Definir que cambios live-cluster se permiten para debug y como se registran.
4. Agregar guia de drift/incidentes al runbook.
5. Definir estrategia de rollback en `sst-4uentes-infra` en vez de dejarla como
   `TODO`.

## Input Para Investigacion Posterior

Para investigar esto mediante el orchestrator lifecycle, usar:

- [CR-SST-0004-argocd-self-heal-investigation.yaml](../../requests/inbox/CR-SST-0004-argocd-self-heal-investigation.yaml)
- [planned CR-SST-0004](../../requests/planned/CR-SST-0004-argocd-self-heal-investigation.yaml)

## Fuentes

- Argo CD automated sync and self-heal:
  https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
- Local SST Argo CD application:
  `C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra\argocd\argocd-app.yml`
- Local SST GitOps spec mirror:
  `C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra\specs\infra\gitops\sst-app.yaml`
