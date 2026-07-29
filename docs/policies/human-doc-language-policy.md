# Human Doc Language Policy

## Proposito

Esta policy fija el idioma operativo para la documentacion humana del
orchestrator y de cualquier instancia que adopte el mismo patron.

La policy esta registrada en `specs/integration/policies.yaml` con el id
`human-doc-language`.

## Regla Base

- Markdown humano: espanol.
- Markdown agent-facing: ingles tecnico o mixto tecnico controlado.
- Specs normativos y YAML: ingles.
- Identificadores tecnicos estables: no se traducen.

## Alcance

Markdown humano en espanol:

- `README.md`
- `docs/`, salvo la capa AI o agent-facing
- `inventory/*.md`
- `evidence/**/*.md`
- `knowledge/**/*.md`

Markdown agent-facing en ingles tecnico o mixto controlado:

- `AGENTS.md`
- `docs/ai/`
- cualquier instruccion operativa cuyo valor dependa de wording estable para
  agentes o tooling

Specs y YAML normativos en ingles:

- `specs/*.yaml`
- `requests/*.yaml`
- `catalog/*.yaml`
- `solutions/*.yaml`

Identificadores tecnicos estables que no se traducen:

- filenames y paths
- claves YAML
- `service_id`, `capability_id` y otros IDs ARDS/SDD
- comandos CLI
- nombres de servicios, features y productos tecnicos
- estados del lifecycle `inbox`, `planned`, `queued`, `running`, `done`,
  `rejected`

## Enforcement

- Antes de crear o migrar documentacion humana, verificar que la prosa nueva
  quede en espanol.
- No traducir comandos, payloads, nombres de endpoints, IDs ni referencias
  estables usadas por tooling.
- Si un documento humano debe permanecer en ingles por una razon operativa,
  registrar la excepcion en el request o evidence correspondiente.

## Implementacion Local

- Guia detallada y checklist de migracion: `docs/idioma-markdown.md`
- Registry machine-readable: `specs/integration/policies.yaml`
- Template reusable para otra instancia del orchestrator:
  `templates/human-doc-language-policy.template.md`

## Gap Vigente

La adopcion local queda activa en este orchestrator. El handoff reusable a
`4uentes-ards-core` sigue pendiente como trabajo de estandarizacion cross-repo.
