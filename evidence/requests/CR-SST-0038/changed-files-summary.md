# Resumen De Archivos Cambiados

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0038
- Alcance: control-plane only
- Repos funcionales modificados: no
- Escritura Jira ejecutada: no

## Archivos Modificados

- `scripts/jira-mcp/doctor.js`
- `scripts/jira-mcp/create-issues.js`

## Archivos Agregados

- `requests/inbox/CR-SST-0038-resolve-sst-tag-prefix-engine-jira-ambiguity.yaml`
- `requests/planned/CR-SST-0038-resolve-sst-tag-prefix-engine-jira-ambiguity.yaml`
- `evidence/requests/CR-SST-0038/ambiguity-resolution.md`
- `evidence/requests/CR-SST-0038/doctor-summary.md`
- `evidence/requests/CR-SST-0038/machine-run-state.yaml`
- `evidence/requests/CR-SST-0038/correction-plan-preview.md`
- `evidence/requests/CR-SST-0038/correction-plan-preview.json`
- `evidence/requests/CR-SST-0038/jira-policy-check-summary.md`
- `evidence/requests/CR-SST-0038/subagent-deployment-evidence.md`
- `evidence/requests/CR-SST-0038/changed-files-summary.md`
- `evidence/requests/CR-SST-0038/validation-results.md`

## Decision Implementada

El doctor ahora distingue entre:

- `propose-description-update`: issue existente con match exacto;
- `propose-issue-create`: no hay issue con summary exacto, pero puede haber
  issues relacionados por texto;
- `blocked-ambiguous-exact-summary`: existe mas de un candidato exacto.

Para `sst-tag-prefix-engine`, el resultado es `propose-issue-create`.
