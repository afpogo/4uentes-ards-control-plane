# Gate de ejecución Bend: onboarding V1

Owner: `4uentes-orchestor` para autorización y coordinación; `sst-bend` para
contrato y runtime. Fecha: 2026-09-08. Rol: propuesta concreta de lote owner.
Estado: listo para revisión del lote; aún no autoriza mutación funcional.
Fuente: plan canónico CR-SST-0242 y handoff V1 de CR-SST-0240.

## Readback y observaciones

El plan de CR-SST-0242 fue integrado por PR #287 y continúa planned.
Se incorporó el avance canónico hasta `98e6c4a` preservando los cambios ajenos.
El check completo del baseline pasó: 53 documentos, 67 mapas, 0 FAIL.
La lectura `git ls-remote` confirmó Bend `develop` en
`fdc753ff0bf96e8b8b5f603a9aae11503aa2ace1`; el código se leyó con `git show`
desde esa revisión, sin modificar su checkout con cambios existentes.

Fuentes owner:

- `specs/api/user-memory-identity-scope.yaml`: usuario consolidado desde JWT
  sub, sesión activa y pertenencia verificada; Auth no define la cuenta SST.
- `src/apps/sst/presentation/controllers/articulos.controller.js`: create
  actualmente pasa `accountId`, sin actor ni intento al caso de uso.
- `src/apps/sst/application/articulos/create-articulo.usecase.js`: transacción
  de artículo, payload y filtro; ofrece el punto de integración del recibo.
- `src/apps/sst/infrastructure/db/postgres/articulos/sequelize-articulos.repository.js`:
  búsqueda por ID con scope de cuenta opcional; onboarding lo exigirá.
- `specs/capabilities/outbound/article-text-ingestion.yaml`: create de texto
  existente y respuesta 201; no constituye todavía verificador de onboarding.

## Decisión propuesta: prueba de actor e intento

El estado se particiona por usuario SST consolidado y producto `sst`; no por
sesión o dispositivo. El acceso al artículo también exige cuenta activa y
membership actuales. No se usan cuentas legacy ni identidad del body como
fallback. Si falta contexto confiable, no se crea ni completa onboarding.

`start` crea un `attemptId` opaco generado por Bend. `reopen` crea otro,
conservando los contadores y timestamps de activaciones previas. El intento
está ligado al usuario y `journeyVersion`; una meta ya elegida no se resetea
por retry. Fend recibirá el intento desde GET/PATCH.

El create general de texto admite metadata opcional `onboardingAttemptId`.
No transmite actor, cuenta ni versión como autoridad. Cuando está presente:

1. La ruta resuelve actor desde sesión/contexto owner y verifica su cuenta.
2. El caso de uso comprueba que el intento pertenece al actor, sigue activo y
   tiene Articles seleccionado; si no, rechaza sin crear el artículo.
3. Bloquea la fila del intento y revalida estado/meta antes de escribir, para
   serializarse con skip/reopen. Bajo la misma transacción de artículo/payload/filtro, crea un recibo mínimo
   de intento, actor, cuenta, artículo y tipo `article_created`.
4. El recibo sólo queda visible al commit; un rollback no deja prueba válida.
5. POST outcomes exige intento actual, artículo existente autorizado y ese
   recibo. La actualización de revisión, consumo y completion es atómica.

El create sin metadata mantiene su comportamiento actual; no crea estado
onboarding. El recibo no completa por sí mismo: sólo prueba el resultado para
el POST outcomes. Después de perder una respuesta, el usuario puede retomar
la verificación del artículo original; un replay del create nunca se reasigna
a un intento nuevo. El owner deberá conservar una única prueba por
`actor + attemptId + articleId + outcomeType`.

Se agrega `attemptId` a los DTO GET/PATCH y POST outcomes. `resourceRef`
continúa siendo el ID de artículo, sin título o contenido. Una cuenta
compartida o timestamp reciente nunca sustituyen la prueba de actor.
Auth/Fend deberán adoptar estos campos al ejecutar sus slices; este lote no
modifica esos repositorios.

## Decisión propuesta: persistencia y retención

La propuesta define ventanas explícitas para poder implementar y probar:

| Registro | Retención propuesta | Datos |
| --- | --- | --- |
| Progreso durable | Hasta eliminación de la identidad; sin TTL por inactividad | Estado, meta, versión, revisión y timestamps |
| Historial resumido | Mismo ciclo de vida que progreso | Conteo y timestamps de completions, sin contenido ni IDs de artículos |
| Respuesta de idempotencia | 24 horas desde aceptación | Hash de key/payload y respuesta mínima; scope por actor y operación |
| Prueba de resultado pendiente | 30 días desde creación | Actor, cuenta, intento, artículo, tipo y timestamps |
| Prueba consumida | Hasta vencer su ventana de replay; después se elimina la referencia de artículo | Marca de consumo y resultado mínimo |

