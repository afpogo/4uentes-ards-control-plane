# Preflight read-only del owner para CR-SST-0224

## Resultado

El preflight de `sst-chatbot` pasa para preparar el gate de ejecución, pero no
autoriza todavía a crear un worktree owner ni modificar el repositorio hijo.

## Fuente observada

| Control | Observación |
| --- | --- |
| Repo owner | `afpogo/sst-chatbot` |
| Rama canónica | `develop` |
| Head canónico | `5b96bbb4c08731785f007ecaabd9e8c03bc88283` |
| Último merge | PR `#10`, memoria gobernada y recall |
| Check canónico | `Repository check`: PASS |
| Build canónico | `Build and Publish Development Image`: PASS |
| Rama remota CR-SST-0224 | No existe |
| Checkout principal local | Limpio, pero dieciocho commits detrás; no debe usarse para implementar |

La ejecución futura debe partir de un worktree nuevo creado exactamente desde
`origin/develop@5b96bbb4c08731785f007ecaabd9e8c03bc88283`.

## Base reutilizable encontrada

El repo ya contiene:

- motor privado de prompts YAML con allowlist explícita, versionado, variables
  tipadas, hash y trazas sólo de metadata;
- adapters de proveedor detrás de contratos internos;
- Pydantic para validar entradas y salidas estructuradas;
- patrones de puertos inyectables y providers falsos;
- tests sin cuota paga ni llamadas reales obligatorias;
- policy visual adoptada y `scripts/check.py` como gate owner.

No existe un módulo de procesamiento de artículos ni una implementación
secuencial por párrafos en `src/app/`. Los documentos Plaud históricos hablan
de derivaciones, pero no implementan `sst-article-agent-processing-v1` y no
deben reutilizarse como si fueran el nuevo contrato.

## Diseño owner propuesto

La implementación se mantiene como una librería pura bajo
`src/app/article_processing/`:

- contratos Pydantic para request, snapshot, modo, derivaciones, contexto,
  resultado y fallos;
- un runtime determinista para `full_document` y
  `sequential_paragraphs`;
- un puerto de proveedor inyectable y un fake de pruebas;
- límites explícitos de fuente, párrafos, instrucciones, contexto y salida;
- composición que mantiene guardrails, mirada elegida, contexto previo y
  contenido no confiable en secciones diferenciadas;
- validación estricta de cada salida antes de confirmar un checkpoint;
- hash y procedencia de prompt, fuente, párrafo y contexto sin persistir texto
  privado en metadata.

El prompt default será `open-general-analysis`. Una mirada custom se tratará
como instrucción de usuario acotada: puede orientar el análisis, pero no puede
alterar guardrails, autorización, modo ni schema de salida.

## Boundaries

`CR-SST-0224` no debe:

- crear transporte real con Bend ni endpoints nuevos;
- autorizar usuarios o reconstruir scope;
- persistir runs, resultados, resúmenes o memoria;
- usar estado de conversación del proveedor como contexto canónico;
- desplegar, publicar imágenes o usar credenciales reales;
- truncar silenciosamente un documento que exceda límites.

El transporte durable Bend-chatbot pertenece a `CR-SST-0225`.

## Superficie ARDS/SDD owner esperada

- `specs/capabilities/article-processing-agent-pipeline.yaml`;
- `docs/architecture/article-processing-agent-pipeline.md`;
- `docs/tasks/2026-08-29-cr-sst-0224-article-processing-agent-pipeline.md`;
- actualización de `specs/00-index.yaml`, `docs/00-overview.md` y
  `docs/tasks/README.md`;
- mapas de composición, secuencia y trust boundary con fallback textual;
- tests owner y `scripts/check.py` en PASS.

## Siguiente gate

Publicar un lifecycle `running` y una autorización explícita limitada a
`sst-chatbot`. Sólo después puede crearse el worktree owner limpio.
