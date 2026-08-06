$ErrorActionPreference = 'Stop'

$core = 'C:\Users\andre\Desktop\4uentes\apps\4uentes-core'
$policyDir = Join-Path $core 'docs\policies'
$templateDir = Join-Path $core 'templates\specs\integration'
$registryPath = Join-Path $core 'specs\integration\policies.yaml'
$readmePath = Join-Path $core 'docs\policies\README.md'
$sourcesPath = Join-Path $core 'docs\reference-sources.md'

if (-not (Test-Path $core)) {
  throw "Core repo not found: $core"
}

New-Item -ItemType Directory -Path $policyDir -Force | Out-Null
New-Item -ItemType Directory -Path $templateDir -Force | Out-Null

$policyDoc = @'
# Control Plane Link Policy

## Proposito

Definir la metadata minima que un repo hijo o repo consumidor debe dejar cuando
ejecuta, valida o descubre trabajo gobernado por un control-plane adoptante sin
haber nacido primero desde el request lifecycle de ese control-plane.

La policy evita que el control-plane sea el unico lugar donde se puede
reconstruir la relacion entre capability, state, request y evidence.

## Regla Canonica

El nombre canonico de la metadata comun es `control_plane_link`.

`control_plane_link` debe ser machine-readable y ubicarse cerca del artefacto
que representa el cambio: capability, state local, spec, evidence o decision
ARDS/SDD local.

Ejemplo minimo:

```yaml
control_plane_link:
  control_plane_repo: "TODO"
  state_kind: "feature_state"
  state_id: "TODO"
  capability_id: "TODO"
  work_origin: "child-repo"
  request_id: "TODO"
  evidence_ref: "TODO"
  status_hint: "implemented-local"
  correlation_id: "TODO"
```

## Campos

- `control_plane_repo`: repo del control-plane adoptante.
- `state_kind`: `feature_state` o `bugfix_state`.
- `state_id`: id estable del state vivo gobernado por el control-plane.
- `capability_id`: id estable de la capability que cambio, se valido o se
  descubrio.
- `work_origin`: origen del trabajo observado.
- `request_id`: request asociado; puede ser `TODO` cuando la reconciliacion se
  crea despues del inicio del trabajo.
- `evidence_ref`: path local o relativo a evidencia verificable.
- `status_hint`: estado sugerido por el repo que deja la metadata.
- `correlation_id`: id estable para unir capability, evidence y request.

## Valores Permitidos

`state_kind`:

- `feature_state`
- `bugfix_state`

`work_origin`:

- `control-plane-request`
- `child-repo`
- `imported-evidence`
- `manual-reconciliation`

## Reconciliacion

`status_hint` es advisory. El repo hijo o consumidor no decide el estado final
del control-plane.

El control-plane debe reconciliar el hint contra:

- request lifecycle;
- evidence disponible;
- state read-model;
- validation results;
- gaps y exceptions abiertos.

## Alias Locales

Un repo adoptante puede mantener aliases locales cuando ya existan artefactos
vivos. Por ejemplo, `4uentes-orchestor` usa `orchestrator_link` como alias local
de `control_plane_link`.

El alias solo es valido si la adopcion local documenta:

- alias local;
- campo canonico equivalente;
- periodo de convivencia o criterio de migracion;
- evidencia de que el alias no redefine el canon del core.

## Limites

- Esta policy no autoriza mutacion automatica de repos hijos.
- Esta policy no reemplaza capabilities outbound/inbound ni owner docs.
- Esta policy no convierte `status_hint` en source of truth.
- La adopcion en repos hijos sigue siendo request-driven.
'@

$template = @'
schema_version: "1.0"
kind: "control_plane_link"
status: "TODO: active | draft | deprecated"

control_plane_link:
  control_plane_repo: "TODO"
  state_kind: "TODO: feature_state | bugfix_state"
  state_id: "TODO"
  capability_id: "TODO"
  work_origin: "TODO: control-plane-request | child-repo | imported-evidence | manual-reconciliation"
  request_id: "TODO"
  evidence_ref: "TODO"
  status_hint: "TODO"
  correlation_id: "TODO"

alias:
  local_key: "TODO: optional, for example orchestrator_link"
  maps_to: "control_plane_link"
  adoption_ref: "TODO"

notes:
  - "status_hint is advisory; the adopting control-plane reconciles final state."
  - "Do not hard-code a specific control-plane repo in reusable templates."
'@

Set-Content -Path (Join-Path $policyDir 'control-plane-link-policy.md') -Value $policyDoc -Encoding UTF8
Set-Content -Path (Join-Path $templateDir 'control-plane-link.template.yaml') -Value $template -Encoding UTF8

