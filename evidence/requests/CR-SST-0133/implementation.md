# Implementación CR-SST-0133

Fecha: 2026-07-12.

`PlaudArticleUpsertService` persiste artículo, filtro y transcript payload en
una única transacción. El lookup idempotente ocurre dentro de la transacción,
replay actualiza sin duplicar y un filtro faltante se repara con `findOrCreate`.

El account efectivo proviene sólo del job/fallback configurado; se ignora
`rawPayload.accountId`. Un providerRef global perteneciente a otra cuenta
devuelve 409 antes de mutar.

La convergencia `markCompleted` posterior al commit se separó como
`CR-SST-0142 / SST-82` porque requiere recovery/outbox, no una ampliación del
aggregate transaction.

