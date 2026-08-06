# CR-CP-0001 Resumen Del Diff De Policies En Core

## Alcance

`CR-CP-0001` promueve dos policies reutilizables de governance desde el patron
del control-plane hacia el canon ARDS/SDD del core:

- `human-doc-language`
- `owner-documentation-authority-policy`

## Repo Core

- Path: `C:\Users\andre\Desktop\4uentes\apps\4uentes-core`
- Package: `@4uentes/ards-core`
- Jira mirror: `ARDS-2`
- Initiative mirror: `ARDS-1`

## Archivos Aplicados

Archivos nuevos:

- `docs/policies/human-doc-language-policy.md`
- `docs/policies/owner-documentation-authority-policy.md`

Archivos actualizados:

- `docs/policies/README.md`
- `specs/integration/policies.yaml`
- `docs/reference-sources.md`

## Cambios Canonicos

- Se agrego documentacion humana para governance comun de idioma documental.
- Se agrego documentacion humana para owner documentation authority.
- Se registraron ambas policies en `specs/integration/policies.yaml`.
- Se actualizo el timestamp del policy registry a `2026-07-07`.
- Se amplio el purpose del registry para incluir documentation language y owner
  documentation authority.
- Se agregaron ambas policies a `docs/policies/README.md`.
- Se agrego `source.decision.common-doc-governance-policies` a
  `docs/reference-sources.md` como fuente explicita de decision interna para la
  promocion.

## Observacion Del Working Tree

Estado de core para el scope de este CR despues de aplicar:

```text
 M docs/policies/README.md
 M docs/reference-sources.md
 M specs/integration/policies.yaml
?? docs/policies/human-doc-language-policy.md
?? docs/policies/owner-documentation-authority-policy.md
```

No se realizo mutacion de repos hijos.

## Evidencia De Aplicacion

El script reproducible de aplicacion es:

- `evidence/requests/CR-CP-0001/apply-core-policy-canon.ps1`

El patch manual anterior se conserva como evidencia de intento fallido:

- `evidence/requests/CR-CP-0001/core-policy-canon.patch`
