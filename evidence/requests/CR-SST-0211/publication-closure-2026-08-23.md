# Publicacion y cierre CR-SST-0211

## Publicacion owner

- Repositorio: `afpogo/4uentes-auth`.
- Branch: `feat/CR-SST-0211/chat-retention-facade`.
- Base limpia: `origin/develop@ca5365ad1e70ace512c261d8ccdb0a7dca8b4387`.
- Head publicado: `d1237278e9dfcb8b12b9fbda7abeed4eaee89795`.
- Pull request: [afpogo/4uentes-auth#11](https://github.com/afpogo/4uentes-auth/pull/11), base `develop`, un commit y 16 archivos.
- Check remoto `build-publish-update`: PASS.
- Merge commit: `89d00099657e0e009670eb3dcf4a36b3c76fea6b` en `develop`.
- Readback: el head publicado es ancestro de `origin/develop` en el merge indicado.

## Resultado owner

El facade `/api/chat` publica las seis operaciones de `chat-retention-v1`:
list, create temporal, history, save explicito, finish temporal y delete saved.
Todas validan JWT antes de invocar SST. UUID, query e idempotencia invalidos se
rechazan localmente; solamente se reenvian los headers permitidos. Los status
upstream 403, 404 y 409 mantienen su significado, mientras timeout y red sin
respuesta se publican como 504 y 502 sanitizados.

`sst-bend` conserva autoridad sobre ownership, consentimiento, estados,
contenido y persistencia. Auth no almacena mensajes ni retencion en Mongo y no
interpreta create o actividad como consentimiento durable.

## Validacion

- `npm run check` en el worktree limpio de `4uentes-auth`: PASS.
- ARDS owner, TypeScript, password adoption y session-family: PASS.
- Chat sessions, base URL y matriz completa del facade: PASS.
- `git diff --check`: PASS.
- `npm run check` en el worktree aislado del control plane: PASS, 0 FAIL.
- Evidencia: metadata sintetica; sin tokens, cookies, mensajes o credenciales.

## Limites del cierre

No se escribio Jira ni se modificaron Fend, Bend, deployment o produccion. El
cierre publica el handoff esperado por `CR-SST-0206`, pero no autoriza su
ejecucion. Socket.IO y los feature flags permanecen fuera de este slice.
