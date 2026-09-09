# Autorización de ejecución owner

## Decisión humana

El 2026-09-05, 4uentes indicó exactamente:

> ok avancemos al proximo gate, no olvidemos actualizar jira si es necesario para dar seguimiento y apeguemos a las politicas vivas

Esta decisión autoriza el gate owner de `CR-SST-0234` después del merge y
readback del lifecycle `running` mediante el PR `#256`.

## Lote owner autorizado

- refrescar `sst-bend/origin/develop` y crear un único worktree limpio para
  `CR-SST-0234`;
- actualizar primero las specs, documentación humana, capability outbound,
  playbook, runbook y mapas owner aplicables;
- implementar en `sst-bend` el resolver de fuentes gobernadas y snapshots
  inmutables definidos por el contrato `sst-learning-workspace-source-v1`;
- crear migraciones reversibles, modelos, repositorios, casos de uso,
  adaptadores HTTP y pruebas acotadas que requiera esa implementación;
- ejecutar checks owner y del control plane;
- publicar un PR owner y efectuar readback si todos los gates pasan.

## Límites

No se autoriza ejecutar migraciones, modificar datos compartidos o
productivos, acceder a secretos, levantar o desplegar runtime, cambiar
infraestructura, mutar `sst-fend`, BFF, chatbot u otros owners, ni aceptar
memoria automáticamente.

Jira puede evaluarse como mirror. La frase humana no enumera un lote con
issue, parent, tipo, operaciones y transición; por lo tanto sólo autoriza el
preflight read-only. Cualquier escritura Jira requiere un batch exacto
posterior.

## Policies aplicadas

- `agent-model-selection-policy`;
- `agent-task-atomization-policy`;
- `agent-context-management-policy`;
- `agent-architecture-boundary-policy`;
- `owner-documentation-authority-policy`;
- `visual-documentation-as-code-policy`;
- `knowledge-to-execution-documentation-policy`;
- `worktree-request-lifecycle-policy`;
- `execution-publication-and-tracker-closure-policy`;
- `work-tracker-control-plane-authority-policy`;
- `jira-cr-mirror-hierarchy-policy`.
