# CR-SST-0194 - Readback De Publicación Owner

Fecha: 2026-08-23.

## Resultado Del Gate

PASS para implementación y publicación owner. Los tres repositorios autorizados
publicaron sus contratos en el orden definido por el plan. No se tocó Jira,
infraestructura, feature flags ni datos productivos.

| Owner | PR | Head owner | Merge commit | Checks |
|---|---|---|---|---|
| `4uentes-auth` | [#13](https://github.com/afpogo/4uentes-auth/pull/13) | `7ee5049eee6ef04de7961ba61f8efa24355a8009` | `b9c38fc8f829786c08c45a789b9312a24a1dd3df` | `build-publish-update` PASS |
| `sst-bend` | [#25](https://github.com/afpogo/sst-bend/pull/25) | `922b2c076c579c016dfe93086170ae7dee43688e` | `a15ebcae5da371abcef82d27f7d5c1a1fda59f95` | Node 18 PASS, Node 20 PASS, image PASS |
| `sst-chatbot` | [#10](https://github.com/afpogo/sst-chatbot/pull/10) | `714193a7c8c329fd0af352dffff93569d6e9d757` | `5b96bbb4c08731785f007ecaabd9e8c03bc88283` | repository check PASS, image PASS |

## Contratos Publicados

Auth agregó dos tuples exactas e independientes para `sst-chatbot` con
audience `sst-api`: `user-memory:recall` y `user-memory:propose`. El grant
histórico `agent-handoff:submit` no implica acceso a memoria.

Bend publicó rutas internas separadas para candidatos, audit de recall y
propuestas. `conversationRef + correlationId` sólo identifican el turno: Bend
reconstruye tenant, account, usuario y aplicación desde conversación, mensaje,
membership y account durables. El chatbot no puede elegir scope, producer,
evidencia ni lifecycle. Toda propuesta recibe `needs_user_review`.

Chatbot publicó el cliente M2M, el adapter de
`GovernedMemorySourcePort`, la comparación fail-closed del scope derivado, el
runtime compuesto y el contrato tipado de candidatos. El provider recibe sólo
chunks autorizados y acotados; no recibe `PrincipalContext`.

## Validación Ejecutada

### 4uentes-auth

- `npm run build`: PASS.
- test exacto de grants de memoria: PASS.
- `npm run check`: PASS.
- CI del PR: PASS.

### sst-bend

- `npm run build`: PASS.
- `npm run test:user-memory`: PASS.
- `npm run check`: PASS con `ARDS CHECK OK`; el arnés informó cobertura
  protegida parcial porque no se suministró `SMOKE_JWT`.
- YAML y `git diff --check`: PASS.
- CI del PR: tres checks PASS.

### sst-chatbot

- `scripts/check.py`: PASS.
- ARDS/SDD: PASS.
- `172` tests: PASS.
- Smokes deterministas de governed RAG, stakeholder RAG y protocolo provider:
  PASS.
- CI del PR: dos checks PASS.

## Límite Del Gate

Este readback no afirma el smoke integrado final. Todavía falta probar en una
misma corrida reproducible:

1. login y sesión reales;
2. conversación durable y token M2M firmado con scope exacto;
3. recall de un record previamente aceptado con citas auditadas;
4. candidato del desarrollo final persistido como `needs_user_review`;
5. rechazo/logout y aislamiento cross-session;
6. cancelación sin fuga de contenido ni creación de autoridad adicional.

La autorización vigente prohíbe deploy y mutación de feature flags. Por eso el
request permanece `running`; el próximo gate debe usar un entorno local/dev ya
publicado o recibir autorización separada para preparar ese entorno. Los tests
fake-backed demuestran composición y límites, pero no reemplazan el readback de
tokens firmados y servicios reales.
