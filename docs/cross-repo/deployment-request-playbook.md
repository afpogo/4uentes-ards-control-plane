# Playbook De Request De Deployment

Observado el: 2026-05-19

## Proposito

Este playbook explica como usar naturalmente el control-plane cuando un cambio
de deployment cruza repos de app e infraestructura GitOps.

El ejemplo concreto es:

- `sst-bend`
- `4uentes-auth` (`node-auth`)
- `sst-4uentes-infra`

## Respuesta Corta

Usar el control-plane en este orden:

1. `request` para autorizar y acotar el cambio cross-repo.
2. `planned` para calcular riesgo, servicios afectados y checks.
3. `capability` para definir el contrato tecnico de handoff entre repos.
4. `state` cuando un repo necesita modelar rollout o adopcion de plataforma en
   vez de comportamiento runtime de producto.
5. Solo despues de eso, cambiar los repos funcionales.

Cuando la rama fuente mezcla varios cambios, agregar un manifest de
recomposicion. `path_allowlist` significa siempre `promotion path allowlist`:
selecciona paths y hunks para construir el candidato y no representa una
`runtime network allowlist`, `runtime IP allowlist`, `integration domain
allowlist` o `deployment artifact allowlist`. La nomenclatura y la semantica de
`path_allowlist`, `hunk_rules` y `explicit_exclusions` se explican en
[Promotion Path Allowlist Para Recomposicion Y Release](release-allowlists.md).

## Para Que Sirve Cada Artefacto

### `request`

Usar un request cuando el cambio deseado cruza limites de repositorio o necesita
una decision antes de implementarse.

Para trabajo de deployment, el request responde:

- que repos estan afectados
- si el trabajo es solo app o app+infra
- que validaciones son obligatorias
- si el cambio es seguro para ejecutar ahora

En este repo, el ejemplo concreto es:

- [CR-SST-0003-backend-deployment-workflows-and-manifests.yaml](../../requests/inbox/CR-SST-0003-backend-deployment-workflows-and-manifests.yaml)

### `planned`

`planned` es la version expandida por el orchestrator del request.

Ahi el control-plane dice:

- estos son los servicios afectados
- este es el riesgo actual
- estos son los checks obligatorios
- estas son las decisiones de orquestacion todavia no resueltas

Ejemplo:

- [CR-SST-0003-backend-deployment-workflows-and-manifests.yaml](../../requests/planned/CR-SST-0003-backend-deployment-workflows-and-manifests.yaml)

### `capability`

Usar capabilities para un contrato tecnico estable entre productor y consumidor.

Para deployment, el productor actual es infra:

- `capability.platform.gitops-deployment`
- `capability.platform.ci-gates`

Existen en `sst-4uentes-infra` y definen que se espera que consuman los repos de
app.

Las capabilities sirven para:

- decir "infra va a desplegar mediante Argo CD"
- decir "CI debe validar y publicar, no mutar el cluster directamente"
- decir "el repo consumidor debe entregar contrato y smoke evidence"

Las capabilities no sirven para:

- aprobar un cambio cross-repo
- elegir si el trabajo ocurre ahora
- trackear una secuencia de ejecucion multi-repo

Por eso los requests siguen existiendo.

### `state`

Usar `state` cuando un repo debe modelar rollout, migracion, secuencia de
adopcion o resolucion de gap en vez de comportamiento runtime de API.

Esto importa porque:

- `4uentes-auth` ya soporta naturalmente adopcion de capabilities inbound.
- `sst-bend` actualmente declara su modelo de capabilities como outbound-only.

Entonces, para `sst-bend`, la adopcion de deployment encaja mas naturalmente en
`specs/states`, salvo que primero se decida relajar esa regla y permitir
capabilities inbound de plataforma.

## Flujo Natural Del Orchestrator Para Deployment

### Caso 1: runtime de app solamente, sin cambio de contrato infra

Si solo cambia un repo y no cambia el contrato de deploy, normalmente se puede
trabajar directo en el repo de app y registrar evidencia despues.

