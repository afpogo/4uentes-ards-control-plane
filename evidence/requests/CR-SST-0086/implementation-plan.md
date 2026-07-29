# Plan De Implementacion

## Objetivo

Promover `dictionary-secret-management` desde `validated-local` hacia
`validated-live` solo si quedan cerrados los gaps urgentes de runtime, smoke
autenticado, frontend DOM/a11y y Jira/MCP read-only.

## Subtareas

1. `sst-bend`: documentar `SST_DICTIONARY_SECRETS_MASTER_KEY` y
   `SST_DICTIONARY_SECRETS_KEY_REF` como precondiciones runtime sin almacenar
   valores reales.
2. `sst-bend`: agregar validacion defensiva para que `create`, `reveal` y
   `rotate` fallen con error operacional claro si falta master key.
3. `sst-bend`: ejecutar smoke autenticado create/list/reveal/copy/rotate/revoke
   con token QA efimero y valores ficticios.
4. `4uentes-auth`: validar BFF para `/api/diccionario/secrets/*`, incluyendo
   401/403, forwarding de headers y respuestas metadata-only fuera de
   reveal/copy.
5. `sst-fend`: eliminar nested `<button>` en `DictionarySecretsPanel`, dejando
   los controles `Reveal`, `Copy` y `Revoke` como botones reales y la fila como
   contenedor no-button.
6. `sst-fend`: agregar `id`, `name`, labels accesibles y `autocomplete`
   apropiado para campos de secreto, password y new password.
7. Jira/MCP: ejecutar solo lectura contra `/v1/mcp`; si aparece `403 The app is
   not installed`, registrar blocker y no escribir.
8. Control-plane: registrar evidencia sanitizada, mantener estado
   `validated-local` durante la ejecucion y promover a `validated-live` solo al
   cierre exitoso.

## Definition Of Done

- Tests y builds requeridos pasan o quedan bloqueados con motivo explicito.
- El smoke autenticado cubre create/list/reveal/copy/rotate/revoke.
- List sigue masked/metadata-only.
- Reveal auto-hide sigue en 60 segundos.
- Copy no deja valor persistente.
- No hay `validateDOMNesting` nuevo en QA frontend.
- Jira/MCP no recibe writes sin aprobacion explicita.
- Evidencia queda sin secretos, JWTs, cookies ni master keys reales.
