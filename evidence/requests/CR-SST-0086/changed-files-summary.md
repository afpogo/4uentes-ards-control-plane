# Resumen De Archivos Cambiados

## 4uentes-orchestor

- `requests/inbox/CR-SST-0086-dictionary-secret-release-readiness.yaml`
- `requests/planned/CR-SST-0086-dictionary-secret-release-readiness.yaml`
- `state/features/dictionary-secret-management.current.yaml`
- `docs/requests/dictionary-secret-management-contract.md`: documenta la
  semantica UI de acciones `Ver`, `Ocultar`, `Copiar` y `Revocar` sin cambiar
  contratos API ni persistencia.
- `evidence/requests/CR-SST-0086/*`

## sst-bend

- `.env.example`: agrega placeholders de `SST_DICTIONARY_SECRETS_MASTER_KEY` y
  `SST_DICTIONARY_SECRETS_KEY_REF`.
- `docker-compose.yml`: inyecta `SST_DICTIONARY_SECRETS_MASTER_KEY` y
  `SST_DICTIONARY_SECRETS_KEY_REF` en el servicio `sst` desde el entorno local,
  sin hardcodear valores. Esto cierra el gap detectado en QA donde Docker veia
  la variable en shell pero el proceso SST no la recibia.
- `src/apps/sst/application/diccionario/dictionary-secret-crypto.service.js`:
  errores de master key faltante o invalida pasan a `503 serverUnavailable`.
- `scripts/test-dictionary-secrets.js`: cubre errores operacionales `503` para
  master key ausente o invalida.
- `docs/api/25-dictionary-secret-management.md`: documenta precondiciones
  runtime de master key sin valores reales.
- `specs/api/dictionary-secret-management.yaml`: registra precondicion runtime
  y status de error configuracional.

## sst-fend

- `src/pages/Dictionary/components/DictionarySecretsPanel.tsx`: elimina la fila
  `<button>` que contenia botones anidados, usa `article` seleccionable, agrega
  navegacion por teclado, `aria-label` en acciones, y `id`/`name`/`autocomplete`
  en campos de secreto.
- `src/pages/Dictionary/components/DictionarySecretsPanel.tsx`: bloquea
  reveal/copy/rotate/revoke para secretos no activos, muestra alerta visible
  para secretos revocados y preserva mensajes de error backend cuando la
  respuesta llega como array de errores.
- `src/pages/Dictionary/components/DictionarySecretsPanel.tsx`: reemplaza las
  acciones de texto `Reveal`, `Copy` y `Revoke` por iconos Heroicons con
  tooltips y `aria-label`.
- `src/pages/Dictionary/components/DictionarySecretsPanel.tsx`: agrega toggle
  local de visibilidad; si el secreto ya esta revelado, `EyeSlashIcon` limpia el
  valor efimero y cancela su timer sin llamar al backend.
- `src/pages/Dictionary/styles.module.scss`: agrega estilos compactos y
  estables para acciones icon-only, hover/focus visible y variante danger.
- `src/pages/Dictionary/styles.module.scss.d.ts`: regenerado con el helper de
  CSS modules del repo.

## 4uentes-auth

- Sin cambios de codigo en este request.

## Jira / Initiative

- `SST-26` fue asignado a Fuentes Sandferand, transicionado a `En curso` y
  comentado con contexto ARDS/SDD secret-safe.
- `initiatives/INIT-SST-0002-dictionary-management.yaml` referencia la evidencia
  de inicio de `SST-26`.
- `evidence/requests/CR-SST-0086/child-repo-execution-handoff.md` comunica scope,
  limites y checks esperados para `sst-bend`, `4uentes-auth` y `sst-fend`.
