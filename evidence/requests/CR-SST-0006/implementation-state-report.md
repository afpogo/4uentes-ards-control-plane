# CR-SST-0006 - Reporte De Estado De Robots En SST

Observado el: 2026-05-20

## Resumen Ejecutivo

Robots en SST existe como concepto ARDS/SDD y como persistencia parcial dentro
de `sst-bend`, no como feature runtime completa cross-repo.

Lo que se hablo/documento: Robots forman parte del dominio
`users-accounts-robots`, donde `sst-bend` consolida usuarios autenticados por
`node-auth`, crea cuentas SST, memberships y Robots por cuenta. Un Robot
pertenece a una unica cuenta, tiene un solo `role`, usa soft delete en v1 y su
destruccion debe preservar auditoria, runtime y contexto documental.

Lo que existe desarrollado: tabla `robots`, modelo Sequelize `Robot`,
asociaciones con `Account` y `ConsolidatedUser`, migracion base de account core
y un script de reconciliacion de account scope que cuenta/mueve filas de
`robots`.

Lo que no existe todavia: endpoints publicados de Robots, controller/use cases
de creacion/listado/destruccion, UI frontend, integration en extension,
capability runtime especifica de Robots y manifests de infra especificos.

## Estado Por Servicio

| Servicio | Estado Robots | Evidencia |
|---|---|---|
| `sst-bend` | `runtime-partial` | Spec/doc/state + tabla/modelo/migracion/script; sin endpoints runtime de Robots publicados. |
| `4uentes-auth` | `not-implemented` | Sin `robot/robots`; solo adopta `account-context-forwarding`. |
| `sst-fend` | `not-implemented` | Sin `robot/robots`; no UI ni service layer. |
| `sst-extension` | `not-implemented` | Sin `robot/robots`; account context local sigue como gap. |
| `sst-4uentes-infra` | `not-implemented` | Sin manifests/docs/specs de Robots. |

## Lo Que Se Hablo Sobre Robots

Fuente principal:

- `sst-bend:specs/api/users-accounts-robots.yaml`
- `sst-bend:docs/api/18-users-accounts-robots.md`
- `sst-bend:specs/states/feature.users-accounts-robots-rollout.yaml`
- `sst-bend:docs/tasks/2026-04-18-users-accounts-robots-rollout.md`

Puntos definidos:

- `node-auth` conserva ownership de login, registro, refresh, logout, cookies,
  CSRF, JWKS e identity store base.
- `sst-bend` pasa a ser owner de usuarios consolidados SST, cuentas,
  memberships, Robots y ownership de recursos SST.
- Robots pertenecen a una cuenta.
- Cada Robot tiene un unico `role`.
- `owner` puede crear y destruir Robots.
- `member` no puede destruir Robots.
- Robots usan soft delete en v1.
- Destruir un Robot no debe borrar trazabilidad: se debe conservar auditoria,
  runtime minimo y contexto documental.
- La administracion HTTP completa de cuentas/Robots queda para fases siguientes.

## Desarrollo Existente En `sst-bend`

### Persistencia Y Modelo

- `db/migrations/20260419000000-create-account-core-tables.js:159` crea la tabla
  `robots`.
- `db/migrations/20260419000000-create-account-core-tables.js:199` define
  `runtime_context`.
- `db/models/robot.js:3` define `ROBOT_TABLE = "robots"`.
- `db/models/robot.js:47` mapea `runtimeContext`.
- `db/models/robot.js:68` mapea `deletedByActor`.
- `db/models/robot.js:92` define la clase Sequelize `Robot`.
- `db/models/account.js:87` asocia `Account.hasMany(models.Robot)`.
- `db/models/index.js:13`, `db/models/index.js:29` y `db/models/index.js:50`
  importan, inicializan y asocian `Robot`.

Campos relevantes del modelo:

- `account_id`
- `name`
- `role`
- `status`
- `created_by_user_id`
- `runtime_context`
- `deleted_at`
- `deleted_by_user_id`
- `deleted_by_actor`
- `deleted_reason`

### Reconciliacion De Account Scope

`scripts/reconcile-users-account-scope.js` ya trata `robots` como recurso scoped
por cuenta:

