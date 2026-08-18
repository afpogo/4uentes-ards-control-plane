# Implementacion local de SST-94

Fecha: 2026-08-15

## Resultado

CR-SST-0161 quedo implementado y validado localmente en dos worktrees aislados.
No se realizaron commits, pushes, PRs, escrituras Jira ni mutaciones runtime.

## Baselines y branches

- `sst-bend`
  - base: `origin/develop` en `131c28cd42cfbac6ae429e91075d58cb433a9d0c`;
  - branch: `feat/SST-94/CR-SST-0161/versioned-dictionary-keyring`;
  - worktree: `worktrees/CR-SST-0161-bend`.
- `sst-4uentes-infra`
  - base: `origin/develop` en `11540e90c3d49922a00d2f2f787c99f0e15897af`;
  - branch: `feat/SST-94/CR-SST-0161/development-keyring-contract`;
  - worktree: `worktrees/CR-SST-0161-infra`.

Los worktrees originales con cambios ajenos no fueron modificados.

## Backend

- Se agrego un keyring allowlisted de referencias `env:`.
- `SST_DICTIONARY_SECRETS_KEY_REF` gobierna solo escrituras nuevas.
- `SST_DICTIONARY_SECRETS_KEY_REFS` declara las referencias permitidas.
- El descifrado v1 y legacy resuelve la clave mediante el `keyRef` persistido.
- La configuracion single-key actual sigue siendo compatible.
- Cuando se declara configuracion de Dictionary Secrets, el servidor valida la
  activa y todo el keyring antes de escuchar.
- Referencias mal formadas, no permitidas o sin material fallan con `503`
  sanitizado; las fallas de autenticacion AES-GCM continúan como integridad.
- No se agrego ni modifico ninguna migracion o tabla.

## Infraestructura

- El ConfigMap conserva como unica referencia actual
  `env:SST_DICTIONARY_SECRETS_MASTER_KEY` y la declara tambien en la allowlist.
- El Secret dedicado se inyecta mediante `envFrom`, permitiendo agregar futuras
  variables versionadas sin exponer valores en ConfigMap o Git.
- El ejemplo y los contratos documentan versiones futuras, orden de staging,
  rollback del selector y prohibicion de retirar claves aun referenciadas.
- Se agrego un runbook de desarrollo que no autoriza su propia ejecucion.

## Boundary respetado

- base de datos: no usada;
- migrations/seeders: no ejecutados;
- Kubernetes apply real: no ejecutado;
- claves runtime: no leidas, creadas ni rotadas;
- re-encryption: no ejecutada;
- produccion/KMS/TLS: sin cambios ni claims;
- Jira: sin lectura vigente ni escrituras.

## Estado

La implementacion esta lista para revision de diff y una futura adopcion por PR.
La adopcion, el smoke runtime y toda rotacion real requieren gates posteriores.
