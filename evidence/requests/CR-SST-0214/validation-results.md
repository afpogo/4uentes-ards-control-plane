# CR-SST-0214 - Resultados de validación

Fecha: 2026-08-23.

## Resultado

El patch histórico `33a5dc8` fue adoptado sobre
`4uentes-auth/develop@89d0009` como `2700ba1`. Los cambios runtime del grant
son semánticamente iguales a la fuente; las diferencias de patch-id se deben
al contexto agregado previamente en `develop`.

Se resolvieron seis conflictos de integración conservando las capabilities y
tests actuales de retención de chat e introspección de sesiones. No hubo
conflictos en `.env.example`, `env.ts`, `service-credentials.ts` ni el
controller que emite el token.

| Gate | Resultado |
| --- | --- |
| `npm run check` en Auth | PASS: ARDS, build, password, sesiones, chat y grant Phinance |
| `npm run test:phinance-service-grant` | PASS: tuple exacto, RS256/JWKS, claims, TTL y negativos |
| GitHub `build-publish-update` | PASS, 1m17s |
| `git diff --check` | PASS |
| búsqueda de `CR-SST-0208` y conflict markers | sin coincidencias owner |
| `package-lock.json` | sin cambios |
| `npm run check` del control-plane | PASS, incluido owner-documentation |

`npm ci` reportó 20 vulnerabilidades ya presentes en el lockfile: 4 low,
3 moderate, 11 high y 2 critical. No se ejecutó `npm audit fix` porque esta
adopción prohíbe cambios de dependencias.
