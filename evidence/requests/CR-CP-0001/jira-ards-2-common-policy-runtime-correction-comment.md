# ARDS-2 correccion common policy runtime

Se corrigio el alcance de `CR-CP-0001 / ARDS-2`.

El gap no era de SST-2/SST-3. El problema era que las policies commons
promovidas por ARDS-2 al core (`human-doc-language` y
`owner-documentation-authority-policy`) no habian quedado incluidas como runtime
instanciable en los templates/perfiles que definen el estandar ARDS/SDD.

Correccion aplicada en `4uentes-ards-core`:

- `standard/ARDS_CORE_STANDARD_BASE_v1.md` define `common policy runtime`.
- Los perfiles core instanciables declaran que deben instanciar o justificar
  `specs/integration/policies.yaml`, `specs/policies/`,
  `docs/policies/README.md` y refs desde `AGENTS.md`.
- `templates/AGENTS.template.md` incluye el set de policies comunes.
- `templates/specs/integration/policies.template.yaml` incluye el set comun:
  agent policies, `http-qa-harness-policy`, `human-doc-language` y
  `owner-documentation-authority-policy`.
- `templates/specs/policies/*` soporta adoption/exception manifests con
  clasificacion, owner canonico, applicability, adoption mode y profiles.
- `templates/docs/policies/README.template.md` documenta el common policy
  runtime heredado.

Validacion:

- `4uentes-ards-core`: `npm.cmd run check` paso con `0 errors / 0 warnings`.
- `4uentes-orchestor`: `npm.cmd run check` paso con `0 WARN / 0 FAIL`.

Evidencia local:

- `evidence/requests/CR-CP-0001/ards-2-common-policy-runtime-correction.md`
