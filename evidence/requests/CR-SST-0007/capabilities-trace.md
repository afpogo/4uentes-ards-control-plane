# CR-SST-0007 - Rastreo De Capabilities De `sst_chatbot`

Observado el: 2026-05-20

## Resumen

`sst_chatbot` existe localmente en:

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\chatboot-integration\sst_chatbot
```

No aparece catalogado en `4uentes-orchestor` y no es un repo Git independiente
en esta copia local. Es una carpeta untracked dentro del repo local
`C:\Users\andre\Desktop\4uentes\apps\4uentes-sst`.

El repo define 7 capabilities en `specs/00-index.yaml`, todas como source of
truth local de `sst_chatbot`.

## Capabilities Encontradas

| Capability ID | Status | Path | Lectura |
|---|---|---|---|
| `provider-abstraction` | `draft` | `specs/capabilities/provider-abstraction.yaml` | Contrato provider-agnostic para chat, stream, batch, structured output, retrieval context y tools. |
| `ards-structure-generation` | `draft` | `specs/capabilities/ards-structure-generation.yaml` | Generacion segura de estructuras ARDS/SDD desde intencion estructurada. |
| `retrieval-augmented-generation` | `draft` | `specs/capabilities/retrieval-augmented-generation.yaml` | RAG para agentes SST con contexto privado, reciente y scoped por workspace/account. |
| `retriever-strategies` | `candidate` | `specs/capabilities/retriever-strategies.yaml` | Contrato de retrieval estable: similarity, threshold, MMR e hybrid futuro. |
| `user-workspace-provisioning` | `candidate` | `specs/capabilities/user-workspace-provisioning.yaml` | Provision de workspace ARDS/SDD generado para usuario/account. |
| `generated-workspace-governance` | `candidate` | `specs/capabilities/generated-workspace-governance.yaml` | Gobierno de archivos generados, manifest, descarga e indexacion. |
| `agent-lifecycle-and-orchestrator-boundary` | `draft` | `specs/capabilities/agent-lifecycle-and-orchestrator-boundary.yaml` | Boundary de lifecycle de agentes y handoff hacia `4uentes-orchestor`. |

## Evidencia De Indice

`sst_chatbot:specs/00-index.yaml` lista las capabilities en:

- linea 6: seccion `capabilities`
- lineas 7-8: `provider-abstraction`
- lineas 10-11: `ards-structure-generation`
- lineas 13-14: `retrieval-augmented-generation`
- lineas 16-17: `retriever-strategies`
- lineas 19-20: `user-workspace-provisioning`
- lineas 22-23: `generated-workspace-governance`
- lineas 25-26: `agent-lifecycle-and-orchestrator-boundary`

## Capability Relevante Para `4uentes-orchestor`

La capability con contrato directo hacia `4uentes-orchestor` es:

```text
agent-lifecycle-and-orchestrator-boundary
```

Evidencia en `sst_chatbot:specs/capabilities/agent-lifecycle-and-orchestrator-boundary.yaml`:

- linea 6: define que eventos SST pueden producir operation intents validados
  para handoff a `4uentes-orchestor`.
- linea 14: separa ownership de `4uentes_orchestor`.
- linea 44: define `operation_intent`.
- linea 59: define `handoff_payload`.
- lineas 70-71: exige `idempotency_key` y `correlation_id`.
- linea 82: establece que este repo solo puede pedir trabajo de server mediante
  el handoff boundary de `4uentes-orchestor`.

## Estado En `4uentes-orchestor`

Busqueda en el control-plane antes de crear esta evidencia:

- `sst_chatbot`
- `sst-chatbot`
- `chatbot`
- `agent-lifecycle-and-orchestrator-boundary`
- `provider-abstraction`
- `ards-structure-generation`
- `retrieval-augmented-generation`
- `retriever-strategies`
- `user-workspace-provisioning`
- `generated-workspace-governance`

Resultado:

- No habia referencias catalogadas en `catalog/`, `solutions/`, `docs/`,
  `inventory/`, `evidence/`, `requests/` ni `specs/`.
- Las primeras referencias dentro del control-plane son `CR-SST-0007` y esta
  evidencia.

## Gap De Catalogo

`sst_chatbot` no esta en:

- `catalog/services/*.yaml`
- `solutions/sst.yaml`
- `inventory/phase-0.md`

Por lo tanto, hoy no participa del planner como servicio SST. Cualquier request
que necesite impactarlo debe tratarlo como evidencia local externa o abrir un
request explicito para catalogarlo.

## Recomendacion

No adoptar automaticamente estas capabilities en `4uentes-orchestor`.

Primero decidir si `sst_chatbot` sera:

1. un servicio logico nuevo del catalogo;
2. un repo experimental externo observado solo como evidencia;
3. un subcomponente de `sst-extension` o `sst-bend`;
4. un futuro repo independiente con handoff propio.

La capability `agent-lifecycle-and-orchestrator-boundary` deberia ser la primera
candidata para una revision formal porque define responsabilidades que el
control-plane todavia no modela.
