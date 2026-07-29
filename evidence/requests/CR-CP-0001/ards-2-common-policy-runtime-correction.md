# CR-CP-0001 - Correccion Common Policy Runtime

## Motivo

Durante la revision posterior se detecto que `ARDS-2` promovio las policies
commons al canon documental del core, pero no las dejo completamente incluidas
como runtime instanciable dentro de los templates/perfiles que definen el
estandar ARDS/SDD.

El problema no era SST-2/SST-3. El gap era de `ARDS-2`:

- `human-doc-language`
- `owner-documentation-authority-policy`

Ambas debian aparecer junto con las agent operating policies comunes en el
runtime local que un repo hijo instancia desde templates.

## Correccion En Core

Repo:

- `4uentes-ards-core`

Archivos actualizados:

- `standard/ARDS_CORE_STANDARD_BASE_v1.md`
- `standard/ARDS_BACKEND_API_CORE_PROFILE_v1.md`
- `standard/ARDS_BACKEND_BFF_CORE_PROFILE_v1.md`
- `standard/ARDS_FRONTEND_WEB_CORE_PROFILE_v1.md`
- `standard/ARDS_FRONTEND_EXTENSION_CORE_PROFILE_v1.md`
- `standard/ARDS_INFRA_CORE_PROFILE_v1.md`
- `standard/ARDS_SHARED_AUTH_PROVIDER_CORE_PROFILE_v1.md`
- `standard/ARDS_CONTROL_PLANE_CORE_PROFILE_v1.md`
- `templates/AGENTS.template.md`
- `templates/specs/integration/policies.template.yaml`
- `templates/specs/policies/00-index.template.yaml`
- `templates/specs/policies/policy-adoption.template.yaml`
- `templates/specs/policies/policy-exception.template.yaml`
- `templates/docs/policies/README.template.md`

## Resultado

El estandar ahora define `common policy runtime` como materializacion local y
machine-readable de policies heredadas del core.

Los templates ahora instancian o referencian:

- `specs/integration/policies.yaml`
- `specs/policies/00-index.yaml`
- adoption/exception manifests bajo `specs/policies/`
- `docs/policies/README.md`
- referencias desde `AGENTS.md`

El set comun inicial queda:

- `http-qa-harness-policy`
- `agent-model-selection-policy`
- `agent-resource-degradation-policy`
- `agent-task-atomization-policy`
- `agent-delegation-policy`
- `agent-context-management-policy`
- `agent-architecture-boundary-policy`
- `human-doc-language`
- `owner-documentation-authority-policy`

## Validacion

Comando:

```powershell
npm.cmd run check
```

Working directory:

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-core
```

Resultado:

```text
Total Errors:   0
Total Warnings: 0
Status:         PASSED
```

Node emitio warnings experimentales/deprecation no relacionados con esta
correccion.
