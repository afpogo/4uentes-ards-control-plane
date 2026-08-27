# Publicacion Owner De Docker Compose De CR-HPT-0021

Fecha: 2026-08-27.

## Owner Y Aislamiento

- Owner: `mena28/finanzas-personales`.
- Base: `origin/main@c4b66e06c749297f268e60ac986613bebd8750ef`.
- Worktree limpio: `worktrees/CR-HPT-0021-phinance-compose`.
- Commit: `f65a00a6023283d4ffdcc13782b53b41817845b3`.
- Pull request: `mena28/finanzas-personales#5`.
- Build remoto: aprobado.
- Merge y readback: `228b192b01ca065b34263cae8534df30b0ed8667`.

El root owner dirty observado antes de la ejecucion no fue modificado.

## Superficie Publicada

- `compose.yaml` levanta PostgreSQL, una migracion Alembic one-shot y el API.
- El API se publica solamente en `127.0.0.1:8766`.
- PostgreSQL no tiene host port.
- El Dockerfile owner mantiene UID/GID `10001` y agrega un entrypoint que arma
  `PHINANCE_DATABASE_URL` dentro del proceso desde un secret file.
- El generador PowerShell usa `RandomNumberGenerator`, no imprime el valor,
  guarda el archivo bajo `.secrets/` ignorado y restringe la ACL al usuario
  Windows actual.
- La documentacion declara correctamente que el archivo source de Compose es
  plaintext protegido por ACL, no cifrado en reposo.

## Validacion

- Gate owner `node backend/scripts/check-contracts.js`: aprobado.
- Pytest: `36 passed`, `4 skipped`; los skips son los tests PostgreSQL que
  requieren una URL QA dedicada.
- `docker compose config --quiet`: aprobado.
- PostgreSQL: healthy y cero bindings de host.
- Alembic: revision observada `20260822_0002`.
- API: healthy, UID `10001`, `/health=ok`, `/ready=ready`.
- El render Compose contiene una referencia de archivo para el secret y ningun
  valor inline.

El stack local queda activo para desarrollo y contiene solamente datos
sinteticos. Su contrasena local no se reutiliza en Kubernetes, GitHub Actions o
ngrok y no fue leida ni persistida en evidencia.

## Compuerta Kubernetes

Compose no resuelve el cifrado en reposo del Secret Kubernetes. El cluster kind
sigue sin `EncryptionConfiguration` ni secret operator, por lo que la escritura
de `phinance-postgres-secret` continua pendiente de la eleccion humana ya
registrada en el addendum.
