# Smoke post-adopcion de SST-93

Fecha: `2026-08-13`

Entorno: desarrollo local Kubernetes, contexto `kind-sst-cluster-dev`

Namespace: `4uentes-sst`
Resultado SST-93: `PASS`

## Adopcion observada

- PR de adopcion: `afpogo/sst-bend#12`, fusionado a `develop`.
- Commit de merge: `131c28cd42cfbac6ae429e91075d58cb433a9d0c`.
- Imagen observada en `sst-bend` y `scrapper`:
  `ghcr.io/afpogo/sst-bend:develop-131c28cd42cf`.
- `deployment/sst-bend`: rollout completo, pod `1/1`, estado `Running` y
  cero reinicios al momento de la prueba.
- Entrada publica `http://localhost:8088/`: `200`.
- JWKS publico: `200`.
- Dictionary Secrets sin credencial: `401`, como corresponde.

No se aplicaron manifiestos, migraciones, seeders ni cambios de configuracion.
Tampoco se consulto o modifico PostgreSQL de forma directa.

## Autenticacion de QA

Las credenciales historicas documentadas fueron rechazadas por el runtime y
no se probaron variantes. El helper JWT local tampoco era util porque no
correspondia a la llave publica vigente del cluster.

Para evitar leer o exportar material sensible, `node-auth` emitio dentro de su
propio pod un JWT owner efimero de quince minutos para el sujeto legacy ya
existente. El token permanecio en memoria, no se imprimio, no se escribio en
archivos y se elimino del entorno del proceso al terminar.

## Smoke HTTP-only

Se uso exclusivamente la API desplegada y datos sinteticos. Pasaron trece
verificaciones:

- `list`, `create`, `detail` y `update`;
- `reveal` y `copy` de la version inicial;
- `rotate` y `reveal` de la version 2;
- rechazo `400` de metadata no clasificada en entrada y perfil, sin reflejar
  el valor rechazado;
- aislamiento de cuenta con `403` y error generico;
- `revoke` por API;
- `reveal` posterior al revoke con `409`.

Las respuestas de create, detail, update, rotate y revoke permanecieron
enmascaradas. El plaintext solo aparecio en las respuestas explicitas de
`reveal` y `copy` y se comparo en memoria con el valor sintetico esperado.

La API v1 no ofrece borrado fisico: la entrada sintetica creada quedo revocada,
que es el cleanup permitido por contrato. No se uso SQL para eliminarla.

## Seguridad y logs

La busqueda posterior en los logs recientes de `sst-bend` y `node-auth` no
encontro el prefijo de los valores centinela ni el nombre sintetico de la
entrada. El harness no imprimio JWT, plaintext ni valores centinela.

`npm.cmd run test:diccionario:secrets` paso sin conexion a DB. Esta suite
completo los criterios que no pueden provocarse por la API publica sin alterar
persistencia:

- cambios de `accountId`, `secretEntryId`, version, algoritmo, `keyRef` y
  `aadVersion` fallan integridad;
- cambios de ciphertext, nonce y auth tag fallan integridad;
- ciphertext v1 no hace downgrade al camino legacy;
- registros legacy con `aadVersion=null` usan solamente el camino legacy;
- reveal/copy exitosos auditan despues de descifrar y las fallas registran un
  outcome seguro;
- la migracion nullable es idempotente y su rollback se bloquea si existen
  ciphertexts ligados a contexto.

## DoD

| Gate | Resultado | Evidencia |
| --- | --- | --- |
| Rollout de la imagen adoptada | PASS | tag del merge y rollout completo |
| Smoke autenticado SST-93 | PASS | 13 checks HTTP-only |
| Ausencia de plaintext en superficies no explicitas | PASS | respuestas y logs |
| AAD/tamper/no-downgrade/legacy | PASS | `test:diccionario:secrets` |
| Contratos y documentacion owner | PASS | evidencia previa y control-plane check |
| `sst-bend npm.cmd run check` | PASS con cobertura general parcial esperada | exit `0`; no se suministro token al smoke general ajeno a SST-93 |
| `4uentes-orchestor npm.cmd run check` | PASS | 0 fallas; owner docs incluidos |
| Jira readback | PASS | `SST-93` sigue `Finalizada`, resolucion `Listo` |

La cobertura protegida parcial informada por el `check` general de `sst-bend`
no invalida este cierre: corresponde a endpoints generales de articulos,
scrapper y otras capacidades que no pertenecen a SST-93. El smoke dedicado de
Dictionary Secrets fue autenticado y completo para el alcance del ticket.

## Decision

Los criterios de aceptacion y el DoD de SST-93 quedan validados sobre la imagen
adoptada en desarrollo. Esto no implica release ni validacion de produccion.
