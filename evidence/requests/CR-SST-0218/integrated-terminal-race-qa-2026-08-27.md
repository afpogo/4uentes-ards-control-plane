# QA integrado terminal y de carrera de CR-SST-0218

Fecha observada: 2026-08-27, zona `America/Buenos_Aires`.

## Baseline y readback

El PR de checkpoint [control-plane #143](https://github.com/afpogo/4uentes-ards-control-plane/pull/143)
fue fusionado en `6d9d320ae7f256ab354b5757e0e71578434a5d0d`.
El head `671813673b5a4c27b9f88d70da26fcadd66a08f3` es alcanzable desde
`origin/main`, que apuntaba exactamente al merge durante el readback.

El preflight localhost confirmó:

- Argo CD `sst-app`: `Synced/Healthy`;
- root y JWKS: HTTP 200 usando el host Ingress `localhost`;
- Bend desplegado: `ghcr.io/afpogo/sst-bend:develop-9faae46cd2af`;
- Fend desplegado: `ghcr.io/afpogo/sst-fend:develop-bd9b8d2aa52a`;
- pods Bend, Fend, Auth, Redis, PostgreSQL y chatbot: `Running/Ready`.

No se reinició, sincronizó ni modificó el cluster.

## Harness reproducible

Se amplió `scripts/qa-cr-sst-0207-realtime.js` para validar el contrato exacto
de `CR-SST-0218`. El harness usa una identidad aleatoria `example.invalid`, dos
sesiones autenticadas y dos sockets del mismo principal. No persiste ni imprime
passwords, bearer tokens, cookies, IDs de conversación, cuerpos de mensajes ni
URLs privadas.

La ejecución fue:

```powershell
$env:QA_SOCKET_IO_CLIENT='<checkout-fend>/node_modules/socket.io-client'
node scripts/qa-cr-sst-0207-realtime.js
```

## Resultado

| Fila | Resultado | Evidencia sanitizada |
| --- | --- | --- |
| Finish temporal terminal | PASS | Dos sockets activos recibieron una sola entrega cada uno de `chat:conversation:terminated`; reason `temporary_finished`; payload limitado a `conversationId` y `reason`; history 404 y rejoin rechazado. |
| Delete guardado con turno activo | PASS | El turno ya había emitido `chat:message:accepted`; DELETE produjo `saved_deleted` una vez por socket, canceló el turno, no emitió `chat:assistant:completed`, dejó history en 404 y no reapareció en el listado guardado. |

Resultado terminal del harness: `pass`. La prueba confirma broadcast a todas
las sesiones autorizadas del room, payload mínimo, fencing antes del borrado y
ausencia de resurrección visible.

El `npm run check` posterior concluyó con 0 fallos; también pasaron los gates
de publicación, owner documentation y documentación visual.

## Cleanup y privacidad

Las dos conversaciones sintéticas fueron finalizadas o eliminadas mediante
`/api/chat`; no quedó conversación recuperable por history, rejoin o listado.
La única identidad Auth creada por esta corrida no tiene una ruta de eliminación
de producto. Se registra como residuo sintético y no se intentó mutar Mongo,
PostgreSQL, Redis ni Kubernetes para retirarla.

La evidencia conserva únicamente estados, conteos y SHAs públicos. No contiene
credenciales, tokens, cookies, contenido conversacional, IDs opacos ni secretos.

## Alcance de cierre

Las filas terminales y de carrera que originaron `CR-SST-0218` quedan
satisfechas en localhost. `CR-SST-0207` permanece `running` por sus gates
independientes de cache eviction product-safe, edge reservado y cleanup
histórico; esos límites no se silencian ni se atribuyen a este cambio.

El próximo gate es fusionar y leer este checkpoint. Luego puede prepararse el
lifecycle terminal de `CR-SST-0218`; cualquier transición de Jira `SST-121`
requiere un lote exacto y una autorización separada.
