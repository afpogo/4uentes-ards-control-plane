# Gate de ejecución Auth/BFF: adopción de onboarding V1

Owner del gate: `4uentes-orchestor`. Owner funcional: `4uentes-auth`.
Fecha: 2026-09-10. Rol primario: runbook propuesto para un lote todavía no
autorizado. Fuentes técnicas: capability `onboarding-v1` y API de `sst-bend`
publicadas en `develop@cbb2222bb3a0898be328dc4e6765eb72f853745e`.

Este documento prepara el próximo gate de `CR-SST-0243`. No publica el
lifecycle running, no modifica Auth ni Jira y no autoriza runtime. La decisión
humana sobre el lote exacto sigue siendo externa a este runbook.

## Estado leído y condición de entrada

El control plane remoto se leyó en
`main@eceaa7935f9903dfe902ed4ba68fd74e73392113`. CR-SST-0243 continúa
`planned`, sin running, Jira key o autorización de child/runtime. CR-SST-0242
ya publicó la capability owner, la imagen y el desired state de desarrollo;
no se ejecutaron migraciones ni se habilitó el flag.

Auth se leyó en `develop@d9263d1801963047eb01a1956b2a5ee54244a12f`.
No existe branch o PR de CR-SST-0243. Su checkout primario contiene trabajo
ajeno y queda fuera de alcance: la ejecución deberá usar un worktree nuevo y
limpio. El preflight Jira encontró cero candidatos CR-SST-0243 y confirmó la
jerarquía `SST-127 Epic -> SST-128 Tarea -> nueva Subtask`; hoy SST-129 es la
única subtarea observada bajo SST-128.

## Contrato y resolución de fixtures

La fuente de verdad funcional es la revisión owner fijada de Bend:

- `specs/api/onboarding.yaml` define GET/PATCH
  `/4uentes/v1/onboarding/me`, POST
  `/4uentes/v1/onboarding/me/outcomes`, campos, valores, errores y headers.
- `specs/capabilities/outbound/onboarding-v1.yaml` publica la adopción esperada
  por Auth y Fend con estado `ready-for-consumer`.
- Los casos del harness HTTP owner fijan DTO y fail-closed básico; el harness
  Postgres owner cubre concurrencia, transacción y replay contra esa revisión.

No se publicó un artefacto ejecutable independiente llamado “shared DTO
fixtures”. Tampoco se lo convierte en una nueva fuente paralela. Para este
gate, los campos y valores enumerados en la spec owner, junto con los casos del
harness owner, son los fixtures contractuales. Auth materializará fixtures de
consumidor fijados a `cbb2222...` en sus pruebas enfocadas. Si los ejemplos de
consumidor no cubren cada acción, estado y error aceptado, el PR no puede
integrarse. Una divergencia posterior exige reconciliación owner; el BFF no
elige silenciosamente otro contrato.

## Hallazgo funcional que integra el alcance

El BFF actual descarta `onboardingAttemptId` en `POST /api/articles`:
`ArticuloDTO` no lo lee, `getCreateRequestBody` no lo incluye en el hash de
idempotencia y `ArticuloEntity` no lo transporta al datasource. Por ello, un
artículo de texto creado desde el walkthrough no podría producir en Bend la
prueba server-side del intento activo.

El lote adopta el campo UUID opcional a través de DTO, request canónico para
idempotencia, entidad y payload upstream. Auth no interpreta actor, cuenta,
meta, intento o completion. La misma key con distinto `onboardingAttemptId`
debe producir conflicto; un create normal sin metadata conserva exactamente su
comportamiento.

## Lote owner propuesto

Después de publicar y leer el running, se refrescará Auth `develop` y se creará
`agent/cr-sst-0243-onboarding-relay` en un worktree aislado. Sólo se permite
modificar `4uentes-auth` y abrir un PR a `develop`; este gate no permite
fusionarlo. El workflow owner ejecuta check y build de imagen en pull request
con `push=false`; login en GHCR, publicación de imagen y actualización de Infra
sólo ocurren ante un push a `develop` y quedan para un gate de integración
separado.

