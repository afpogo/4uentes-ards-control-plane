# CR-SST-0193 - QA Del Camino Normal De Identidad

Fecha: 2026-08-23.

## Resultado

PASS. El runtime local/dev completo una corrida sintetica de 30 aserciones con
una sesion real emitida por `4uentes-auth` y el resolver publicado por
`CR-SST-0210`.

La imagen desplegada de `sst-bend` fue
`ghcr.io/afpogo/sst-bend:develop-8e2eeb3f0285`. Ese tag corresponde al merge
commit de [`afpogo/sst-bend#24`](https://github.com/afpogo/sst-bend/pull/24),
que contiene el head owner `9d166fcb7a3ed71fe1bfb96e4c4f4fa3d8edd56c`.
Auth uso `ghcr.io/afpogo/4uentes-auth:develop-0be811f3efa2`.

## Recorrido probado

1. Se registro y autentico un usuario sintetico por el flujo Auth `raw-v2`.
2. El access token contenia `sub`, `sid`, `token_use=access` y audience
   `sst-api`; no contenia `tenant_id` ni `application_id`.
3. La primera lectura de `/user-memory/space` fallo cerrada con `403` porque el
   account creado para el sujeto aun no tenia tenant explicito.
4. El fixture asigno un tenant QA al account exacto. No hubo inferencia,
   backfill ni uso de un tenant por defecto.
5. Con `x-active-account-id`, Bend resolvio el sujeto y la sesion desde Auth,
   la membresia y el tenant desde el account, y `application_id=sst` desde la
   aplicacion. Headers falsificados de tenant y aplicacion fueron ignorados.
6. El flujo creo un evento, una propuesta en revision, acepto la propuesta,
   leyo el record activo y registro un recall con una referencia de memoria.
7. Un segundo account del mismo usuario obtuvo otro memory space. No vio los
   records del primero y un recall cruzado fallo cerrado con `400`.
8. `logout` revoco la sesion exacta. El access token anterior fue rechazado por
   el endpoint de memoria con `403`.

El ensayo tambien confirmo que la migracion `accounts.tenant_id` estaba
presente y que `USER_MEMORY_ENABLED=true`. `SST_DEFAULT_TENANT_ID` no estaba
configurado.

## Limpieza Y Limites

El `finally` del harness retiro espacios, nodos, membresias, accounts y usuario
consolidados de Bend. Un readback posterior encontro `0` usuarios y `0`
accounts para las identidades exactas de la corrida. La limpieza Auth retiro
`1` sesion revocada y `1` usuario sintetico. Los scripts temporales tambien
fueron eliminados del nodo y de los pods.

El API Kubernetes del host en `127.0.0.1:57569` no respondia. El mismo cluster
saludable se inspecciono y ejercito mediante el `admin.conf` interno de su nodo
control-plane, sin reiniciar ni mutar infraestructura. No hubo datos reales,
deploy, cambios de feature flag, escrituras Jira ni mutacion adicional de
repositorios.

## Decision Del Gate

El blocker `identity_integration` de `CR-SST-0193` queda resuelto. La
persistencia, API, consentimiento, migraciones, aislamiento y camino normal de
identidad cuentan con evidencia suficiente para cerrar localmente la request.

Este cierre no inicia `CR-SST-0194`. Esa request conserva su requisito de
autorizacion explicita antes de mutar `sst-chatbot`, `sst-bend` u otro owner.
