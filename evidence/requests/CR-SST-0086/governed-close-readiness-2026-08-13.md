# Readiness de cierre gobernado para SST-26

Fecha: `2026-08-13`

Request: `CR-SST-0086`

Jira mirror: `SST-26`
Resultado local: `PASS`

## Intencion reconciliada

SST-26 no representa una implementacion nueva. Es el contenedor de
release-readiness de `dictionary-secret-management-v1`. Su cierre debe probar
que los cambios ya validados fueron adoptados, desplegados y observados en el
runtime de desarrollo, sin confundir ese resultado con una release de
produccion.

## Adopcion GitHub

Los cuatro PRs historicos de SST-26 estan fusionados en `develop` y sus checks
terminaron correctamente:

| Repo | PR | Merge commit | Resultado |
| --- | --- | --- | --- |
| `afpogo/sst-bend` | `#6` | `8d36a91832a3c55445255c938f0de257312f166b` | merged, checks green |
| `afpogo/sst-fend` | `#4` | `164c19cfcb88c22048eb5cbf5b6c47aa2fa09776` | merged, checks green |
| `afpogo/4uentes-auth` | `#2` | `82f84da4a99feb7b9606c5b1244f8f05ac60efaa` | merged, check green |
| `afpogo/sst-4uentes-infra` | `#3` | `5850500818b78f959949ccbcbc4695c5b3191114` | merged, checks green |

El readback de GitHub confirmo que las imagenes desplegadas de frontend,
backend y BFF son descendientes de esos merge commits. La imagen actual de
`sst-bend` incorpora ademas el hardening posterior de SST-93.

## Runtime de desarrollo

Contexto observado: `kind-sst-cluster-dev`, namespace `4uentes-sst`.

- `sst-fend`: `ghcr.io/afpogo/sst-fend:develop-a7e6eea191bb`, `1/1`.
- `node-auth`: `ghcr.io/afpogo/4uentes-auth:develop-88ba82d58866`, `1/1`.
- `sst-bend`: `ghcr.io/afpogo/sst-bend:develop-131c28cd42cf`, `1/1`.
- `scrapper`: misma imagen backend, `1/1`.
- `SST_DICTIONARY_SECRETS_MASTER_KEY` es consumida desde Kubernetes Secret y
  no desde Git.

La evidencia historica de CR-SST-0086 cubre create, list masked, detail,
reveal temporal, copy, rotate y revoke mediante backend, BFF y UI. El smoke
post-adopcion de SST-93 volvio a ejecutar el flujo backend desplegado mediante
trece checks HTTP-only, sin acceso directo a DB ni seeders y sin valores
centinela en logs.

## Owner documentation

La autoridad documental permanece en los repos hijos:

- `sst-bend`: `docs/api/25-dictionary-secret-management.md` y
  `specs/api/dictionary-secret-management.yaml`;
- `sst-fend`: `docs/34-dictionary-frontend.md`,
  `specs/34-dictionary-frontend.yml` y la capability inbound
  `node-auth--dictionary-secret-management-v1`;
- `4uentes-auth`: capabilities inbound/outbound de
  `dictionary-secret-management-v1`;
- `sst-4uentes-infra`: `specs/infra/security/secrets-provider.yaml`, contrato
  de deployment de `sst-bend` y estado de provisioning de secrets.

## Desviacion historica de scope

El plan original de CR-SST-0086 enumeraba backend, BFF y frontend, pero la
ejecucion incorporo `sst-4uentes-infra` para materializar el Secret y el
contrato de deployment. Esa ampliacion no quedo reflejada oportunamente en
`initial_scope`.

La desviacion queda aceptada de forma retroactiva porque:

- fue necesaria para cerrar el gate de master key del propio request;
- no guardo valores secretos en Git;
- actualizo documentacion owner de infra;
- fue adoptada mediante PR independiente con checks verdes;
- la evidencia registra el incidente de exposicion de una key anterior y su
  rotacion inmediata.

Este registro no normaliza futuras ampliaciones silenciosas: SST-94 debe
declarar backend e infra antes de cualquier mutacion.

## Gaps que no bloquean SST-26

- La automatizacion de provisioning de Kubernetes Secrets desde GitHub Actions
  sigue fuera del modelo aprobado `manual-local-k8s-secrets`.
- La lectura independiente del clipboard desde Chrome MCP quedo limitada por
  permisos; el endpoint copy y la accion UI fueron ejercitados sin persistir
  plaintext.
- Los registros cifrados con una key anterior no son recuperables sin esa key;
  el lifecycle versionado pertenece a CR-SST-0161 / SST-94.
- `sst-extension`, produccion, KMS y material tipo seed phrase siguen fuera de
  alcance.

## Decision local

CR-SST-0086 queda apta para cierre local y la feature puede avanzar a
`validated-live` para el runtime de desarrollo observado. Esto no significa
`ready-for-release`, `released` ni produccion validada.

La sincronizacion Jira se mantiene separada: SST-26 solo puede transicionar a
`Finalizada` despues de una autorizacion enumerada vigente y readback final.
