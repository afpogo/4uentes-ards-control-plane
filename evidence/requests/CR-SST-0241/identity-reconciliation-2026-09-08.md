# Reconciliación de identidad de Compose y precondiciones del onboarding

Owner: `4uentes-orchestor`. Rol: evidencia de recuperación y decisión.
Fecha: 2026-09-08. Alcance: sólo control plane; no ejecución funcional.

La base refrescada es `origin/main@75cab7844fc5bb0518b8f384d596efeaeb9b55c1`.
El PR abierto [#282](https://github.com/afpogo/4uentes-ards-control-plane/pull/282)
contiene `CR-SST-0239` para QA de retención por edge reservado. El plan Compose
con ese ID sólo existía sin commit en el worktree
`worktrees/CR-SST-0238-onboarding-console-gates`, sobre `d84d1f6`.

Aplicando `docs/policies/worktree-request-lifecycle-policy.md`, se conserva la
identidad commiteada de retención y se porta Compose como `CR-SST-0241`.
No se modifica el worktree de origen, la branch de retención ni su PR.
La renumeración no cambia el alcance funcional de Compose.

Preflight: búsqueda en main, refs, requests e iniciativas de worktrees activos,
historia de archivos y PRs sin coincidencias para el candidato `CR-SST-0241`.
Las búsquedas JQL `project = SST AND text ~ "<ID>"` devolvieron `issues: []`
y `isLast: true` para `INIT-SST-0011`, `CR-SST-0240`, `CR-SST-0238`,
`CR-SST-0239` y `CR-SST-0241`. No hubo escrituras Jira.

Se portan selectivamente inbox, planned y evidencia de navegación y Compose,
la recomendación y las referencias correspondientes de `INIT-SST-0009`.
Las observaciones owner del 2026-09-07 conservan su fecha: no se presentan
como una nueva prueba runtime. Las referencias Compose antes rotuladas
`CR-SST-0239` se actualizan a `CR-SST-0241` en la copia recuperada.

El usuario autorizó publicar estas precondiciones mediante PR y readback.
Los límites históricos de publicación de los planes describen su lote original;
este lote permite exclusivamente publicar los artefactos del control plane.
No autoriza fixes owner, contenedores ni escrituras Jira para estas CRs.

Clasificación: `complex-high-risk-task`; proveedor Codex, recursos
`normal/default`, perfil de policy `gpt-5.6-sol/max`, fallback `gpt-5.5/high`.
La integración se mantiene en el agente principal impuesto por el runtime;
no se declara un cambio de modelo no verificable. Sin subagentes.

Unidades: reconciliación de IDs, port selectivo, validación completa y
publicación/readback. Cada unidad queda acotada a las rutas anteriores.
La validación de baseline `npm.cmd run check` pasó con exit 0; sólo los avisos
históricos de CR-SST-0016 y bindings locales ausentes. El port también pasó el check completo (48 documentos, 62 mapas, 0 FAIL).
TODO: verificar su merge antes de crear el coordinador.