La expiración de prueba pendiente no borra el progreso: exige un resultado
nuevo para activar. Si se borra el artículo antes de verificar, la activación
se rechaza. Borrarlo después no revoca una completion legítima, pero elimina
su referencia. Borrar identidad elimina estado, recibos e idempotencia por
cascade o servicio owner; ninguna retención de logs externos se amplía aquí.

Un job owner purga filas vencidas por lotes; los handlers también tratan las
filas vencidas como ausentes, aunque el job se retrase. Después de 24 horas no
se promete replay idéntico: el cliente debe refetch y usar revisión actual.
La finalización ya aplicada no se repite porque status/revisión y consumo
siguen siendo barreras. Los TTL son decisiones propuestas de este lote, no
política existente ni autorización para retener contenido.

## Lote owner preparado

Branch propuesta: `agent/cr-sst-0242-onboarding-v1`, worktree nuevo desde el
`origin/develop` refrescado después de publicar running. Preservar checkout
actual. Repo permitido: únicamente `sst-bend`.

Superficies permitidas:

- Nuevos módulos onboarding en application/domain/presentation e infraestructura
  Postgres bajo `src/apps/sst/`, más wiring necesario en su servidor.
- `articulos.controller.js` y `create-articulo.usecase.js`, DTO de artículo y
  wiring del caso de uso, exclusivamente para metadata opcional y recibo atómico.
- Nuevas migraciones aditivas en `db/migrations/` y modelos correspondientes.
- `specs/api/onboarding.yaml`, capability outbound onboarding V1, índices,
  spec de article-text-ingestion y documentación humana owner enlazada.
- Tests onboarding, HTTP harness, migración, concurrencia y replay; wiring de
  checks en `package.json` y registro owner de CR-SST-0242.

Operaciones propuestas: implementar, probar localmente en entorno aislado,
commit, push y PR owner a develop; integrar sólo con checks y revisión
aprobados y leer el merge canónico. El gate de integración deberá verificar
que el flag está apagado por defecto y que el código no ejecuta migraciones
automáticamente al desplegar.

No incluye datos reales, migración de la base compartida, recreación de
Compose, deployment, cambios de Auth/Fend/infra, ni habilitar cohortes. La
prueba Postgres exige una base descartable identificada antes de crear datos;
si no está disponible, se registra bloqueo y no se declara completion.

## Validación y stop conditions

Pruebas obligatorias: usuario distinto en misma cuenta; otra cuenta; metadata
de intento ajeno; intento previo; fallo/rollback de creación; artículo borrado;
start/reopen concurrentes; skip durante creación; dos POST outcomes simultáneos;
retry con misma key y payload distinto; replay después de restart; TTL antes y
después del límite; purge retrasado; eliminación de identidad; flag apagado.

Validar además el create sin metadata, DTO/error sanitizado, JWT/sesión
vencida, permisos revocados entre create y outcomes y no persistencia de
contenido. El owner debe añadir checks reproducibles y ejecutar `npm run check`
completo más pruebas Postgres de transacción/migración. El control plane debe
ejecutar su `npm run check` completo antes de cualquier cierre local.

Detener ante falta de actor confiable, recibo no atómico, scope ambiguo,
regresión de create normal o falla de checks. Rollback funcional: flag off,
Home en consumidores y preservar progreso; no revertir tablas con datos.

## Lote Jira preparado, separado del ya consumido

Request CR-SST-0242, provider Jira, proyecto SST. Candidato único:
`[SST][INIT-SST-0011][CR-SST-0242] Implement durable onboarding and verified article outcomes`.
Tipo Subtask; padre SST-128, cuya Epic es SST-127. Estado objetivo En curso.

Operaciones propuestas: repetir JQL y leer jerarquía/tipos; crear una sola
Subtask con descripción que resuma este lote y enlaces ARDS/SDD; transición
a En curso; un comentario inicial y uno de avance al publicar el contrato
owner; readback de tipo/padre/estado/comentarios. No escribir en SST-127 ni
SST-128, asignar, cambiar prioridad, cerrar, borrar o reparentar.
Ventana propuesta: próxima ejecución aprobada, hasta el readback del lote.
Una creación incierta obliga a reconciliar por JQL antes de reintentar.

## Estado del gate

Las superficies y decisiones están listas para una aprobación concreta.
CR-SST-0242 permanece planned hasta aprobar este lote, publicar running y
leerlo desde main. No se modificó Bend ni se reutilizó autorización Jira.

Validación del documento y lifecycle: `npm.cmd run check` completo pasó con
exit 0, 53 documentos, 67 mapas y 0 FAIL, incluyendo owner documentation.
Es evidencia del control plane; no son pruebas ejecutadas del backend propuesto.
