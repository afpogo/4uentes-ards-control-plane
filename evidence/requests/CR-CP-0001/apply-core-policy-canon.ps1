$ErrorActionPreference = 'Stop'

$core = 'C:\Users\andre\Desktop\4uentes\apps\4uentes-core'
$policyDir = Join-Path $core 'docs\policies'
$registryPath = Join-Path $core 'specs\integration\policies.yaml'
$readmePath = Join-Path $core 'docs\policies\README.md'
$sourcesPath = Join-Path $core 'docs\reference-sources.md'

if (-not (Test-Path $core)) {
  throw "Core repo not found: $core"
}

New-Item -ItemType Directory -Path $policyDir -Force | Out-Null

$humanDoc = @'
# Human Doc Language Policy

## Proposito

Esta policy fija el idioma operativo para documentacion humana, documentacion
agent-facing, specs normativos, YAML e identificadores tecnicos estables en
repos que adopten ARDS/SDD.

La policy esta registrada en `specs/integration/policies.yaml` con el id
`human-doc-language`.

## Regla Base

- Markdown humano: idioma operativo del repo, producto o instancia.
- Markdown agent-facing: ingles tecnico o mixto tecnico controlado cuando el
  valor dependa de wording estable para agentes o tooling.
- Specs normativos y YAML: ingles tecnico estable.
- Identificadores tecnicos estables: no se traducen.

## Alcance

Markdown humano:

- `README.md`
- `docs/`, salvo la capa AI o agent-facing
- `inventory/*.md`
- `evidence/**/*.md`
- `knowledge/**/*.md`

Markdown agent-facing:

- `AGENTS.md`
- `docs/ai/`
- instrucciones operativas cuyo valor dependa de wording estable para agentes,
  skills, MCP, validators o tooling

Specs y YAML normativos:

- `specs/*.yaml`
- `requests/*.yaml`
- `catalog/*.yaml`
- `solutions/*.yaml`
- manifests de adoption o exception

Identificadores tecnicos estables que no se traducen:

- filenames y paths
- claves YAML
- `service_id`, `capability_id`, `policy_id`, `request_id`, `state_id` y otros
  IDs ARDS/SDD
- comandos CLI
- endpoints, headers, environment variables y payload keys
- nombres de servicios, features y productos tecnicos
- estados de lifecycle como `inbox`, `planned`, `queued`, `running`, `done` y
  `rejected`

## Enforcement

- Antes de crear o migrar documentacion humana, verificar el idioma operativo
  esperado para esa superficie.
- No traducir comandos, payloads, nombres de endpoints, IDs ni referencias
  estables usadas por tooling.
- Si un documento humano debe usar otro idioma por una razon operativa,
  registrar la excepcion en el request, adoption manifest o evidence
  correspondiente.

## Adoption

Los repos adoptantes pueden especializar el idioma humano por contexto local,
pero no deben cambiar la regla de estabilidad para specs, YAML, identifiers,
commands, endpoints o agent-facing instructions.
'@

$ownerDoc = @'
# Owner Documentation Authority Policy

## Proposito

Definir quien es autoridad documental cuando ARDS/SDD orquesta cambios en repos,
contratos tecnicos, capabilities cross-repo, evidence central y trackers.

Esta policy evita que una implementacion quede documentada solo en una capa de
orquestacion cuando el comportamiento real pertenece a otro repo owner.

## Principio

La documentacion principal vive donde vive la responsabilidad tecnica.

Un control-plane registra decision, plan, evidence, scope, tracker mirror y
orquestacion. No reemplaza el ARDS/SDD owner del repo que implementa, consume o
expone el contrato.

## Autoridades

### Repo owner

El repo owner es autoridad para:

- comportamiento runtime que implementa;
- modelos, migraciones, endpoints, workers, UI, extension code o infra propios;
- specs tecnicas del repo;
- docs tecnicas del repo;
- pruebas y validacion local;
- capabilities que produce hacia otros repos.

Cuando una CR modifica un repo, ese repo debe recibir la actualizacion ARDS/SDD
owner correspondiente dentro del mismo lifecycle, salvo excepcion explicita.

