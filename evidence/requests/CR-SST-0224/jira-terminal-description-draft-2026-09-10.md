# CR-SST-0224 — Pipeline gobernado de procesamiento de artículos

## Objetivo

Implementar en `sst-chatbot` el pipeline gobernado que procesa un artículo
completo o secuencialmente por párrafos, con prompts versionados, contexto
confirmado y una síntesis candidata sin asumir autoridad de persistencia.

## Resultado owner

- Implementados `full_document` y `sequential_paragraphs` con contratos
  estrictos y procedencia inmutable.
- El modo secuencial confirma cada derivación mediante checkpoint CAS y
  readback antes de avanzar; los reintentos retoman el último prefijo válido.
- El prompt default `open-general-analysis` admite instrucciones del usuario
  como datos no privilegiados, sin convertirlas en identidad persistente del
  chat ni permitir que reemplacen guardrails o esquema.
- La salida del proveedor exige JSON exacto y no puede declarar estado,
  permisos, adopción de memoria o comandos de persistencia.
- La candidata final conserva run, fuente, prompt, modo, cadena, versión y
  derivaciones; no es un resultado canónico ni memoria adoptada.
- Cada llamada verifica lifecycle `running` antes y después y aplica límites
  versionados de entrada y ventana de tokens mediante puertos reemplazables.

## Publicación y validación

- Owner PR: `sst-chatbot#12`.
- Commit owner: `3114cbc42e0660d0bac8129779d7f18ee8f535a1`.
- Merge en `develop`: `a0ce974b9b02be55d11609ae757fbcee569dcfa8`.
- CI canónico, 272 tests, tres smokes deterministas y mapas Mermaid: PASS.
- Revisión contractual manual y `npm run check` del control plane: PASS.
- Evidencia del control plane publicada por PR #302 y merge
  `38b07a9d15b04c4cbeca3fd7fdd7606f287773f7`.

El merge owner publicó automáticamente la imagen
`develop-a0ce974b9b02` y actualizó el desired state GitOps en
`sst-4uentes-infra@5fc609f064032f553b4a33933bc75ac48a3b77b6`.
No se verificó rollout ni QA en el clúster.

## Límites y continuidad

No se integró un proveedor real ni un store durable en este CR. Bend conserva
autorización, aceptación canónica, idempotencia y adopción de memoria.
La integración Bend–chatbot pertenece a CR-SST-0225, la UX a CR-SST-0226 y el
QA E2E a CR-SST-0227. Ese QA será exclusivamente mediante MCP Chrome DevTools
y datos creados por interfaz, sin seeders ni scripts de base de datos.

ARDS/SDD es la fuente de verdad; Jira conserva el espejo operativo.
