# CR-SST-0224 — Unidad 1: contratos y documentación owner

Rol: evidencia de implementación local. Owner de evidencia: control-plane.
Estado: primera unidad validada; CR completo permanece running.

## Autorización y aislamiento

El usuario aprobó iniciar el plan: «ok avancemos con el siguiente paso, el plan
esta perfecto para iniciar.» Se registró la autorización en el running antes
de modificar el owner. No amplía publicación Git, Jira ni deployment.

Se refrescó origin/develop de sst-chatbot y se abrió un único worktree nuevo
para este CR y owner: `worktrees/CR-SST-0224-chatbot-owner`, rama
`agent/cr-sst-0224-article-pipeline`, base
`5b96bbb4c08731785f007ecaabd9e8c03bc88283`. El checkout original quedó intacto.
El control-plane conserva su worktree de preparación y cambios locales previos;
su ref observada está cuatro commits detrás de origin/main por trabajo
independiente de CR-SST-0233. No se declara sincronizado ni publicado este lote.

Ejecución secuencial por el agente principal, sin delegación. Primera unidad
acotada a contratos y documentación; seguridad y autoridad revisadas localmente.

## Superficies del owner

- `src/app/article_processing/__init__.py`
- `src/app/article_processing/contracts.py`
- `tests/test_article_processing_contracts.py`
- `specs/architecture/article-processing-pipeline.yaml`
- `docs/architecture/article-processing-pipeline.md`
- `specs/00-index.yaml`
- `docs/00-overview.md`

Contratos de valores inmutables y estrictos: scope, source, prompt, secuencia,
solicitud y contenido de análisis. Verifican hashes UTF-8 exactos, correspondencia
de source, modo, orden único ascendente y rechazo de campos de autoridad.
No son DTOs definitivos de Bend ni prueban autorización del artículo.

## Validación y QA de última revisión

- Tests nuevos: 15 PASS.
- `scripts/check.py` owner: PASS; ARDS/SDD, 187 tests y tres smokes deterministas.
  Se utilizó el Python del virtualenv existente del owner sin instalar paquetes
  ni cargar credenciales nuevas. Los smokes ejecutan proveedores simulados.
- Tres mapas owner renderizados con Mermaid 11.12.0 y jsdom 26.1.0, reutilizando
  la función de render y las versiones fijadas del control-plane.
- `git diff --check` owner: PASS.
- `npm.cmd run check` control-plane: PASS también después de registrar esta evidencia,
  con 794 lifecycles y 65 mapas; advertencias históricas y bindings opcionales ausentes.

Revisión documental contra V1: ambos modos preservados, contexto full_document
versión 0 documentado, avance posterior a confirmación, instrucciones separadas
de autoridad y ninguna adopción automática de memoria. El esquema de contenido
local es draft y debe integrarse con el envelope de procedencia en una unidad
posterior. Errores estructurados y serialización pueden contener datos privados:
la documentación prohíbe enviarlos a logs aunque repr o str oculten inputs.

## Pendientes dentro de la aprobación local vigente

Prompt privado, composición, adaptador, ejecución, límites, checkpoint, retry y
procedencia final. No hay endpoint ni pipeline conectado todavía. No se declara
recuperación durable entre procesos, QA de usuario ni implementación terminada.
QA extremo a extremo sigue reservado a Chrome DevTools bajo CR-SST-0227.

SST-126 permanece con el último readback Tareas por hacer. El lote de creación
ya está consumido y no autoriza una transición o comentario adicional.
