# CR-SST-0225 — Integración durable Bend–Chatbot para artículos

## Objetivo

Conectar el agregado de procesamiento de artículos de `sst-bend` con el
pipeline de derivación de `sst-chatbot` para los modos `full_document` y
`sequential_paragraphs`, preservando autorización, idempotencia, checkpoints,
procedencia y recuperación tras reinicios.

## Responsabilidades

- `sst-bend` autoriza el artículo y conserva el lifecycle y la persistencia
  canónica.
- `sst-chatbot` ejecuta las derivaciones y devuelve candidatos tipados.
- `4uentes-auth` debe autorizar scopes M2M exclusivos si se aprueba ampliar el
  alcance owner del request.
- Completar un run no publica automáticamente un resumen ni adopta memoria.

## Criterios de aceptación

- El handoff usa contratos versionados y scopes M2M exactos.
- Reintentos y reinicios no duplican runs, párrafos, resultados, resúmenes ni
  propuestas.
- Cada checkpoint secuencial usa CAS y readback antes de avanzar.
- Bend vuelve a validar scope, lifecycle, versiones y hashes al aceptar una
  candidata final.
- Ambos repos funcionales actualizan ARDS/SDD owner, capabilities, mapas y
  pruebas; Auth hace lo propio si se incorpora al alcance.
- Logs y errores excluyen artículo, párrafos, prompts, respuesta del proveedor,
  tokens y credenciales.

## Límites

No incluye UX Fend, adopción automática de memoria, despliegue, ejecución de
migraciones compartidas ni QA E2E. La UX pertenece a CR-SST-0226 y el QA de
usuario a CR-SST-0227, exclusivamente con MCP Chrome DevTools y datos creados
desde la interfaz, sin scripts de base de datos ni seeders.

ARDS/SDD conserva la autoridad; Jira es solamente el espejo operativo.
