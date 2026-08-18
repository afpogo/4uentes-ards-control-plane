# Validación de migración de CR-SST-0160

Fecha: `2026-08-11`
Entorno: PostgreSQL local de desarrollo; no producción

La migración
`20260811090000-add-aad-version-to-protected-secret-values.js` se validó en la
secuencia `up -> down -> up`. Las tres operaciones pasaron y el estado final es
`up`.

La columna `aad_version INTEGER NULL` no transforma ciphertext histórico. El
down consulta primero si existen filas con AAD y se niega a eliminar la columna
cuando el conteo es mayor que cero.

El inventario local se ejecutó con `PGHOST=localhost` y devolvió:

- `includesValues: false`;
- `keys: []`.

El SQL selecciona sólo nombres de clave JSONB y conteos. No selecciona ni copia
valores a output/evidence.
