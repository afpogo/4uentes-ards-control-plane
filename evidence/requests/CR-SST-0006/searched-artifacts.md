# CR-SST-0006 - Artefactos Buscados

Observado el: 2026-05-20

## Inputs Del Control-Plane

- `requests/inbox/CR-SST-0006-robots-cross-repo-investigation.yaml`
- `requests/planned/CR-SST-0006-robots-cross-repo-investigation.yaml`
- `solutions/sst.yaml`
- `inventory/phase-0.md`
- `inventory/evidence/git/sst-fend.md`
- `inventory/evidence/git/sst-extension.md`

## Servicios Afectados Por El Planner

El planner expandio la solucion `sst` con optional services incluidos:

- `sst-fend`
- `sst-bend`
- `4uentes-auth`
- `sst-4uentes-infra`
- `sst-extension`

## Terminos Buscados

- `robot`
- `robots`
- `bot`
- `bots`
- `Robot`
- `x-active-account-id`
- `account-context`
- `users-accounts-robots`

## Repositorios Inspeccionados Read-Only

### control-plane

Path: `C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor`

Busqueda:

- `rg -n -i --glob '!node_modules/**' --glob '!dist/**' --glob '!build/**' --glob '!.git/**' --glob '!.output/**' "robot|robots|\bbot\b|\bbots\b"`

Resultado:

- Sin evidencia previa de Robots antes de crear `CR-SST-0006`.

### sst-bend

Path: `C:\Users\andre\Desktop\4uentes\apps\4uentes-sstbend\sst-bend`

Artefactos con evidencia directa:

- `specs/api/users-accounts-robots.yaml`
- `docs/api/18-users-accounts-robots.md`
- `specs/states/feature.users-accounts-robots-rollout.yaml`
- `docs/tasks/2026-04-18-users-accounts-robots-rollout.md`
- `db/models/robot.js`
- `db/models/account.js`
- `db/models/index.js`
- `db/migrations/20260419000000-create-account-core-tables.js`
- `scripts/reconcile-users-account-scope.js`
- `docs/capabilities/outbound/account-context-forwarding.md`
- `specs/capabilities/outbound/account-context-forwarding.yaml`
- `src/apps/sst/presentation/routes/accounts.routes.js`
- `src/apps/sst/presentation/controllers/accounts.controller.js`
- `src/apps/sst/presentation/routes/index.js`

Lectura:

- Existe diseno ARDS/SDD y desarrollo parcial de persistencia/modelo para
  Robots en `sst-bend`.
- No se encontro controller, route o use case dedicado a administrar Robots.
- La surface runtime publicada para el dominio de cuenta es `GET /4uentes/v1/me`
  y `GET /4uentes/v1/accounts`.
- La surface de Robots esta planificada, no publicada.

### 4uentes-auth

Path: `C:\Users\andre\Desktop\4uentes\apps\node-auth`

Busqueda:

- `rg -n -i "robot|robots" docs specs src package.json`
- `rg -n "account-context|x-active-account-id|robots|Robot|account_id" src specs docs package.json`

Resultado:

- Sin menciones directas `robot/robots`.
- Existe adopcion `account-context-forwarding` desde `sst-bend`.
- `src/presentation/helpers/auth.ts` extrae y forwardea `x-active-account-id` y
  `x-account-id`.

Lectura:

- `4uentes-auth` no implementa Robots.
- Su rol cross-repo relacionado es forwardear contexto de cuenta hacia SST.

### sst-fend

Path: `C:\Users\andre\Desktop\4uentes\apps\sst-fend`

Busqueda:

- `rg -n -i "robot|robots" docs specs src package.json`
- `rg -n "account-context|x-active-account-id|robots|Robot|account_id" src specs docs package.json`

Resultado:

- Sin menciones directas `robot/robots`.
- Sin UI o service layer observable para Robots.
- Se encontro una referencia aislada a `account_id` en evidencia de tarea de
  session/node; no representa runtime de Robots.

Lectura:

- `sst-fend` no implementa Robots ni una UI de administracion de Robots.

### sst-extension

Path: `C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\sst-extension`

Busqueda:

- `rg -n -i "robot|robots" docs specs src package.json`
- `rg -n "account-context|x-active-account-id|robots|Robot|account_id" src specs docs package.json`

Resultado:

- Sin menciones directas `robot/robots`.
- El cliente puede emitir `x-active-account-id`, pero docs/specs declaran que no
  hay account context local real conectado todavia.

Lectura:

- `sst-extension` no implementa Robots.
- Mantiene un gap de account context que seria relevante antes de cualquier
  consumo futuro de Robots scoped por cuenta.

### sst-4uentes-infra

Path: `C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra`

Busqueda:

- `rg -n -i "robot|robots" docs specs k8s-manifests argocd`

Resultado:

- Sin menciones `robot/robots`.

Lectura:

- Infra no tiene artefactos dedicados a Robots. Solo despliega los servicios SST
  que eventualmente contendrian la feature.