### Productor de capability

El repo que produce una capability es autoridad para:

- contrato outbound;
- versionado del contrato;
- compatibilidad y breaking changes;
- evidencia de validacion del productor.

### Consumidor de capability

El repo que consume una capability es autoridad para:

- contrato inbound o adopcion local;
- supuestos de integracion;
- degradacion y fallback local;
- evidencia de validacion del consumidor.

### Control-plane

Un control-plane es autoridad para:

- request lifecycle;
- iniciativas y backlog gobernado;
- evidence de ejecucion y decision;
- ownership cross-repo observado;
- catalogo logico de servicios y soluciones;
- planes de orquestacion;
- trackers como mirror, no source of truth documental.

La evidencia central puede probar que un cambio ocurrio, pero no sustituye las
specs, docs o contracts del repo owner.

### Core canonico

`4uentes-ards-core` es autoridad para estandares ARDS/SDD compartidos, kinds,
profiles, templates, schemas, policies canonicas y handoff rules.

Los repos consumidores pueden registrar adopcion local, pero no redefinir el
canon del core.

## Reglas Obligatorias

- Si una CR modifica runtime, contratos, capabilities o integration behavior de
  un repo, debe actualizar la documentacion ARDS/SDD owner del repo afectado o
  registrar excepcion aprobada.
- La evidencia central debe listar las rutas owner actualizadas o la excepcion.
- Una CR no debe cerrarse como completa solo con evidencia central si el repo
  owner quedo desactualizado.
- Las capabilities cross-repo deben identificar productor, consumidor y rol del
  control-plane cuando aplique.
- Jira u otro tracker no es autoridad documental; solo refleja estado o plan
  cuando se use como mirror.
- No se debe usar una capa central para esconder deuda tecnica documental de un
  repo owner.

## Mapa De Ownership

| Cambio | Autoridad primaria | Evidencia esperada |
| --- | --- | --- |
| Endpoint, modelo, migracion o service runtime | Repo implementador | Specs/docs/tests del repo y evidencia central |
| UI o extension behavior | Repo frontend/extension | Specs/docs/tests del repo y evidencia central |
| Capability outbound | Repo productor | `specs/capabilities/outbound/` o superficie equivalente |
| Capability inbound | Repo consumidor | `specs/capabilities/inbound/` o superficie equivalente |
| Decision cross-repo, scope, plan o tracker mirror | Control-plane | Request, initiative, evidence |
| Canon ARDS/SDD compartido | `4uentes-ards-core` | Core specs/templates/policies |

## Excepciones

Una excepcion solo es valida si incluye:

- repo afectado;
- owner responsable;
- razon por la que no se actualizo documentacion owner;
- riesgo;
- follow-up CR o TODO verificable;
- evidencia de que el control-plane o tracker no esta sustituyendo la autoridad
  owner.

## Definition of Done

- La autoridad documental queda identificada antes de mutar repos.
- El repo owner conserva specs/docs/capabilities actualizados.
- La capa de orquestacion conserva evidencia de decision, scope y rutas owner.
- Las excepciones quedan explicitas y trazables.
'@

Set-Content -Path (Join-Path $policyDir 'human-doc-language-policy.md') -Value $humanDoc -Encoding UTF8
Set-Content -Path (Join-Path $policyDir 'owner-documentation-authority-policy.md') -Value $ownerDoc -Encoding UTF8

$readme = Get-Content $readmePath -Raw
if ($readme -notmatch 'human-doc-language-policy\.md') {
  $readme = $readme -replace '- \[http-qa-harness-policy\.md\]\(http-qa-harness-policy\.md\)', "- [http-qa-harness-policy.md](http-qa-harness-policy.md)`r`n- [human-doc-language-policy.md](human-doc-language-policy.md)`r`n- [owner-documentation-authority-policy.md](owner-documentation-authority-policy.md)"
}
Set-Content -Path $readmePath -Value $readme -Encoding UTF8

$registry = Get-Content $registryPath -Raw
$registry = $registry -replace 'updated_at: "2026-06-20"', 'updated_at: "2026-07-07"'
$registry = $registry -replace 'task atomization, and architecture boundaries without replacing functional', 'task atomization, architecture boundaries, documentation language, and owner documentation authority without replacing functional'

