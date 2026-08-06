# Definicion Y Adopcion Local

## Resultado

- Policy ID: `work-tracker-control-plane-authority-policy`
- Clase: `origin-repo-policy`
- Owner: `4uentes-ards-control-plane`
- Origin repo: `4uentes-orchestor`
- Applicability: control planes que integran un work tracker externo
- Adoption mode: `local-conditional`
- Enforcement inicial: `operational-review`

La policy define un contrato generico de autoridad para work trackers y agrega
Jira como primer perfil. No obliga a repos funcionales, child repos ni perfiles
sin tracker.

## Artefactos

- `docs/policies/work-tracker-control-plane-authority-policy.md`
- `specs/integration/policies.yaml`
- `docs/policies/README.md`
- `state/policy-links.yaml`

El state link apunta a `ards-sdd-policy-unification` con adopcion local y
handoff a core pendiente de un request separado.

## Correccion De Integracion Jira

El perfil Jira requiere `jira-cr-mirror-hierarchy-policy` como contrato
complementario. Cada iniciativa activa que use Jira conserva una Epic primaria
y cada CR seleccionado conserva un issue primario Task o Subtask. Una Subtask
solo es valida bajo una Task perteneciente a la Epic de la misma iniciativa.
