# Publicación y cierre CR-SST-0204

## Publicación owner

- Repositorio: `afpogo/sst-bend`.
- Branch: `feat/CR-SST-0204/chat-retention-contract`.
- Base verificada: `origin/develop@6ee18b3`.
- Head publicado: `7b4dc9f`.
- Pull request: `#21`, base `develop`, 22 archivos, `+1216/-6`.
- Checks: `sst (18.x)` PASS, `sst (20.x)` PASS y
  `build-publish-update` PASS.
- Merge commit: `f58e0a9` en `develop`.

El contrato quedó `active` y la capability `chat-retention-v1` quedó
`ready-for-consumer` en la branch owner. El feature flag continúa apagado por
defecto; publicación contractual no equivale a deployment o activación.

## Cierre del alcance

Se completaron contrato, migración reversible, store temporal con TTL,
promoción idempotente a PostgreSQL, cache Redis fail-open, paginación opaca,
purga física post-delete, owner docs y harnesses reproducibles.

No se escribieron Jira, Auth o Fend y no hubo deployment ni producción. La
publicación satisface la dependencia owner de `CR-SST-0211`; cualquier mutación
de `4uentes-auth` requiere avanzar su lifecycle y aprobación propios.
