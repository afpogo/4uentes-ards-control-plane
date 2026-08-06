# CR-CP-0002 Remediacion De Idioma En Documentacion Humana

## Contexto

Durante ARDS-3 se detecto que parte de la evidencia humana creada para
`CR-CP-0001` y `CR-CP-0002` estaba escrita en ingles.

Eso no respeta `human-doc-language`, que exige documentacion humana del
control-plane en espanol, preservando identificadores tecnicos, comandos, paths,
YAML keys y nombres canonicos en idioma original.

## Cambios Aplicados

Se normalizo prosa humana a espanol en:

- `evidence/requests/CR-CP-0001/core-policy-diff-summary.md`
- `evidence/requests/CR-CP-0001/final-closure-summary.md`
- `evidence/requests/CR-CP-0001/jira-close-transition-summary.md`
- `evidence/requests/CR-CP-0001/validation-results.md`
- `evidence/requests/CR-CP-0002/jira-start-summary.md`
- `templates/child-orchestrator-link-rule.md`

## Contenido Preservado En Idioma Original

Se mantuvieron sin traducir:

- IDs y nombres canonicos como `CR-CP-0001`, `ARDS-3`, `control_plane_link`,
  `orchestrator_link`, `status_hint` y `source_ref`;
- paths y comandos;
- YAML keys;
- nombres de estados Jira;
- fragmentos machine-readable.

## Decision

La remediacion queda asociada a `CR-CP-0002` porque fue detectada al aplicar
las policies antes de avanzar con ARDS-3.
