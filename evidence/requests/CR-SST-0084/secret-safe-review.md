# CR-SST-0084 - Secret-safe review

Revisado el 2026-06-24.

## Resultado

PASS con alcance local.

## Controles verificados

- `sst-bend` usa tablas separadas para secretos y no reutiliza
  `dictionary_entries.value`.
- `ProtectedSecretValue` persiste `ciphertext`, `nonce`, `authTag`,
  algoritmo y `keyRef`; el plaintext solo existe durante create, reveal, copy
  o rotate en memoria de request.
- Lista y detalle usan presenter metadata-only con `protectedValue.state`.
- `reveal` y `copy` son endpoints separados y crean `SecretAccessEvent`.
- `seed_phrase`, `recovery_phrase`, `mnemonic` y equivalentes quedan
  bloqueados por schema/policy.
- `node-auth` preserva `Authorization`, `x-active-account-id` y
  `x-account-id`, no persiste dominio SST en Mongo y filtra defensivamente
  campos tipo value en metadata.
- `sst-fend` mantiene valores revelados en estado local de
  `DictionarySecretsPanel`, usa auto-hide y copia al clipboard sin Redux ni
  localStorage.

## Gaps aceptados

- Vault/KMS queda fuera de v1; el corte usa master key por entorno.
- `sst-extension` queda fuera de v1.
- QA HTTP autenticado completo queda condicionado a credenciales locales
  (`SMOKE_JWT`/`SMOKE_JWT_OWNER`).
