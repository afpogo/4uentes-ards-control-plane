# CR-SST-0178 - Worktrees Y Bases

## Resultado

Se crearon worktrees nuevas dentro del control-plane. Ningun checkout principal
con cambios ajenos fue editado o limpiado.

| Repo | Base refrescada | Worktree | Estado inicial |
| --- | --- | --- | --- |
| `sst-chatbot` | `origin/develop` `c7ccb55` | `worktrees/CR-SST-0178-chatbot` | limpio |
| `sst-bend` | `origin/develop` `131c28c` | `worktrees/CR-SST-0178-bend` | limpio |
| `sst-4uentes-infra` | `origin/develop` `11540e9` | `worktrees/CR-SST-0178-infra` | limpio |
| `4uentes-auth` | `origin/develop` `88ba82d` | `worktrees/CR-SST-0178-auth` | limpio |

Las tres ramas usan
`feat/CR-SST-0178/sst-chatbot-development-cluster` en su propio repo.

El remoto SSH de infra rechazo el primer fetch por clave. Se verifico el SHA
remoto por HTTPS, se actualizo `origin/develop` de `9f8b4df` a `11540e9` y se
adelanto la rama nueva con fast-forward antes de editar.

`sst-bend` ya soporta `CHATBOT_BASE_URL`, audience y token provider por entorno;
por eso su worktree permanece sin cambios.

## Reconciliacion De Auth Aprobada

`4uentes-auth/origin/develop` se refresco y quedo observado en `88ba82d`. Esa
revision no contiene `client_credentials`, introspeccion ni identidades M2M.
Con la ampliacion de scope aprobada se reconciliaron sobre la worktree nueva
solamente `b9e82b2`, `0177398` y `36bd353`. Se excluyo `dfe576f` porque solo
modificaba README y no pertenecia al runtime. Los conflictos conservaron
`SESSION_IDLE_TTL`, scrapper, body limits y docs actuales de `develop`.

Validacion de la rama reconciliada:

- `npm run check`: PASS;
- `npm run test:chat-sessions`: PASS;
- `npm run test:chat-proxy`: PASS;
- imagen local `ghcr.io/afpogo/4uentes-auth:cr-sst-0178`: build PASS.
