# Revision De Registry Y State Link

## Consistencia

El documento humano, registry e indice usan el mismo policy ID:
`work-tracker-control-plane-authority-policy`.

Registry y state link coinciden en:

- policy class: `origin-repo-policy`;
- owner/canonical owner: `4uentes-ards-control-plane`;
- applicability: control planes que integran un work tracker externo;
- adoption mode: `local-conditional`;
- origin/source repo: `4uentes-orchestor`.

El link local se relaciona con `ards-sdd-policy-unification` y declara
`pending-separate-core-promotion-request`, sin mutacion de core.

El registry y el state link requieren
`jira-cr-mirror-hierarchy-policy` para el perfil Jira. La dependencia establece
una Epic primaria por iniciativa activa con Jira y un Task o Subtask primario
por CR seleccionado; una inconsistencia bloquea escritura y exige
reconciliacion.
