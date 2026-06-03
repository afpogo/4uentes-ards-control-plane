# CR-SST-0012 - Resumen Del Contrato

Observado el: 2026-05-24

## Cambio

Se agrego una regla obligatoria para que cada repo hijo gobernado por
`4uentes-orchestor` conozca el formato `orchestrator_link`.

## Artefactos

- `docs/cross-repo/child-repo-orchestrator-link-rule.md`
- `docs/cross-repo/child-repo-onboarding.md`
- `templates/child-orchestrator-link-rule.md`
- `templates/service-catalog-entry.template.yaml`
- `catalog/services/*.yaml`
- `scripts/verify-catalog.js`

## Regla En Catalogo

Cada servicio catalogado ahora declara:

```yaml
orchestrator_link_contract:
  required: true
  status: pending-child-adoption
  rule_ref: "docs/cross-repo/child-repo-orchestrator-link-rule.md"
  template_ref: "templates/child-orchestrator-link-rule.md"
  metadata_key: "orchestrator_link"
  capability_state_map: "state/capability-links.yaml"
```

## Limite

No se modificaron repos funcionales. La adopcion local real de la regla dentro
de cada repo hijo debe ejecutarse con requests separados.

