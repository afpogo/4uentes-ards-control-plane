# Baseline Y Diseño Consumidor De CR-SST-0216

Fecha: 2026-08-23.

## Baseline Owner

- `sst-bend origin/develop@357ac2a` contiene el shell Phinance publicado por
  `CR-SST-0212` y mantiene el forwarding de negocio cerrado.
- El root owner tiene cambios ajenos; no será usado para mutación.
- `resolveAccountContext` valida `JWT sub`, cuenta activa y membership `active`.
- Los roles owner vigentes son `owner` y `member`.
- SST ya tiene un proveedor `client_credentials` con cache, renovación y
  deduplicación concurrente; la adopción evitará duplicar esa semántica.
- Auth publica el tuple exacto `sst-bend -> phinance-api / finance:invoke`
  bajo `CR-SST-0214`.
- Phinance acepta `finance:read`, `finance:write` y `finance:audit:read`, pero
  deja el role mapping al owner SST.

## Decisión De Menor Privilegio

| Membership SST | Entitlements Phinance |
| --- | --- |
| `owner`, activo | `finance:read`, `finance:write`, `finance:audit:read` |
| `member`, activo | `finance:read` |
| desconocido, ausente o inactivo | ninguno; rechazo fail-closed |

El navegador no puede ampliar el mapping. `finance_profile_id` no se acepta ni
se produce en SST. El proxy seguirá devolviendo
`PHINANCE_FACADE_UNAVAILABLE` hasta que el verifier owner de Phinance exista.

