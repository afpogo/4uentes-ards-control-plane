# Implementación CR-SST-0142

Fecha: 2026-07-12.

`sst-bend` cerró la ventana entre el commit del aggregate Plaud y el estado del
job. `PlaudArticleUpsertService` ejecuta el callback `markCompleted` dentro de
la misma transacción Sequelize/PostgreSQL que artículo, transcript payload y
filtro. Una excepción o pérdida de lease revierte toda la unidad antes del
retry.

El worker propaga `startedAt` desde el claim como token de lease. Todas las
transiciones usan CAS por `id + processing + startedAt`; un worker antiguo no
puede cerrar ni reprogramar una lease nueva. Los jobs stale se recuperan con
`FOR UPDATE SKIP LOCKED`, límite `PLAUD_MAX_ATTEMPTS` y precisión de milisegundo
compatible con `Date` de JavaScript.

No hubo migración, outbox, reclasificación histórica ni cambios HTTP/BFF/UI.

