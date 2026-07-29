**1. Veredicto Ejecutivo**
- `overall_status`: `core_partial`
- `confidence`: `medium`
- versión observada: `package.json` `0.1.0`; git `2ad4e0f`; working tree con cambios locales no commiteados.
- resumen: El Core observado implementa una capa reusable real para ARDS/SDD: estándar base, perfiles, templates, governance, policy registry, contrato read-only de sync vía MCP y validación propia. La separación Core / Orquestador / Repo hijo está documentada y los boundary controls principales no fallan. No obstante, no alcanza conformidad completa: varios modelos obligatorios están solo en Markdown/templates, no tienen schema o validador determinístico; hay perfiles `initial-profile`/`needs-review`; el estado versionado es ambiguo por working tree sucio; y faltan contratos canónicos completos para CR, INIT, State, Evidence y Agent Governance con validación fuerte.

**2. Mapa de Artefactos Canónicos**

| Dominio | Artefacto normativo | Versión | Consumidor | Validación |
|---|---|---:|---|---|
| Standard base | `standard/ARDS_CORE_STANDARD_BASE_v1.md` | v1 | todos | `npm run check` |
| Minimum contract | `governance/repo-minimum-contract.md` | n/a | child repos | `validate.ts` required files |
| DoD/Evidence | `governance/definition-of-done.md` | n/a | agentes/auditores | manual + check |
| Source validation | `governance/source-validation.md` | n/a | core maintainers | manual + source maps |
| Profiles | `standard/*_PROFILE_v1.md` | v1 | repos por tipo | parcial |
| Capability | `schemas/capability.*.schema.yaml`, templates | 1.0 | producers/consumers | YAML/check |
| Policy model | `specs/policies/ards-sdd-policy-component-model.yaml` | 1.0 | core/control-plane/child | YAML/check |
| Policy registry | `specs/integration/policies.yaml` | 1.0 | adopters | YAML/check |
| Sync contract | `ards.get_sync_contract` | `ards-core-contract-v0.1` | orchestrator | smoke code + check |
| MCP | `tools/mcp/server.ts` | server 0.1.0 | MCP clients | `mcp:smoke` available |

**3. Canon Versus Instancia**

Correctamente canónico: estándar base, minimum contract, DoD, source validation, profiles, capability templates/schemas, policy registry, anti-duplication rules y sync contract. Evidencia: `docs/concepts/ards-core.md:23-28`, `docs/concepts/core-orchestrator-child-sync.md:10-15`, `standard/ARDS_CORE_STANDARD_BASE_v1.md:77-88`.

Contenido específico de Solution encontrado: referencias a `sst-bend` y `4uentes-auth` como fuentes observadas, no como estado operativo vivo. Riesgo moderado: `standard/ARDS_CORE_STANDARD_BASE_v1.md:174`, `standard/ARDS_BACKEND_BFF_CORE_PROFILE_v1.md:9`, `docs/reference-sources.md` con paths locales absolutos. No encontré catálogos operativos vivos, requests vivos ni evidence de una Solution dentro del Core.

Candidatos a promoción desde Control Plane: schema/contrato de CR lifecycle, Evidence manifest, State linking, capability linking, adoption/sync report schema. El Core ya reconoce el gap en `tools/mcp/catalog.ts:258` y `admin/decisions/0007...`.

Debe permanecer local: catálogos `catalog/services`, `solutions`, bindings locales, requests vivos, evidence de ejecución y estado de sincronización por repo. El Core lo separa en `docs/concepts/core-orchestrator-child-sync.md:32-46`.

**4. Resumen por Dimensión**

| Dimensión | Estado | Evidencia principal | Riesgo |
|---|---|---|---|
| A Identidad/versionado | partial | `README.md:5`, `specs/00-index.yaml:3`, dirty tree | versión no trazable |
| B Estándar reusable | partial | `standard/...:105-135`, profiles | perfiles inmaduros |
| C Governance/modelos | partial | `governance/*`, `specs/policies/*` | modelos sin schemas completos |
| D Canon vs instancia | compliant | `core-orchestrator-child-sync.md:10-15` | bajo |
| E Consumo/sync | compliant_with_observations | `tools/mcp/catalog.ts:389-478` | no valida repos por sí mismo |
| F Recursos/portabilidad | partial | provider-agnostic policies, MCP | prompts no todos con contrato formal |
| G Validación | partial | `npm run check` PASS | check no valida semántica profunda |
| H Ejecución/seguridad | compliant | read-only MCP, no child writes | bajo |

