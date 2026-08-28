# Preview del próximo gate de CR-SST-0223

## Gate A — running y owner Bend

Una autorización explícita permitiría:

1. publicar `requests/running/CR-SST-0223-persist-article-processing-runs-and-summaries.yaml` en el control plane;
2. crear un worktree owner limpio desde `sst-bend/origin/develop` refrescado y una branch exclusiva de `CR-SST-0223`;
3. modificar únicamente `sst-bend` para specs/docs/mapas, migraciones reversibles, modelos, repositorios, casos de uso, adaptación de rutas y pruebas descritos en `implementation-plan.md`;
4. publicar PRs owner atomizados, ejecutar `npm run check` del owner y el check completo del control plane, y registrar readbacks;
5. realizar QA manual de contrato owner sin scripts DB, seeders, despliegue ni datos productivos.

No autoriza `sst-chatbot`, `sst-fend`, otros repos, ejecución real de modelos, infraestructura, deployment, migraciones sobre entornos compartidos, datos productivos ni aceptación automática de memoria.

## Gate B — Jira create and start

Un batch independiente y de un solo uso permitiría:

1. repetir duplicados por `CR-SST-0223` y abortar ante cualquier match;
2. crear exactamente una `Subtask` (`10006`) en `SST`, parent `SST-122`, resumen `[SST][CR-SST-0223] Persist governed article processing runs and summaries`, usando `jira-description-draft.md`;
3. validar key, summary, description, type, parent, estado inicial y resolución;
4. aplicar exclusivamente transición `21` si el estado inicial es `Tareas por hacer` y el readback coincide;
5. confirmar estado final `En curso` y resolución vacía.

No autoriza comentarios, links, labels, assignee, adjuntos, worklogs, otros issues, una segunda transición ni tickets Jira para `CR-SST-0224` a `CR-SST-0227`.

## Estado

Este documento no concede autoridad. Ambos gates están pendientes de aprobación explícita y sus escrituras deben cerrarse con evidencia sanitizada.