- busca `account_id` distintos al target;
- cuenta filas `Robot`;
- actualiza `Robot.accountId` hacia la cuenta target junto con `articulos` y
  `article_nodes`.

Esto confirma que Robots participa del modelo de scoping de datos, aunque no
exista administracion HTTP completa.

### Runtime HTTP Actual

`sst-bend` publica hoy:

- `GET /4uentes/v1/me`
- `GET /4uentes/v1/accounts`

Evidencia:

- `src/apps/sst/presentation/routes/accounts.routes.js:9`
- `src/apps/sst/presentation/routes/accounts.routes.js:10`
- `src/apps/sst/presentation/routes/index.js:25`

Los endpoints planificados pero no observados como runtime son:

- `GET /4uentes/v1/accounts/:id/robots`
- `POST /4uentes/v1/accounts/:id/robots`
- `DELETE /4uentes/v1/robots/:id`

## Estado Cross-Repo

### `4uentes-auth`

No hay implementacion de Robots en `4uentes-auth`.

Si existe una adopcion relacionada: `account-context-forwarding`.

Evidencia:

- `specs/capabilities/inbound/sst-bend--account-context-forwarding.yaml:10`
  declara `adoption_status: implemented`.
- `specs/capabilities/inbound/sst-bend--account-context-forwarding.yaml:43`
  documenta que `node-auth` extrae `x-active-account-id`.
- `specs/capabilities/inbound/sst-bend--account-context-forwarding.yaml:46`
  deja la validacion semantica de cuenta activa en SST.
- `src/presentation/helpers/auth.ts:22`, `:33` y `:37` preservan
  `x-active-account-id` / `x-account-id`.

Lectura: `4uentes-auth` esta listo para pasar contexto de cuenta, pero no posee
ni debe poseer reglas de Robots.

### `sst-fend`

No hay menciones `robot/robots` en `docs`, `specs`, `src` ni `package.json`.

Lectura: no existe UI, service, store, route ni test de Robots. Cualquier
administracion futura de Robots requeriria un request nuevo y una capability
publicada desde `sst-bend` o facade desde `4uentes-auth`.

### `sst-extension`

No hay menciones `robot/robots`.

Si hay evidencia de account context pendiente:

- `docs/integration/node-auth-extension-dictionary.md:68` indica que
  `x-active-account-id` existe en el cliente HTTP pero no se envia.
- `docs/integration/node-auth-extension-dictionary.md:69` explica que falta
  account context local real.
- `specs/integration/inbound/node-auth--dictionary-domain-management-v1.yaml:113`
  registra el gap.

Lectura: la extension no debe consumir Robots hasta resolver account context si
la feature requiere scope por cuenta.

### `sst-4uentes-infra`

No hay menciones `robot/robots` en docs, specs, manifests ni Argo CD.

Lectura: infra no tiene trabajo especifico de Robots; desplegaria los cambios
indirectamente si `sst-bend` publica runtime nuevo.

## Gaps

- No existe `robots.routes.js`.
- No existe `robots.controller.js`.
- No se observaron use cases `createRobot`, `listRobots` o `deleteRobot`.
- No existe endpoint runtime publicado para Robots.
- No existe capability outbound `users-accounts-robots` o equivalente runtime
  observable.
- No hay UI en `sst-fend`.
- No hay soporte en `sst-extension`.
- No hay QA/smoke dedicado a Robots.
- Falta definir el shape canonico del snapshot que preserva memoria/contexto de
  un Robot destruido.

## Recomendacion

No tratar Robots como feature completa. Clasificarlo como:

```text
sst-bend: runtime-partial, persistence/model-ready, HTTP/admin not implemented
cross-repo: not implemented, account-context prerequisite present
```

El siguiente request natural deberia ser uno de estos:

1. `CR-SST-0007` para disenar y publicar la runtime surface de Robots en
   `sst-bend` con QA minima.
2. Un request de handoff `users-accounts-robots` cuando exista runtime observable
   y deba exponerse via `4uentes-auth`.
3. Un request frontend separado solo despues de que el contrato HTTP y BFF
   queden definidos.