**5. Hallazgos Priorizados**

```yaml
id: FINDING-CORE-001
control_ids: [CORE-02, CORE-04, CORE-05, CORE-32]
type: fact
status: partial
severity: high
confidence: high
title: "La versión observable no es plenamente trazable por working tree sucio"
evidence:
  - kind: command
    reference: "git rev-parse --short HEAD -> 2ad4e0f; git status --short -> múltiples M/??"
    detail: "El Core declara 0.1.0, pero el estado auditado incluye cambios locales."
impact: "No se puede afirmar que el canon observado corresponde exactamente al commit o release."
minimum_remediation: "Cerrar cambios en commit/tag o marcar auditoría como working-tree snapshot."
suggested_change_unit: CR-CORE
```

```yaml
id: FINDING-CORE-002
control_ids: [CORE-17, CORE-18, CORE-21, CORE-40, CORE-43]
type: fact
status: partial
severity: high
confidence: high
title: "Modelos canónicos clave no tienen schema/validador determinístico completo"
evidence:
  - kind: file
    reference: "validate.ts:49-78,332-372"
    detail: "Valida presencia, links, YAML y tono; no valida semántica de CR/INIT/State/Evidence."
  - kind: file
    reference: "governance/definition-of-done.md:31-46"
    detail: "State scenarios y capabilities están definidos como criterios, no como contrato exhaustivo."
impact: "Un consumidor puede adoptar estructura pero no detectar drift semántico con precisión."
minimum_remediation: "Agregar schemas/fixtures para CR, INIT, State, Evidence, sync diff y adoption report."
suggested_change_unit: CR-CORE
```

```yaml
id: FINDING-CORE-003
control_ids: [CORE-08, CORE-09, CORE-41]
type: fact
status: partial
severity: medium
confidence: high
title: "Varios perfiles siguen en initial-profile o needs-review"
evidence:
  - kind: file
    reference: "standard/ARDS_CORE_STANDARD_BASE_v1.md:189,206-210"
    detail: "Backend/BFF queda needs-review y hay decisiones pendientes."
  - kind: file
    reference: "specs/00-index.yaml:81-82"
    detail: "El índice conserva una open question sobre tooling de validación pese a existir validate.ts."
impact: "El Core es reusable, pero no todos los perfiles son canon cerrado."
minimum_remediation: "Separar perfiles activos de drafts y actualizar índice/roadmap según el validador actual."
suggested_change_unit: CR-CORE
```

```yaml
id: FINDING-CORE-004
control_ids: [CORE-39, CORE-40]
type: fact
status: partial
severity: medium
confidence: high
title: "La validación ejecutable pasa, pero cubre estructura más que conformidad ARDS profunda"
evidence:
  - kind: command
    reference: "npm run check"
    detail: "Exit code 0; Total Errors 0; Total Warnings 0."
  - kind: file
    reference: "validate.ts:361-364"
    detail: "Checks: Required Files, Internal Links, YAML Syntax, Tone & Scope."
impact: "Un cambio puede pasar sin cumplir todos los contratos semánticos del estándar."
minimum_remediation: "Agregar validación semántica para registry, source maps, profiles, binding y sync contracts."
suggested_change_unit: CR-CORE
```

**6. Matriz Completa de Controles**

