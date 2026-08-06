# Handoff A Repos Hijos

## Contexto

- Initiative: `INIT-SST-0002`
- Epic Jira: `SST-25`
- Task Jira: `SST-26`
- Request: `CR-SST-0086`
- Fecha: `2026-06-28`

`SST-26` fue asignado a Fuentes Sandferand y transicionado a `En curso`.

## Repos En Scope

- `sst-bend`
- `4uentes-auth`
- `sst-fend`

`sst-extension` queda fuera de v1.

## Objetivo Comunicado

Completar release readiness de `dictionary-secret-management-v1` sin reabrir
`CR-SST-0084`.

## Gaps A Cerrar

- Confirmar `SST_DICTIONARY_SECRETS_MASTER_KEY` por ambiente objetivo.
- Mantener list/search/detail metadata-only.
- Mantener reveal temporal y auto-hide.
- Mantener copy sin persistencia visible ni storage de plaintext.
- Confirmar rotate/revoke con valores ficticios y evidencia sanitizada.
- Evitar JWTs, cookies, master keys y plaintext de secretos en logs/evidencia.

## Validacion Esperada

### sst-bend

- `npm.cmd run test:diccionario:secrets`
- `npm.cmd run test:diccionario:stage3`
- `npm.cmd run build`
- `npm.cmd run check`
- smoke autenticado si hay token QA efimero disponible.

### 4uentes-auth

- `npm.cmd run build`
- `npm.cmd run check`
- smoke BFF para `/api/diccionario/secrets/*`, auth/header forwarding y
  metadata-only fuera de reveal/copy.

### sst-fend

- lint focalizado de `DictionarySecretsPanel`
- `npm.cmd run build`
- QA Chrome DevTools MCP para create/list/reveal/auto-hide/copy/rotate/revoke.

## Decision De Seguridad

No se deben registrar valores de secretos, master keys reales, JWTs ni cookies.
Cuando haga falta una master key local, debe ser ficticia/efimera y no
persistirse en archivos ni evidencia.
