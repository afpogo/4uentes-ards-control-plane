# Argo CD Prune Vs Self-Heal

Observado el: 2026-05-19

## Proposito

Esta guia explica la diferencia entre `prune` y `selfHeal` en Argo CD y aplica
ambos conceptos a la infraestructura SST actual.

Politica SST actual en `sst-app`:

```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
```

Fuente:

- `C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra\argocd\argocd-app.yml`

## Diferencia Corta

- `selfHeal` repara un recurso gestionado que todavia existe en Git pero tuvo
  drift en el live cluster.
- `prune` elimina del live cluster un recurso gestionado cuando ya no existe en
  Git.

Esa es la diferencia central:

- `selfHeal` = restaurar recurso cambiado
- `prune` = eliminar recurso gestionado huerfano

## Modelo Mental

Pensar Git como el inventario de lo que debe existir.

### Con `selfHeal`

El item sigue existiendo en el inventario, pero alguien lo cambio en el
warehouse. Argo CD lo devuelve a la version definida por Git.

### Con `prune`

El item fue removido del inventario por completo. Argo CD tambien lo remueve del
warehouse.

## Significado Oficial

Argo CD documenta automated sync como el controller que reconcilia Git hacia el
cluster. Tambien documenta:

- `prune` para eliminar recursos que ya no estan definidos en Git
- `selfHeal` para resincronizar cuando el live cluster se desvia de Git

Fuente:

- https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/

## Aplicacion SST Actual

`sst-app` apunta actualmente a:

- repo: `sst-4uentes-infra`
- branch: `develop`
- path: `k8s-manifests/overlays/development`

Gestiona el namespace SST y los workloads descriptos en:

- `C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra\specs\infra\gitops\sst-app.yaml`

Eso significa que `prune` y `selfHeal` aplican a los recursos owned por esa
Application.

## Ejemplo 1: Self-Heal

### Situacion

Alguien edita directamente el Deployment de `node-auth` en el cluster y cambia
un env value o replica count.

### Resultado

Como el recurso todavia existe en Git, Argo CD compara live state contra Git y
puede restaurar la version definida en Git.

### Lectura

Esto es `selfHeal`, no `prune`.

## Ejemplo 2: Prune

### Situacion

Un recurso se elimina de `k8s-manifests/overlays/development` o de la base que
importa ese overlay.

Ejemplo:

- `Ingress/sst-ingress` se elimina de los manifests en Git

### Resultado

Como el recurso ya no forma parte del desired state, Argo CD puede eliminarlo
del cluster.

### Lectura

Esto es `prune`, no `selfHeal`.

## Ejemplo 3: Ambos Juntos

### Situacion

1. Un Deployment existe en Git.
2. Alguien lo cambia live en el cluster.
3. Mas tarde, el Deployment se elimina por completo de Git.

### Resultado

- mientras existe en Git, `selfHeal` puede restaurarlo
- una vez que se elimina de Git, `prune` puede borrarlo

## En Que Ayuda `prune`

- Evita que recursos gestionados se acumulen despues de limpiar manifests.
- Mantiene el cluster mas cerca del inventario exacto en Git.
- Elimina workloads obsoletos removidos intencionalmente del desired state.
- Reduce restos ocultos de manifests viejos.

## Pros De `prune`

- Cluster mas limpio.
- Mayor consistencia GitOps.
- Menos deuda de configuracion en ambientes de larga vida.
- Util para decommissioning controlado mediante Git.

## Contras De `prune`

- Una eliminacion equivocada en Git puede remover rapidamente un recurso live.
- Es mas riesgoso que self-heal simple en ambientes inmaduros.
- Es peligroso cuando los equipos no entienden completamente el ownership de una
  Application.
- Puede sorprender a operadores si un recurso fue creado manualmente pero Argo
  todavia lo ve como gestionado.

## En Que Ayuda `selfHeal`

- Corrige live drift.
- Desalienta configuracion manual del lado cluster.
- Refuerza Git como source of truth.

Para el walkthrough completo de self-heal:

- [argocd-self-heal-tutorial.md](argocd-self-heal-tutorial.md)

## Pros De `selfHeal`

- Mas seguro que depender de disciplina manual.
- Bueno para restaurar config esperada despues de cambios accidentales.
- Funciona bien con automated sync.

## Contras De `selfHeal`

- Ediciones temporales de debug pueden desaparecer.
- Puede ocultar habitos operativos manuales en vez de corregirlos de raiz.
- Puede crear confusion si los operadores no saben que Git es el owner.

## Diferencia Principal De Riesgo

`selfHeal` suele ser una accion de reparacion.

`prune` es una accion de eliminacion.

Eso hace que `prune` sea operacionalmente mas peligroso, aunque ambos sean
features normales de GitOps.

## Interpretacion SST Actual

Para desarrollo local SST:

- `selfHeal: true` es util y esta alineado con aprendizaje GitOps.
- `prune: true` es aceptable, pero solo si el equipo entiende que eliminar un
  manifest de Git tambien es una accion de eliminacion en el cluster.

Ahora mismo, la mayor debilidad operativa no son estas flags en si. Es que:

- la procedencia de app images todavia es debil
- los deployment workflows son desparejos
- la estrategia de rollback sigue en `TODO`

Entonces `prune` y `selfHeal` estan aplicando bien Git, pero Git todavia
necesita un camino de entrega mas production-grade.

## Reglas Operativas Practicas

### Regla 1

Si queres que un cambio persista, cambiar Git primero.

### Regla 2

Si eliminas un manifest de Git, asumir que `prune` puede eliminar el recurso
live.

### Regla 3

Si parcheas live un recurso gestionado, asumir que `selfHeal` puede revertirlo.

### Regla 4

No usar ediciones manuales de cluster como mecanismo normal de deployment.

### Regla 5

Antes de habilitar la misma postura en staging o production, corregir primero:

- inmutabilidad de artefactos
- camino de rollback
- gates de validacion
- limites de ownership

## Camino De Evolucion

### Desarrollo Local

La postura actual es aceptable:

- `automated: true`
- `prune: true`
- `selfHeal: true`

porque el ambiente ya esta explicitamente orientado a GitOps.

### Staging

Postura recomendada:

- mantener `automated: true`
- mantener `selfHeal: true`
- mantener `prune: true`
- agregar validacion CI mas fuerte y procedimiento de rollback mas claro

### Production

Postura recomendada solo despues de hardening:

- image tags o digests inmutables
- estrategia explicita de rollback
- incident response documentado
- modelo claro de secrets y RBAC
- alertas de drift y visibilidad de fallos de reconcile

Si eso no esta listo, `prune` especialmente debe tratarse con cautela.

## Proximas Preguntas Recomendadas

1. Que recursos SST deben considerarse seguros para prune automatico?
2. Que recursos, si los hay, necesitan proteccion extra contra eliminacion?
3. Staging y production deben mantener la misma sync policy que development?
4. Cual es el camino exacto de rollback si un mal commit de Git se auto-sync?

## Input Para Investigacion Del Orchestrator

- [CR-SST-0005-argocd-prune-investigation.yaml](../../requests/inbox/CR-SST-0005-argocd-prune-investigation.yaml)
- [planned CR-SST-0005](../../requests/planned/CR-SST-0005-argocd-prune-investigation.yaml)

## Fuentes

- Argo CD official automated sync docs:
  https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
- Local SST Argo CD application:
  `C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra\argocd\argocd-app.yml`
- Local SST GitOps spec mirror:
  `C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra\specs\infra\gitops\sst-app.yaml`
