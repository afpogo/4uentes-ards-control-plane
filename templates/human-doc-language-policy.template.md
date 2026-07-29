# Human Doc Language Policy Template

Usar este template cuando otra instancia del orchestrator necesite adoptar la
policy `human-doc-language` en su propio repo.

## Minimos Obligatorios

1. Registrar `human-doc-language` en `specs/integration/policies.yaml`.
2. Publicar una version local de `docs/policies/human-doc-language-policy.md`.
3. Mantener una guia detallada o compat layer equivalente a
   `docs/idioma-markdown.md`.
4. Linkear la policy en `state/policy-links.yaml`.

## Registry Snippet

```yaml
- id: "human-doc-language"
  name: "Human Documentation Language Policy"
  type: "agent-operating-policy"
  status: "active"
  scope:
    - "human-documentation-language"
    - "markdown-authoring"
    - "cross-repo-adoption"
  owner: "<orchestrator-repo-id>"
  human_doc: "docs/policies/human-doc-language-policy.md"
  related_docs:
    - "docs/idioma-markdown.md"
    - "templates/human-doc-language-policy.template.md"
  enforcement:
    expected: "Write human-facing Markdown in Spanish, keep agent-facing Markdown in controlled technical English when operational stability requires it, and keep normative specs and YAML in English without translating stable technical identifiers."
    mode: "operational-review"
    failure_behavior: "record-gap-or-exception"
  evidence:
    - "docs/policies/human-doc-language-policy.md"
    - "docs/idioma-markdown.md"
    - "state/policy-links.yaml"
    - "specs/integration/policies.yaml"
  gaps:
    - "Record any pending handoff to the shared ARDS/SDD standard source if local policy precedes core standardization."
  relates_to:
    - "agent-context-management-policy"
    - "agent-architecture-boundary-policy"
```

## Human Doc Skeleton

```md
# Human Doc Language Policy

## Proposito

Definir el idioma base para documentacion humana, agent-facing y specs
normativos del repo.

## Regla Base

- Markdown humano: espanol.
- Markdown agent-facing: ingles tecnico o mixto tecnico controlado.
- Specs normativos y YAML: ingles.
- Identificadores tecnicos estables: no se traducen.
```

## State Link Snippet

```yaml
- policy_id: "human-doc-language"
  policy_class: "orchestrator-required"
  source_repo: "<orchestrator-repo-id>"
  source_ref: "docs/policies/human-doc-language-policy.md"
  state_kind: "feature_state"
  state_id: "<policy-governance-state-id>"
  state_file: "state/features/<policy-governance-state-file>.yaml"
  link_status: "linked"
  work_origin: "orchestrator-request"
  request_id: "<request-id>"
```

## Checklist

- Confirmar que `README.md` y `docs/` humanos usen espanol.
- Confirmar que `AGENTS.md` y docs agent-facing sigan en wording estable para
  agentes.
- Confirmar que `specs/`, `requests/`, `catalog/` y `solutions/` no se
  traduzcan.
- Ejecutar el check canonico del repo.
