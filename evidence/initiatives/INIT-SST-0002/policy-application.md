# INIT-SST-0002 - Aplicacion De Policies

## Alcance

Esta evidencia cubre `INIT-SST-0002 / SST-25` y su issue activo
`SST-26`, asociados a Dictionary Management.

La iniciativa gobierna:

- `dictionary-tags`;
- `dictionary-secret-management`;
- adopcion del modelo global de tags en Diccionario;
- manejo documental de secretos, perfiles de conexion y auditoria;
- futuras conexiones controladas con `CredentialedWebSource`, sin incluir
  `sst-extension` en v1.

## Policies Operativas Aplicadas

- `agent-model-selection-policy`
- `agent-resource-degradation-policy`
- `agent-task-atomization-policy`
- `agent-delegation-policy`
- `agent-context-management-policy`
- `agent-architecture-boundary-policy`
- `human-doc-language`
- `owner-documentation-authority-policy`
- `http-qa-harness-policy`, cuando el CR toca o valida superficies HTTP
  owned por `sst-bend`, `4uentes-auth` o consumers BFF/frontend.

## Policies Y Reglas De Dominio Aplicadas

- `dictionary-secret-safe-policy`: los valores protegidos no se listan, buscan,
  exportan, loguean ni registran en evidencia; `reveal` y `copy` son acciones
  explicitas, autenticadas, account-scoped y auditadas.
- `dictionary-secret-extreme-custody-exclusion`: `seed_phrase`,
  `recovery_phrase`, `mnemonic` y material equivalente quedan bloqueados o
  fuera de soporte en v1.
- `dictionary-tags-compatibility-policy`: el cierre de adopcion de tags debe
  preservar readers legacy, management validado y compatibilidad con
  `tag_definitions`, `tag_values` y `tag_occurrences`.
- `dictionary-evidence-redaction-policy`: smokes, capturas, Jira/MCP, Chrome
  DevTools y HTTP QA deben registrar solo metadata, estados, endpoints,
  resultados sanitizados y referencias; no deben conservar JWTs, cookies,
  master keys, payloads secretos ni plaintext.
- `dictionary-owner-documentation-policy`: cualquier CR que modifique runtime
  owner en `sst-bend`, `4uentes-auth` o `sst-fend` debe actualizar specs/docs
  owner o registrar excepcion antes de cierre.

## Drivers De Riesgo

- secretos de usuario, tokens, API keys, passwords y connection strings;
- riesgo de exponer plaintext en UI, logs, evidencia, QA HTTP o Jira;
- scope multi-repo entre `sst-bend`, `4uentes-auth`, `sst-fend` y futuro
  `sst-extension`;
- convivencia entre Diccionario legacy y modelo global de tags;
- autenticacion/account scope en endpoints de reveal/copy;
- master key runtime y rotacion manual/local.

## Evidencia Fuente

- `docs/requests/dictionary-secret-management-contract.md`
- `state/features/dictionary-tags.current.yaml`
- `state/features/dictionary-secret-management.current.yaml`
- `evidence/requests/CR-SST-0076/execution-start-and-subagent-analysis.md`
- `evidence/requests/CR-SST-0084/taxonomy-and-model.md`
- `evidence/requests/CR-SST-0084/minimum-threat-model.md`
- `evidence/requests/CR-SST-0084/secret-safe-review.md`
- `evidence/requests/CR-SST-0086/secret-safe-review.md`
- `evidence/requests/CR-SST-0086/authenticated-http-smoke-2026-06-28.md`

## Decision

`INIT-SST-0002` debe quedar incluida en el modelo de policies vivas junto con
`INIT-SST-0003`. No es una policy general para todos los repos: su aplicacion
es de perfil/dominio Dictionary, request-driven y condicionada por ownership,
HTTP surface y sensibilidad de secretos.

No se mutaron repos hijos para esta correccion documental.