Unidades auditables:

1. Adoptar capability inbound de Bend y publicar capability outbound del BFF,
   actualizar routing/integrations, índices y documentación owner en español.
2. Implementar un relay delgado para GET/PATCH `/api/onboarding/me` y POST
   `/api/onboarding/me/outcomes`, montado bajo `/api`.
3. Propagar únicamente `Authorization`, `X-Active-Account-Id`, la compatibilidad
   explícita `X-Account-Id`, `X-Correlation-Id` y, sólo en PATCH/POST,
   `Idempotency-Key`. Ningún otro header de identidad cruza el relay. Del body
   se eliminan exclusivamente `user` y `authTokenPayload`; los demás campos de
   cliente llegan intactos para que Bend aplique su validación normativa.
4. Exigir `Idempotency-Key` de 1–128 caracteres ASCII imprimibles sin espacios
   en mutaciones. Preservar sólo la matriz status/código owner: 400 con
   `ONBOARDING_INVALID_REQUEST` o `ONBOARDING_IDEMPOTENCY_REQUIRED`; 403 con
   `ONBOARDING_SCOPE_REQUIRED`; 409 con `ONBOARDING_REVISION_CONFLICT`,
   `ONBOARDING_IDEMPOTENCY_CONFLICT` o `ONBOARDING_INVALID_TRANSITION`; 422 con
   `ONBOARDING_INVALID_OUTCOME`; y 503 con `ONBOARDING_DISABLED`. Código
   desconocido o combinación incorrecta se sanitiza, al igual que bodies y
   headers no permitidos. Timeout responde 504 y red/redirect 502.
5. Preservar `onboardingAttemptId` UUID opcional en el create de artículos y en
   su hash idempotente, sin persistencia ni semántica de onboarding en Auth.
6. Agregar pruebas enfocadas reproducibles, ejecutar build y `npm run check`,
   documentar resultados, hacer commit/push y abrir PR owner.

Superficies previstas: constantes, datasource, repository, use case,
controller y routes nuevos de onboarding; exports y `src/presentation/routes.ts`;
`specs/routing.yaml`, `specs/integrations-api.yaml`, capabilities inbound y
outbound, `docs/bf/onboarding.md`, documento owner de la tarea y harness. Para
el metadata de artículo: `src/domain/dtos/articulo/articulo.dto.ts`,
`src/domain/entities/articulo/index.ts`,
`src/domain/use-cases/Articulo/createArticuloIdempotent.usecase.ts`,
`src/presentation/articulo/controller.ts` y el datasource sólo si el transporte
no queda resuelto por la entidad. Como el cambio es observable en el contrato
de create, también se actualizarán
`specs/capabilities/inbound/sst-bend--article-text-ingestion.yaml`,
`specs/capabilities/outbound/article-text-ingestion.yaml`, sus documentos owner
en `docs/capabilities/`, routing e integrations.

## Pruebas y condiciones de detención

El owner debe probar 401 local sin llamada upstream y upstream 401 sanitizado;
métodos, paths y bodies exactos; allowlist de headers; ausencia de idempotencia
en GET; key ausente, inválida y límites 1–128; eliminación exclusiva de `user`
y `authTokenPayload`; conservación de otros campos de cliente; respuestas
exitosas y `Cache-Control: private, no-store` también en 401 y errores; matriz
segura 400/403/409/422/503; código conocido con status incorrecto; scrub de
datos desconocidos; timeout 504; red/redirect 502; una sola llamada upstream y
cero autoretry en mutaciones/fallos; y ausencia de estado compartido bajo
concurrencia. El nuevo harness debe formar parte explícita de `npm run check`.