Ejemplo:

- refactor interno en `sst-bend`
- sin nuevo flujo de imagen
- sin nueva expectativa de manifest

### Caso 2: workflow de app + contrato de deployment infra

Si el cambio afecta build/publish de imagen, expectativas de manifest, GitOps
tags o gates de validacion de plataforma, empezar en el control-plane.

Este es el caso actual.

Usar esta secuencia:

1. Crear request en `requests/inbox/`.
2. Ejecutar `npm run plan:change -- requests/inbox/<request>.yaml`.
3. Leer riesgo y servicios afectados en `planned`.
4. Decidir que platform capabilities son source of truth.
5. Decidir como cada repo hijo registrara adopcion.
6. Solo entonces modificar repos hijos en ramas separadas.
7. Adjuntar evidencia y resultados de validacion antes de avanzar la ejecucion.

## Lectura Concreta Actual Para `sst-bend` Y `4uentes-auth`

### `sst-4uentes-infra`

Infra ya es el governor de deployment.

Ya define:

- Argo CD como camino de reconciliacion
- Kustomize overlay como source de desired state
- referencias de app image consumidas por el cluster
- expectativas de deployment y CI de plataforma

Entonces infra es el productor del contrato de deployment.

### `4uentes-auth`

`4uentes-auth` puede consumir capabilities de infra naturalmente porque su
modelo ARDS ya soporta artefactos de capability inbound y outbound.

Camino natural de implementacion:

- agregar adopcion inbound para platform GitOps deployment
- agregar adopcion inbound para platform CI gates
- agregar o actualizar docs/specs de workflow que expliquen responsabilidad de
  build/publish

### `sst-bend`

`sst-bend` tiene un mismatch de modelado:

- consume expectativas de deployment de infra
- pero sus reglas de capability actualmente dicen que solo publica capabilities
  outbound

Opciones naturales:

1. Preferida sin cambiar politica del repo:
   usar un artefacto `specs/states/deployment-gitops-rollout.yaml` para registrar
   el camino de rollout/adopcion.
2. Preferida si se quiere mayor simetria cross-repo:
   permitir una excepcion acotada para platform capabilities inbound y agregar
   `specs/capabilities/inbound/platform-gitops-deployment.yaml`.

El control-plane debe forzar primero esa decision en vez de dejarla implicita.

## Gaps Actuales Que Este Request Busca Cerrar

- `sst-bend` todavia tiene un workflow de deploy directo obsoleto que intenta
  sincronizar Argo CD desde app CI.
- `sst-bend` construye una Docker image en CI pero no publica el image tag que
  consume infra.
- `4uentes-auth` no tiene actualmente un GitHub Actions workflow versionado para
  build/publish.
- Los manifests de infra ya apuntan a runtime images, pero los repos de app no
  son responsables de producir esas imagenes de manera consistente.

## Regla Practica De Decision

Cuando preguntes "el orchestrator debe interactuar con el repo de app ahora?",
usar esta regla:

- Si el cambio toca solo runtime code, el repo de app normalmente puede moverse
  primero.
- Si el cambio toca responsabilidad de deployment, procedencia de imagen, CI
  gates o contratos GitOps, el orchestrator debe moverse primero con un request.

## Comandos

Crear y planificar un request:

```powershell
npm.cmd run plan:change -- requests/inbox/CR-SST-0003-backend-deployment-workflows-and-manifests.yaml
```

Validar integridad del control-plane:

```powershell
npm.cmd run check
```

## Siguiente Paso Recomendado

Usar `CR-SST-0003` como approval gate.

Si se aprueba, el siguiente slice de ejecucion deberia ser:

1. fijar el modelo de deployment deseado en `sst-4uentes-infra`
2. decidir el artefacto de adopcion de `sst-bend`: `state` o capability inbound
3. agregar artefactos de adopcion inbound platform en `4uentes-auth`
4. despues implementar workflows en los repos hijos
