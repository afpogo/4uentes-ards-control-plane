# Resultado de QA localhost del cache de historial

Fecha: 2026-08-29

Request: `CR-SST-0230`

Resultado: `PASS`

## Gate consumido

El PR `#196` publicó el subgate runtime autorizado y fue leído desde
`origin/main@799b7d5`. La autorización habilitaba exactamente una corrida
localhost con datos sintéticos y cleanup por contratos de producto. Redis
directo, Jira adicional, deployment, cluster y producción permanecieron
prohibidos.

## Preflight

- el facade localhost respondió `401` al GET sin autenticación cuando se usó el
  routing host esperado;
- se reutilizó `socket.io-client` ya instalado en el worktree owner de
  `CR-SST-0218`; no se instalaron ni actualizaron dependencias;
- el harness canónico rechazaba destinos no loopback y había pasado
  `node --check`, revisión de sanitización, `git diff --check` y el full check
  del control plane antes de su publicación.

## Ejecución

Se ejecutó una sola vez `npm run qa:cr-sst-0230:cache`. La salida sanitizada
fue:

```json
{"result":"pass","surface":"localhost","cache_sequence":["miss","hit","miss","hit"],"invalidation":"normal-product-turn","conversation_cleanup":"pass-product-api","identity_cleanup":"not-available-product-contract","evidence_fields":["outcomes","statuses","counts-only"]}
```

El harness comprobó además, sin imprimir payloads:

- cada read exitoso devolvió exactamente un enum allowlisted en
  `X-SST-Chat-History-Cache`;
- body y status permanecieron iguales entre cada par miss-hit;
- el turno normal incrementó los conteos de mensajes y eventos antes del
  segundo par;
- el borrado devolvió `204` y el read posterior devolvió `404` sin header de
  cache.

## Cleanup y privacidad

La conversación guardada fue eliminada por el facade Auth mediante el contrato
de producto y no resucitó en el read posterior. No se ejecutaron comandos Redis
ni lecturas de PostgreSQL, y no se conservaron password, bearer, cookie,
conversation ID, contenido, URL privada, key Redis ni payload del modelo.

Permanece una identidad sintética porque Auth no expone un contrato de producto
para eliminarla. Su email y credenciales se descartaron en memoria y no pueden
usarse para un cleanup posterior. Esta limitación ya era conocida por
`CR-SST-0207` y no se amplió mediante acceso directo al datastore.

## Resultado de lifecycle

La fila cache-aside de `CR-SST-0207` deja de estar bloqueada: la invalidación se
demostró por un turno normal sin eviction administrativa. `CR-SST-0207`
continúa `running` por sus límites independientes de edge reservado y cleanup
de identidades. `CR-SST-0230` queda listo para reconciliación terminal y
publicación; el cierre de `SST-124` requiere autorización Jira separada.
