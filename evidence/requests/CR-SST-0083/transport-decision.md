# CR-SST-0083 - Decision de transporte para handoff runtime

## Objetivo

Seleccionar el primer transporte real para el handoff entre `sst-chatbot` y
`4uentes-orchestor` sin promover todavia la capability inbound fuera de
`draft`.

## Hechos observados

- `sst-chatbot` ya tiene boundary ARDS/SDD reconciliado y `docs/ai/policy.md`
  bajo `CR-SST-0082`.
- El control-plane sigue declarando que el transporte runtime real no fue
  seleccionado:
  `state/features/sst-chatbot.current.yaml`.
- La capability inbound del orchestrator sigue en `draft` y deja abiertas las
  opciones `HTTP`, `queue` o `worker`:
  `specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml`.
- `CR-SST-0022` implemento solo un adapter fake local y explicito que no debe
  convertirse en transporte real.

## Opciones evaluadas

### Opcion A - HTTP directo al orchestrator

Ventajas:

- Hace explicita la frontera cross-repo.
- Permite autenticacion, autorizacion, validacion sintactica y rechazo temprano
  en el punto de ingreso.
- Preserva que acceptance, queueing, retries y audit sigan siendo ownership del
  orchestrator.
- Mapea naturalmente un `operation_intent` o `handoff_payload` a un recurso
  auditable.

Costos:

- Requiere definir endpoint, auth, replay protection e idempotency contract.
- Obliga a modelar errores transitorios y respuestas de aceptacion/rechazo.

### Opcion B - Queue o event directo desde sst-chatbot

Ventajas:

- Alinea bien con procesamiento asincrono y throughput futuro.
- Puede reducir latencia de integracion con el scheduler interno.

Costos:

- Mezcla transporte externo con mecanismo interno de ejecucion demasiado pronto.
- Hace mas dificil separar auth, replay, audit, dead-letter y ownership de
  acceptance.
- Aumenta el riesgo de que el hijo parezca publicar trabajo ejecutable en vez de
  proponer intenciones.

### Opcion C - Worker interno compartido

Ventajas:

- Menor superficie inicial si todo vive en una sola boundary operativa.

Costos:

- No define un contrato cross-repo claro.
- Debilita la trazabilidad del handoff como acto aceptado por el orchestrator.
- Acopla demasiado temprano el runtime del hijo con la implementacion interna
  del orchestrator.

## Recomendacion

Recomendar `HTTP ingress -> validacion/aceptacion en orchestrator -> cola
interna del orchestrator`.

Esto significa:

- `sst-chatbot` entrega un payload estructurado a un endpoint de ingreso.
- `4uentes-orchestor` autentica, valida schema, aplica idempotency y decide
  `accepted`, `rejected` o `needs_review`.
- Solo despues de aceptar, el orchestrator traduce ese handoff a queue interna,
  retry policy y scheduling propio.

## Decision

- Recomendacion actual: `HTTP` como primer transporte externo.
- `Queue/event` queda como mecanismo interno posterior a la aceptacion, no como
  boundary inicial por defecto.
- `Worker` no alcanza para cerrar el boundary cross-repo.

## Inferencias

- Inferencia: esta secuencia reduce riesgo arquitectonico porque conserva una
  frontera de autoridad mas legible y auditable que exponer una queue directa.
- Inferencia: si mas adelante el volumen o resiliencia exigen otra topologia,
  el HTTP ingress puede seguir siendo el contrato externo mientras cambia la
  infraestructura interna del orchestrator.
