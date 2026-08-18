# INIT-SST-0007 - Plan hibrido de chatbot en tiempo real

## Decision

SST-7 adopta una arquitectura hibrida:

```text
sst-fend
   | login / refresh / logout
   +--------------------------> 4uentes-auth (alias observado: node-auth)
   |                              | JWT de usuario + sid
   |
   | Socket.IO autenticado
   v
sst-bend ---- HTTP streaming M2M ----> sst-chatbot
   ^                                      |
   +--------- HTTP handoff durable -------+
```

- `4uentes-auth` conserva identidad, refresh y revocacion; no transporta
  mensajes de chat.
- `sst-bend` hospeda Socket.IO y es autoridad de conversaciones, mensajes y
  secuencias.
- `sst-chatbot` procesa turnos por HTTP streaming interno y no autentica
  usuarios ni persiste la conversacion canonica.
- HTTP sigue siendo el canal durable para historial, recovery y handoffs
  idempotentes.
- Socket.IO transporta chat, deltas y estados en tiempo real.

Socket.IO garantiza orden, pero su entrega predeterminada es `at-most-once`.
Por eso V1 agrega persistencia, IDs, acknowledgements y replay en la aplicacion.
La recovery nativa es acotada y siempre tiene fallback a Postgres.

Referencias oficiales:

- https://socket.io/docs/v4/delivery-guarantees/
- https://socket.io/docs/v4/middlewares/
- https://socket.io/docs/v4/connection-state-recovery/
- https://socket.io/docs/v4/using-multiple-nodes/

## Contratos planificados

### Identidad y sesiones

- Access JWT con `sid`, `token_use=access`, `chat:connect`, usuario,
  account/tenant, issuer, audience y expiracion.
- Refresh solamente por cookie HttpOnly; nunca por Socket.IO.
- Introspeccion interna de sesion para validar `sid`, sujeto y revocacion.
- Revalidacion antes de cada mensaje y lease maximo de 30 segundos.
- Client credentials separados para `session:introspect`, `chat:process` y
  `agent-handoff:submit` con audiences explicitas.

### Realtime y persistencia

- Namespace `/sst-chat/v1`, path configurable
  `/4uentes/realtime/socket.io` y feature flag apagado por defecto.
- Handshake por `auth.token`; no usar query string ni almacenamiento
  persistente del navegador.
- Tablas `chat_conversations`, `chat_messages` y `chat_events` con secuencia
  monotonica; retencion de contenido de 30 dias configurable.
- Unicidad por `conversation_id + client_message_id`.
- Persistir el mensaje humano antes de invocar al agente y la respuesta final
  antes de emitir `chat:assistant:completed`; los deltas son efimeros.
- Eventos cliente: `chat:join`, `chat:message`, `chat:cancel`.
- Eventos servidor: `chat:session:resumed`, `chat:message:accepted`,
  `chat:assistant:delta`, `chat:assistant:completed`,
  `chat:handoff:status`, `chat:error`.
- Acks, timeout, correlation ID, limites de tamano/rate y replay desde
  `last_seen_sequence`.
- Recovery acotada con `skipMiddlewares=false`; Postgres reconstruye el estado
  si la recovery nativa no alcanza.

### REST y runtime interno

- `POST /4uentes/v1/chat/conversations`.
- `GET /4uentes/v1/chat/conversations/:id/messages?afterSequence=`.
- `DELETE /4uentes/v1/chat/conversations/:id`.
- `POST /4uentes/v1/agent-handoffs` con recibos e idempotencia.
- `POST /internal/v1/chat/turns` M2M con response
  `application/x-ndjson` (`delta`, `completed`, `error`).
- `ChatRuntimePort.process_turn()` independiente de HTTP y Socket.IO.
- `OrchestratorPort` permanece proposal-only, auditable y sin reintentos
  automaticos.
- Cancelar el stream interno ante cancelacion del usuario o desconexion sin
  posibilidad de reanudacion.

### Frontend

- Ruta protegida `/chat`.
- `socket.io-client` mediante singleton y provider bajo contexto autenticado.
- Token solamente en memoria; refresh coordinado seguido por reconnect para
  revalidar `sid`.
- Un refresh y un reconnect ante `401`; logout ante `403` o revocacion.
- Backoff acotado, estado offline y retry manual.
- Redux Persist no guarda tokens, deltas ni contenido conversacional.
- La conexion directa a `sst-bend` es una excepcion limitada a realtime;
  identidad y las demas APIs siguen por `4uentes-auth`.

## Atomizacion

| CR | Objetivo y owner | Output verificable | Riesgo | Gate |
| --- | --- | --- | --- | --- |
| `CR-SST-0165` | Fijar contrato V1 y excepcion de boundary realtime; owners cross-repo. | Matriz de producer/consumer, eventos, REST, flags y no-goals. | Alto, arquitectura. | Owner docs de todos los productores/consumidores. |
| `CR-SST-0166` | `4uentes-auth`: `sid`, revocacion e introspeccion. | Contrato de claims, refresh/logout e introspeccion. | Alto, auth. | Tests de sesion, revocacion y tenant. |
| `CR-SST-0167` | Identidades M2M entre servicios. | Audiences, scopes, rotacion y negative tests. | Alto, seguridad. | No secretos en repo/logs; tokens de servicio validados. |
| `CR-SST-0168` | `sst-chatbot`: runtime HTTP streaming. | NDJSON, port independiente, cancelacion y errores. | Alto, contrato API. | Check Python, streaming/cancelacion y M2M. |
| `CR-SST-0169` | `sst-bend`: Socket.IO, persistencia y bridge. | Server explicito, tablas, replay, acks e idempotencia. | Alto, datos/realtime. | Migraciones, concurrencia, isolation y backpressure. |
| `CR-SST-0170` | Handoff durable y receipts. | Endpoint idempotente, estados y audit trail proposal-only. | Alto, cross-repo. | Duplicados, replay y ausencia de retries autonomos. |
| `CR-SST-0171` | `sst-fend`: pagina y cliente realtime. | `/chat`, provider, refresh/reconnect y offline. | Alto, auth UX. | Tests frontend y no persistencia sensible. |
| `CR-SST-0172` | E2E, recovery y cierre. | Flujo completo validado y evidencia owner. | Alto, integracion. | Checks de cuatro repos y `npm run check` del control-plane. |

Cada CR debe avanzar a ejecucion de manera independiente, en branch/worktree
limpio, con owner docs en el repo responsable. Esta planificacion no modifica
repos funcionales ni autoriza por si sola su mutacion.

## Orden y dependencias

1. `CR-SST-0165` fija el contrato y los boundaries.
2. `CR-SST-0166` y `CR-SST-0167` habilitan identidad de usuario y servicio.
3. `CR-SST-0168` y `CR-SST-0169` implementan runtime y bridge.
4. `CR-SST-0170` cierra el canal durable de handoff.
5. `CR-SST-0171` adopta el cliente protegido.
6. `CR-SST-0172` valida E2E y decide la promocion de capability.

## Despliegue V1 y no-goals

V1 opera en una sola instancia local/dev y con flags apagados por defecto.
Redis Streams, afinidad de sesion, proxy WebSocket y escalado horizontal quedan
fuera de scope y requieren un CR productivo posterior. La capability permanece
`draft` hasta cerrar `CR-SST-0172` con evidencia runtime.
