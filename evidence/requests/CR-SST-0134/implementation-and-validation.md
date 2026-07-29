# CR-SST-0134 - implementación y validación local

Fecha: 2026-07-24

## Estado del lifecycle

- `CR-SST-0134` permanece `running`.
- Jira continúa como espejo. `SST-64` recibió el comentario de inicio `10263`, fue movido de `En revisión` a `En curso` y recibió el comentario de avance `10264` con checks y pendientes.
- `SST-58` fue observado en `Finalizada`; no se modificó.
- No se crearon issues ni jerarquías nuevas.
- No se ejecutaron clasificaciones, migraciones ni escrituras sobre artículos históricos. La elección `Web` o `Texto` sigue reservada a la persona usuaria, artículo por artículo.
- No corresponde mover `SST-64` a `Listo`, cerrar este CR, elevar `article-semantic-kind` ni cerrar `INIT-SST-0005` mientras queden artículos sin payload y falte el QA autenticado de persistencia.

## Implementación

### `sst-fend`

- `ArticleModal` muestra `Clasificar` únicamente cuando `payloadKind=unclassified` y reemplaza el formulario vacío por dos acciones: `Clasificar como Web` y `Clasificar como Texto`.
- Web requiere una URL HTTP(S) válida. Texto permite conservar `sourceUrl` cuando existe o enviar `data: {}` cuando no existe.
- La confirmación muestra el título y el kind elegido. El estado de carga bloquea ambas acciones; un error conserva el panel para reintentar.
- `Articles` usa el `PUT /articulos/:id` existente mediante `updateArticuloAction` y envía solamente `payload`; `filterType` no interviene.
- `IUpdateArticuloRequest` declara `url`, `titulo` y `desc` como campos opcionales para reflejar el update parcial ya soportado.
- Los artículos ya clasificados mantienen el flujo normal de edición.

Archivos principales:

- `src/pages/Articles/components/ArticleModal/ArticleModal.tsx`
- `src/pages/Articles/components/ArticleModal/interface.ts`
- `src/pages/Articles/index.tsx`
- `src/services/articuloService.ts`
- tests focalizados de `ArticleModal`, `Articles`, `articulo.action` y confirmaciones.

### Owners y fronteras

- Frontend: `specs/33-articles-frontend.yml` y `docs/33-articles-frontend.md` documentan autoridad humana, payload-only y separación `payloadKind`/`filterType`.
- Backend: `specs/api/routing.yaml`, `docs/api/03-routing.md` y `docs/api/article-kind-reconciliation.md` documentan el PATCH canónico parcial y su upsert transaccional existente.
- `node-auth` mantiene el `PUT /api/articulos/:id` como fachada existente.
- No se modificó runtime de `node-auth` ni de `sst-bend`, y no se agregó contrato HTTP.

## Verificación ejecutada

- `sst-fend`: tests focalizados, 4 suites y 56 tests aprobados.
- `sst-fend`: `npm.cmd run check`, 30 suites y 201 tests aprobados; lint sin errores y build exitoso. Permanecen 22 warnings históricos de lint/deprecaciones.
- `node-auth`: `npm.cmd run check` aprobado.
- `node-auth`: `npm.cmd run build` aprobado.
- `sst-bend`: `npm.cmd run test:article-kind-contract` aprobado. El runner emitió el warning preexistente de preview `this.previewAssetService.resolve is not a function`, sin fallo del contrato.
- `sst-bend`: `npm.cmd run check` finalizó con código 0 y `[ARDS CHECK] OK`. Sin `SMOKE_JWT`, el smoke protegido informó cobertura parcial `1/2` y dejó `sst.articulos.list` sin cubrir; esto no equivale a QA autenticado.
- `4uentes-orchestor`: tanto el check previo a la mutación de repos hijos como `npm.cmd run check` sobre el estado final aprobaron; el owner-documentation gate de `CR-SST-0134` fue validado.

## QA visual y autenticado

El skill de navegador integrado fue activado para QA, pero el kernel rechazó la conexión porque el conector no recibió el metadato obligatorio `sandboxPolicy`. Un segundo intento con el metadato explícito fue rechazado porque el contrato del tool no admite `_meta`. No se sustituyó esta prueba por una simulación ni por otra automatización no autorizada por el skill.

### Reintento con Chrome DevTools MCP - 2026-07-26

