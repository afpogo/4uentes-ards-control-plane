# Preparación para promover la regla de cierre a policy

Fecha: 2026-08-23. Request: `CR-CP-0023`.

## Gate heredado del trial

`CR-CP-0022` completó sin excepción:

- plan, implementación y lifecycle terminal mergeados y releídos;
- validator enfocado y seis self-tests positivos/negativos;
- `npm run check` completo sin fallos;
- reconciliación exacta de Jira en `ARDS-19` y readback `Listo`;
- cleanup posterior al merge terminal `9cac22b7dda06043c5c4b5de4af1a0c206caf3d5`.

La evidencia fuente está en `evidence/requests/CR-CP-0022/` y el resultado
machine-readable en
`requests/done/CR-CP-0022-define-execution-publication-and-tracker-closure-rule.yaml`.

## Traducción a canon

El ID local experimental
`execution-publication-and-tracker-closure-rule` se propone como fuente de la
policy canónica `execution-publication-and-tracker-closure-policy`.

La promoción debe conservar:

- orden finito entre plan, implementación, tracker, cierre y cleanup;
- readback de las fuentes canónicas aplicables;
- lote externo exactamente autorizado o no-aplicabilidad explícita;
- Jira como mirror, nunca como autoridad;
- ausencia de commit recursivo para evidenciar el readback terminal.

Debe eliminar del canon:

- issue keys, request IDs e Initiative IDs de instancia;
- paths locales y nombres de branches;
- dependencia normativa de GitHub, Git o Jira;
- autorización implícita de rollout hacia repos hijos.

## Boundary y fuente validada

`4uentes-ards-core` es el owner canónico de policies compartidas. La decisión
explícita del owner y el trial observado permiten registrar una fuente
`decision` + `repo-observed` en `docs/reference-sources.md`.

Este lifecycle debe mergearse y releerse antes de crear el worktree de Core.
La adopción posterior del control plane y cualquier propagación a child repos
son unidades separadas y request-driven.
