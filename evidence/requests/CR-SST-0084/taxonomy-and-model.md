# CR-SST-0084 - Taxonomia y modelo

## Capability

- `dictionary-secret-management-v1`

## Categorias iniciales

- `password`
- `username_password`
- `platform_login`
- `api_key`
- `token`
- `oauth_client`
- `database_connection`
- `ssh_key`
- `certificate`
- `cloud_credential`
- `webhook_secret`
- `encryption_key`
- `recovery_code`
- `mfa_secret`
- `secure_note`
- `file_secret`
- `license_key`
- `payment_provider_secret`
- `ai_provider_secret`
- `storage_provider_secret`
- `repository_provider_secret`
- `ci_cd_secret`
- `vpn_secret`
- `kubernetes_secret`

## Categorias no recomendadas o bloqueadas en v1

- `seed_phrase`
- `wallet_recovery_phrase`
- material equivalente de custodia extrema

## Tipos de conexion

- `web_login`
- `api`
- `database`
- `ssh`
- `sftp`
- `smtp`
- `oauth_app`
- `cloud_account`
- `webhook`
- `vpn`
- `kubernetes`
- `ci_cd`
- `payment_provider`
- `ai_provider`
- `storage_provider`
- `repository_provider`

## Entidades

- `DictionarySecretEntry`: metadata visible y documentacion operativa.
- `ProtectedSecretValue`: valor cifrado, versionado y no retornado por defecto.
- `ConnectionProfile`: datos de conexion no secretos y relacion opcional con
  valores protegidos.
- `SecretAccessEvent`: auditoria de acciones sensibles.

## Reglas de respuesta

- Lista y busqueda: metadata solamente.
- Reveal/copy: valor solo en endpoint explicito, con auditoria.
- Export: metadata solamente.
- Evidence: nunca valores reales.