- El MCP de Chrome DevTools conectó correctamente a una sesión nueva de Chrome.
- El stack publicado en `localhost:4090` aceptaba conexiones pero no devolvía bytes. Docker Desktop inicialmente no exponía `docker_engine` ni `dockerDesktopLinuxEngine`. Los logs mostraron un `com.docker.backend` huérfano desde el 2026-07-24, sin `dockerMemlogdq` ni `dockerProcd`; se detuvo solo ese proceso y Docker Desktop regeneró un backend nuevo.
- Con el daemon recuperado se levantaron `postgres`, `sst` y `fuentes`; `sst-bend` quedó respondiendo `200` y el BF quedó accesible en `4000`.
- Para aislar el QA visual se levantó `sst-fend` en `localhost:4178` y se usó la preview de desarrollo `/__preview/article-detail`; Webpack compiló correctamente.
- La fixture representa un artículo ya clasificado como `Transcript`. El detalle mantuvo `Edit` y no mostró `Clasificar`, como exige la reparación defensiva.
- Desktop emulado exactamente en `1440x900`: sin overflow horizontal, sin actions fuera del viewport y targets `Delete`, `Edit` y `Open resource` de `44px` de alto.
- Mobile emulado exactamente en `390x844`, con touch: sin overflow horizontal, sin actions fuera del viewport y los mismos targets de `44px` de alto.
- Hallazgo visual `QA-SST-0134-01`: en mobile el action dock usa tres filas, mide `150px` y consume `17.8%` del viewport. Aunque no desborda, su peso contradice el criterio owner de no dominar ni robar lectura útil; requiere revisión antes del cierre visual.
- Red: siete requests iniciales, todos con respuesta exitosa; no hubo XHR/fetch de mutación.
- Consola: cero errores. Solo apareció el warning conocido de future flag de React Router v7.
- La preview usa `onEdit` y `onClassify` no-op; esta pasada no prueba transición a edición, confirmación, request ni persistencia.
- La cuenta local indicada por `node-auth/AUTH_E2E_TESTS.md` fue probada una sola vez y devolvió `401` con credenciales inválidas. No se intentaron otras claves, no se creó una cuenta y no se alteró auth. El QA autenticado queda bloqueado hasta disponer de una credencial local vigente.

Capturas:

- `evidence/requests/CR-SST-0134/qa-2026-07-26-desktop-1440x900.png`
- `evidence/requests/CR-SST-0134/qa-2026-07-26-mobile-390x844.png`

Por lo tanto permanecen pendientes:

- inspección visual autenticada del catálogo real en `1440x900` y `390x844`;
- confirmar ausencia de overflow y errores atribuibles en la rama real `unclassified`;
- cancelar una confirmación sin request;
- persistir, con decisión humana explícita, al menos un legacy Web y uno Texto;
- clasificación manual del resto;
- lectura final que demuestre cero artículos sin payload y cero mismatches.

La última evidencia de inventario disponible en este CR es la del 2026-07-12: `104` artículos, `81` con payload y `23` sin payload. El supuesto posterior `108/85/23` no fue tratado como evidencia porque no pudo revalidarse en esta ejecución.

## Criterio de cierre pendiente

Cerrar solamente después de obtener QA autenticado, ejecutar la decisión humana para los 23 artículos y verificar la consulta final. Hasta entonces no declarar `done`, `ready-for-release`, `released` ni `Listo`.

## Revalidación posterior al QA manual - 2026-07-28

La persona usuaria informó que completó el QA manual y clasificó todos los
recursos sin clasificar que estaban visibles en su sesión. Se verificó el
resultado directamente en PostgreSQL mediante consultas `SELECT` agregadas,
sin leer contenido ni identificadores de cuentas y sin ejecutar escrituras.

Resultado observado:

- artículos totales: `108`;
- con payload: `90`;
- sin payload: `18`;
- payloads `text/text`: `67`;
- payloads `web/web`: `23`;
- mismatches `kind/payload_kind`: `0`;
- pendientes distribuidos en cuatro buckets anónimos de owner: `12`, `4`, `1`
  y `1`;
- los `18` pendientes conservan URL no vacía y `filter.type=text`, señales que
  no autorizan inferir su kind.

La reconciliación manual persistió cinco decisiones respecto del universo
esperado de 23 pendientes, pero la cuenta usada en QA no expuso los 18 artículos
restantes, distribuidos en otras cuentas o scopes. El QA informado se acepta
como evidencia humana de los recursos visibles, pero no reemplaza la consulta
integral de cierre.

Preflight Jira posterior:

- `SST-64` continúa `En curso` y es el único issue abierto bajo `SST-57`;
- `SST-58` permanece `Finalizada`;
- no corresponde transicionar `SST-64` ni `SST-57` a `Listo` mientras el
  inventario integral sea distinto de cero.

El lifecycle permanece deliberadamente abierto: `CR-SST-0134=running`,
`article-semantic-kind=validated-local` e `INIT-SST-0005=active`. No se declara
`released`.

## Publicación de ramas - 2026-07-28

Después de repetir los gates finales se publicaron por SSH las ramas de trabajo,
sin hacer merge ni declarar release:

- control-plane: `agent/governed-sst-release-train` en `396147b`;
- `sst-fend`: `fix/SST-26/CR-SST-0086/dictionary-secrets-panel` en `832b39e`;
- `sst-bend`: `feat/SST-26/CR-SST-0086/dictionary-secrets-release-readiness`
  en `b47ca01`;
- `4uentes-auth`: `fix/SST-26/CR-SST-0086/development-image-publish` en
  `5d72279`.

Los dos logs temporales `tmp-bf-dev.err` y `tmp-bf-dev.log` de `4uentes-auth`
quedaron exclusivamente en el working tree local y no fueron incluidos en el
commit.

La apertura de PRs queda bloqueada por condiciones externas verificadas:

- `gh` tiene una credencial inválida y requiere autenticación humana nueva;
- la app GitHub disponible no tiene acceso a `sst-fend`, `sst-bend` ni
  `4uentes-auth`;
- `4uentes-ards-control-plane` no posee una rama `develop`, por lo que crear un
  PR hacia esa base requeriría una decisión explícita sobre la estrategia de
  branching.

El comentario Jira `10298` replica esta publicación parcial sin transferir
autoridad al tracker. Ninguna rama publicada elimina el blocker de 18 artículos
sin payload ni habilita `done`, `Listo` o `released`.