if ($registry -notmatch 'id: "human-doc-language"') {
  $entries = @'

  - id: "human-doc-language"
    name: "Human Doc Language Policy"
    type: "documentation-governance-policy"
    status: "active"
    scope:
      - "human-documentation"
      - "agent-facing-documentation"
      - "spec-language"
      - "stable-identifiers"
    owner: "4uentes-ards-core"
    human_doc: "docs/policies/human-doc-language-policy.md"
    enforcement:
      expected: "Human docs use the repo operational language, while specs, YAML, stable identifiers, commands, endpoints, headers, payload keys, and agent-facing instructions preserve stable technical wording."
      mode: "operational-review"
      failure_behavior: "record-gap-or-exception"
    evidence:
      - "docs/policies/human-doc-language-policy.md"
      - "specs/integration/policies.yaml"
      - "docs/reference-sources.md"
    relates_to:
      - "agent-context-management-policy"
      - "owner-documentation-authority-policy"

  - id: "owner-documentation-authority-policy"
    name: "Owner Documentation Authority Policy"
    type: "ards-sdd-governance-policy"
    status: "active"
    scope:
      - "repo-ownership"
      - "cross-repo-governance"
      - "capability-documentation"
      - "control-plane-boundary"
      - "tracker-mirror-boundary"
    owner: "4uentes-ards-core"
    human_doc: "docs/policies/owner-documentation-authority-policy.md"
    enforcement:
      expected: "Documentation authority stays with the technical owner of the behavior, contract, or capability; central evidence and trackers do not replace repo-owner specs, docs, or contracts."
      mode: "mandatory-operational-boundary"
      failure_behavior: "block-closure-or-create-approved-follow-up"
    evidence:
      - "docs/policies/owner-documentation-authority-policy.md"
      - "specs/integration/policies.yaml"
      - "docs/reference-sources.md"
    relates_to:
      - "agent-architecture-boundary-policy"
      - "human-doc-language"
'@
  $registry = $registry -replace "`r?`ngaps:", "$entries`r`n`r`ngaps:"
}

Set-Content -Path $registryPath -Value $registry -Encoding UTF8

$sources = Get-Content $sourcesPath -Raw
if ($sources -notmatch 'source\.decision\.common-doc-governance-policies') {
  $sourceBlock = @'
```yaml
schema_version: "1.0"
kind: "source_map"
source_id: "source.decision.common-doc-governance-policies"
source_type: "decision"
title: "Decision interna: common documentation governance policies"
location: "CR-CP-0001 / ARDS-2"
validated_on: "2026-07-07"
status: "validated"
applies_to:
  - "docs/policies/human-doc-language-policy.md"
  - "docs/policies/owner-documentation-authority-policy.md"
  - "specs/integration/policies.yaml"
extracted_rules:
  - "La documentacion humana usa el idioma operativo del repo, producto o instancia."
  - "Specs, YAML, identifiers, commands, endpoints, headers, payload keys y agent-facing instructions preservan wording tecnico estable."
  - "La autoridad documental vive donde vive la responsabilidad tecnica."
  - "Central evidence y trackers no reemplazan specs, docs o contracts del repo owner."
  - "Las capabilities cross-repo identifican productor, consumidor y rol del control-plane cuando aplique."
validation_notes: "Decision interna promovida por CR-CP-0001 como canon comun del core."
owner: "4uentes"
open_questions:
  - "Definir validator generico para adopcion de owner documentation authority en repos consumidores."
```

'@
  $sources = $sources -replace '```yaml\r?\nschema_version: "1\.0"\r?\nkind: "source_map"\r?\nsource_id: "source\.control-plane\.observed\.4uentes-orchestor"', "$sourceBlock```yaml`r`nschema_version: `"1.0`"`r`nkind: `"source_map`"`r`nsource_id: `"source.control-plane.observed.4uentes-orchestor`""
}

Set-Content -Path $sourcesPath -Value $sources -Encoding UTF8

Write-Host "CR-CP-0001 core policy canon applied to $core"