$readme = Get-Content $readmePath -Raw
if ($readme -notmatch 'control-plane-link-policy\.md') {
  $readme = $readme -replace '- \[owner-documentation-authority-policy\.md\]\(owner-documentation-authority-policy\.md\)', "- [owner-documentation-authority-policy.md](owner-documentation-authority-policy.md)`r`n- [control-plane-link-policy.md](control-plane-link-policy.md)"
}
Set-Content -Path $readmePath -Value $readme -Encoding UTF8

$registry = Get-Content $registryPath -Raw
$registry = $registry -replace 'updated_at: "2026-07-07"', 'updated_at: "2026-07-07"'
$registry = $registry -replace 'documentation language, and owner documentation authority without replacing functional', 'documentation language, owner documentation authority, and control-plane reconciliation links without replacing functional'

if ($registry -notmatch 'id: "control-plane-link-policy"') {
  $entry = @'

  - id: "control-plane-link-policy"
    name: "Control Plane Link Policy"
    type: "ards-sdd-governance-policy"
    status: "active"
    scope:
      - "child-repo-reconciliation"
      - "control-plane-adoption"
      - "capability-state-linkage"
      - "request-evidence-correlation"
    owner: "4uentes-ards-core"
    human_doc: "docs/policies/control-plane-link-policy.md"
    template: "templates/specs/integration/control-plane-link.template.yaml"
    enforcement:
      expected: "Repos that execute, validate, or discover governed work outside the adopting control-plane leave control_plane_link metadata near the relevant capability, state, spec, evidence, or ARDS/SDD decision."
      mode: "operational-review"
      failure_behavior: "record-gap-or-reconciliation-request"
    evidence:
      - "docs/policies/control-plane-link-policy.md"
      - "templates/specs/integration/control-plane-link.template.yaml"
      - "specs/integration/policies.yaml"
      - "docs/reference-sources.md"
    relates_to:
      - "owner-documentation-authority-policy"
      - "agent-architecture-boundary-policy"
'@
  $registry = $registry -replace "`r?`ngaps:", "$entry`r`n`r`ngaps:"
}

Set-Content -Path $registryPath -Value $registry -Encoding UTF8

$sources = Get-Content $sourcesPath -Raw
$sources = [regex]::Replace($sources, '(\r?\n)``yaml(\r?\nschema_version:)', {
  param($match)
  $match.Groups[1].Value + '```yaml' + $match.Groups[2].Value
})
$sources = [regex]::Replace($sources, '(\r?\n)`yaml(\r?\nschema_version:)', {
  param($match)
  $match.Groups[1].Value + '```yaml' + $match.Groups[2].Value
})
$badFence = [regex]::Escape(([string][char]96) + 'yaml')
$sources = [regex]::Replace($sources, "(?m)^$badFence$", '```yaml')

if ($sources -notmatch 'source\.decision\.control-plane-link-policy') {
  $sourceBlock = @'
```yaml
schema_version: "1.0"
kind: "source_map"
source_id: "source.decision.control-plane-link-policy"
source_type: "decision"
title: "Decision interna: control_plane_link como metadata comun de reconciliacion"
location: "CR-CP-0002 / ARDS-3"
validated_on: "2026-07-07"
status: "validated"
applies_to:
  - "docs/policies/control-plane-link-policy.md"
  - "templates/specs/integration/control-plane-link.template.yaml"
  - "specs/integration/policies.yaml"
extracted_rules:
  - "El nombre canonico comun para metadata de reconciliacion child-repo -> control-plane es control_plane_link."
  - "orchestrator_link puede mantenerse como alias local documentado por un repo adoptante."
  - "status_hint es advisory y debe reconciliarse contra request lifecycle, evidence, state read-model, validation results, gaps y exceptions."
  - "El template reusable no debe hard-codear 4uentes-orchestor ni ningun control-plane especifico."
validation_notes: "Decision interna promovida por CR-CP-0002 como canon comun del core."
owner: "4uentes"
open_questions:
  - "Definir rollout separado para aliases locales existentes en repos hijos."
```

'@
  $sources = $sources -replace '```yaml\r?\nschema_version: "1\.0"\r?\nkind: "source_map"\r?\nsource_id: "source\.control-plane\.observed\.4uentes-orchestor"', "$sourceBlock```yaml`r`nschema_version: `"1.0`"`r`nkind: `"source_map`"`r`nsource_id: `"source.control-plane.observed.4uentes-orchestor`""
}

Set-Content -Path $sourcesPath -Value $sources -Encoding UTF8

Write-Host "CR-CP-0002 control_plane_link canon applied to $core"
