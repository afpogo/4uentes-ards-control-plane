# CR-SST-0123 - Owner Documentation Summary

## Estado

- Fecha: 2026-07-05
- Request: `CR-SST-0123`

## Update 2026-07-06

Owner docs/specs actualizados por ampliacion justificada de contrato:

- `sst-fend: docs/38-learning-workspace-frontend.md`
- `sst-fend: specs/38-learning-workspace-frontend.yml`
- `sst-bend: docs/capabilities/outbound/article-text-ingestion.md`
- `sst-bend: specs/capabilities/outbound/article-text-ingestion.yaml`
- `sst-bend: specs/api/routing.yaml`

El cambio documenta que los articulos `text` pueden nacer sin URL y que
`LearningContentTag` se asocia por `LearningWorkspace` luego de `preview ->
accept`, no como parte del response de `POST /articulos`.
- Owner repo: `sst-fend`
- Resultado: owner docs actualizadas.

## Artefactos actualizados

- `docs/38-learning-workspace-frontend.md`
  - Agrega seccion `CR-SST-0123 - Anotacion Local En /learning`.
  - Documenta que `/learning` sintetiza anotacion local cuando no recibe
    anotaciones externas.

- `specs/38-learning-workspace-frontend.yml`
  - Actualiza `orchestrator_link.request_id` a `CR-SST-0123`.
  - Agrega la regla must para sintetizar anotacion draft desde granularidad.
  - Agrega QA manual para verificar `annotations[]` no vacio.

- `docs/capabilities/inbound/node-auth--learning-workspace-context.md`
  - Documenta que `sst-fend` mantiene el BFF como passthrough y no redefine el
    contrato upstream.
  - Agrega el comportamiento consumidor de `CR-SST-0123`.

- `specs/capabilities/inbound/node-auth--learning-workspace-context.yaml`
  - Agrega `standalone_learning_sheet` como comportamiento implementado.
  - Mantiene la dependencia upstream en `node-auth`.

## Politicas

- `owner-documentation-authority-policy`
- `human-doc-language`
- `agent-architecture-boundary-policy`

## Decision

La documentacion owner queda alineada para la implementacion frontend. La
validacion E2E de `CR-SST-0118 / SST-48` sigue pendiente.