El create de texto debe demostrar que `onboardingAttemptId` llega a Bend y
participa en el hash local, que misma key/campo distinto da 409 y que el create
sin metadata no cambia. Son obligatorios el build, el harness enfocado y el
`npm run check` completo del owner. El control plane ejecutará su check completo
antes de publicar cada avance.

Detener si falta autenticación confiable, se filtra un header/body no permitido,
se almacena progreso en Mongo, se infiere autoridad de negocio, aparece una
regresión del create normal, cambia el contrato owner o falla un check. El
rollback antes de merge es cerrar o corregir el PR; no hay rollback runtime
porque este lote no publica imagen ni modifica Infra.

## Lote Jira exacto propuesto

Tras publicar/read back del running, volver a leer metadata de proyecto/issues,
JQL de duplicados, jerarquía y estado/resolution de SST-127/SST-128, existencia
del tipo `Subtask`, transición aplicable a `En curso` y tipo/dirección del link
`Blocks`. Sólo entonces crear exactamente una Subtask bajo SST-128, derivada
de la Epic SST-127:

- Summary: `[SST][INIT-SST-0011][CR-SST-0243] Relay onboarding V1 through the authenticated BFF`
- Descripción: `Adoptar en 4uentes-auth la capability onboarding-v1 publicada por sst-bend y exponer GET/PATCH /api/onboarding/me y POST /api/onboarding/me/outcomes. El BFF sólo relaya identidad/sesión, Idempotency-Key, X-Correlation-Id, revision y errores sanitizados; también preserva onboardingAttemptId en POST /api/articles. No persiste progreso, no infiere actor ni decide completion. Owner docs, checks y pruebas negativas/concurrencia son gates. ARDS/SDD es autoridad; Jira sólo espejo.`
- Estado objetivo: `En curso`; resolution nula.
- Link: `Blocks` desde SST-129 hacia la nueva key, expresando que el contrato
  Bend publicado es dependencia de la adopción Auth.
- Comentario inicial exacto: `CR-SST-0243 inicio: lote Auth/BFF aprobado; lifecycle running publicado y leído desde main antes de modificar 4uentes-auth. Alcance limitado al relay autenticado de onboarding V1 y a preservar onboardingAttemptId en POST /api/articles; sin migración, deployment, habilitación de flags, datos reales ni cambios Bend/Fend/Infra. ARDS/SDD conserva autoridad; Jira es espejo y queda En curso.`

Máximo cuatro escrituras: create, una transición sólo si hace falta, un link y
un comentario. No tocar otras issues, parent, assignee, priority o resolution;
no cerrar, borrar ni reparentar. Si la creación queda incierta, ejecutar JQL
para reconciliar, sin reintentar. El lote se vuelve de un solo uso al comenzar
la primera escritura. En éxito se cierra después del readback final de key,
tipo, parent/Epic, estado, resolución, link y comentario. Ante cualquier write
parcial, fallo o resultado incierto, detener, marcar la autorización consumida,
hacer sólo reconciliación/readback y exigir una nueva autorización humana para
continuar.

La ventana propuesta comienza inmediatamente después de publicar y leer el
running y su ledger exacto desde `main`, dentro del mismo turno autorizado.
Expira al completar los readbacks Jira y del PR owner, ante el primer fallo o
resultado incierto, al perder credenciales/sesión o a los 60 minutos, lo que
ocurra primero. Una expiración no permite nuevas escrituras; sólo readback y
reconciliación hasta una autorización nueva.

## Próxima autorización requerida

El siguiente gate debe autorizar en una sola ventana: publicar/read back de
CR-SST-0243 running y su ledger exacto; ejecutar el lote Jira anterior; crear
el worktree Auth desde la revisión refrescada; implementar, validar, publicar
branch y abrir PR owner. Quedan expresamente fuera: merge del PR, publicación
de imagen, Infra/GitOps, runtime, migraciones, flags, datos reales y cambios en
Bend/Fend. Cualquier integración futura requiere otro gate humano con
preflight fresco.
