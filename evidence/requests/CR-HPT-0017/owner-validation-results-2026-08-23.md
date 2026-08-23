# CR-HPT-0017 - Resultados De Validación Owner

Fecha: 2026-08-23.

## Resultado

El verificador y el adapter de principal se implementaron sobre
`finanzas-personales@9f781e7` en el commit `9f50d13`. La implementación rechaza
algoritmos, claims, caller, audience, issuer, token use, scope, TTL, contexto y
entitlements fuera del contrato antes de resolver datos financieros.

| Validación | Resultado |
| --- | --- |
| `python -m pytest -p no:cacheprovider` | PASS: 36; 4 integraciones PostgreSQL omitidas porque el slice no modifica persistencia |
| `python -m pip check` | PASS: dependencias consistentes |
| PyJWT instalado | `2.13.0`, compatible con Python `3.13.13` |
| `node backend/scripts/check-contracts.js` | PASS: vínculos y garantías de runtime presentes |
| `git diff --check` | PASS |
| `npm run check` del control plane | PASS, incluida documentación owner |

La cobertura nueva prueba el token exacto, los ocho claims obligatorios, el
allowlist RS256, el TTL máximo, el rechazo de contexto sin bearer, entitlements
desconocidos o duplicados y envelopes incompletos o sobreacotados.

No se modificaron base de datos, SST, Auth, infraestructura, secretos ni Jira.
La raíz owner dirty permaneció intacta.