| ID | Nivel | Estado | Evidencia | Nota |
|---|---|---|---|---|
| CORE-01 | MUST | compliant | `docs/concepts/ards-core.md:3-6` | declara Core |
| CORE-02 | MUST | partial | `package.json 0.1.0`, dirty tree | versión no cerrada |
| CORE-03 | MUST | partial | `docs/concepts/ards-core.md:35-45` | separación existe, taxonomía no exhaustiva |
| CORE-04 | MUST | partial | `admin/ADR-FORMAT.md`, decisions | proceso existe parcial |
| CORE-05 | SHOULD | partial | `source-validation.md:45-57` | no todo tiene CR |
| CORE-06 | MUST | compliant | `standard/...:105-116` | contrato mínimo |
| CORE-07 | MUST | compliant | `standard/...:51-75` | AGENTS/specs/docs/check |
| CORE-08 | MUST | partial | profiles v1 | varios initial-profile |
| CORE-09 | MUST | partial | templates + TODOs | alineación no completa |
| CORE-10 | MUST | compliant | `core-orchestrator-child-sync.md:192-222` | binding/drift |
| CORE-11 | MUST | compliant | `repo-minimum-contract.md:7-13` | mínimo claro |
| CORE-12 | MUST | compliant | `definition-of-done.md:5-23` | DoD/evidence |
| CORE-13 | MUST | compliant | `source-validation.md:7-11` | regla canónica |
| CORE-14 | MUST | compliant | `specs/integration/policies.yaml:55-210` | policies activas |
| CORE-15 | MUST | compliant | `schemas/capability.*` | capability model |
| CORE-16 | MUST | partial | `state-scenario.template.yaml`, DoD | falta schema fuerte |
| CORE-17 | MUST | partial | control-plane profile | no CR schema canónico |
| CORE-18 | MUST | partial | `ards.plan_project_init` | INIT implícito, no modelo |
| CORE-19 | MUST | partial | policies registry | autoridad/permisos parciales |
| CORE-20 | MUST | partial | runtime límites docs | contrato runtime indirecto |
| CORE-21 | SHOULD | partial | capability schemas only | coverage incompleto |
| CORE-22 | MUST | compliant | policy model + sync docs | canónico, no instancia |
| CORE-23 | MUST | compliant | search no requests/evidence vivos | sin estado Solution |
| CORE-24 | MUST | compliant | refs observadas como sources | no normativo directo |
| CORE-25 | MUST | compliant | `ards-core.md:119-126` | no negocio |
| CORE-26 | MUST | compliant | `ards-core.md:23-28` | capas claras |
| CORE-27 | MUST | compliant | `contract-binding.template.yaml` | binding |
| CORE-28 | MUST | compliant | `ards.get_sync_contract` | read-only sync |
| CORE-29 | MUST | compliant | `tools/mcp/catalog.ts:439-478` | campos determinísticos |
| CORE-30 | MUST | compliant | `core-orchestrator-child-sync.md:69-89` | anti-copy |
| CORE-31 | MUST | compliant | `ards-core.md:93-95` | no child writes |
| CORE-32 | SHOULD | partial | contract v0.1 only | compat futura limitada |
| CORE-33 | MUST | partial | provider agnostic yes, observed refs | acople bajo pero presente |
| CORE-34 | MUST | compliant | docs/specs versionados | prompts no únicos |
| CORE-35 | SHOULD | partial | prompts listados | contratos de prompt parciales |
| CORE-36 | MAY | compliant | `server.ts:184-231` | MCP resources |
| CORE-37 | MUST | compliant | MCP lee repo | no autoridad separada |
| CORE-38 | SHOULD | compliant | `server.ts:427-451` | plan/read-only |
| CORE-39 | MUST | compliant | `npm run check` PASS | validación existe |
| CORE-40 | MUST | partial | `validate.ts` | no semántica completa |
| CORE-41 | MUST | partial | TODOs visibles | no ocultos, pero deuda |
| CORE-42 | MUST | compliant | `source-validation.md:45-57` | promoción gobernada |
| CORE-43 | SHOULD | partial | smoke existe | fixtures limitados |
| CORE-44 | SHOULD | partial | sync diff examples | facilita, no observa |
| CORE-45 | MUST | compliant | `ards-core.md:121-126` | no runtime producto |
| CORE-46 | MUST | compliant | read-only MCP | mínimo privilegio |
| CORE-47 | MUST | compliant | mutables futuras fuera base | gobernado separado |

**7. Backlog**

Faltantes del Core: schemas/validadores para CR lifecycle, INIT, State, Evidence, sync diff, adoption report; reconciliar `specs/00-index.yaml` con `validate.ts`; cerrar/taggear versión auditable; elevar perfiles `initial-profile` a activos o marcarlos como draft.

Contenido local candidato a promoción: modelos del control-plane para request lifecycle, evidence manifest, state read model, capability links y adoption/sync report.

Contenido que no debe promoverse: requests vivos, evidence de ejecución, bindings locales, service catalog real, solutions reales, child repo snapshots.

Riesgos de compatibilidad: `latest` resuelve a `ards-core-contract-v0.1`; futuros breaking changes deben crear nueva versión, no mutar silenciosamente el contrato actual.

**8. Evidencia Positiva y Preguntas Abiertas**

Positivo: separación de capas clara, no hay runtime de producto, MCP es read-only, `npm run check` pasa con exit code 0, y los boundary controls principales están conformes.

Preguntas abiertas no respondidas por el repo: convención final de severidad para gaps/state scenarios; formato canónico final de IDs cross-repo; obligatoriedad/nombre de `check` en repos no JavaScript; si `catalog/services` y `solutions` tendrán templates canónicos en Core.