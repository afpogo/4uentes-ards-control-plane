# Checkpoint de matriz integrada de CR-SST-0207

## Resultado

CR-SST-0207 avanzo sobre el runtime development recuperado, pero permanece
`running`. La matriz localhost probo los contratos principales y detecto dos
gaps funcionales/operativos; la superficie ngrok reservada continua bloqueada
por autenticacion externa previa a la aplicacion.

El control plane canonico usado fue `origin/main` en `ae56c5e`, que contiene
el merge del PR #117 en `88272f7d10b5d61b80596abd94b001a705f08d29` y el
cierre posterior de CR-SST-0194 por el PR #116.
Antes de publicar este checkpoint, la rama se reconcilio sobre `origin/main`
en `750a616`; el PR #118 agregado en ese avance solo registra el preflight de
retiro de worktrees de CR-SST-0208 y no cambia los resultados de QA.

## Matriz localhost

| Fila | Resultado | Evidencia sanitizada |
| --- | --- | --- |
| Fachada Auth | PASS | Sin bearer, `/api/chat/conversations` respondio 401; las operaciones autenticadas usaron exclusivamente `/api/chat/*`. |
| Temporal multi-sesion | PASS parcial | Dos sesiones activas del mismo principal vieron la conversacion; la segunda recupero los eventos `chat:message:accepted` y `chat:assistant:completed`. Logout explicito no se uso en el harness HTTP. |
| TTL temporal | PASS | Luego de 120 segundos mas 8 segundos de gracia, historial y listado dejaron de recuperar la conversacion. |
| Guardado durable | PASS parcial | Promocion idempotente y lectura desde una sesion futura pasaron; la eviction Redis no se ejecuto. |
| Cache-aside | BLOCKED | No existe contrato de producto para provocar eviction; mutar Redis directamente esta prohibido. |
| Limpiar local | PASS | La vista local se vacio, la conversacion guardada permanecio listable y su turno se recupero al seleccionarla. |
| Finalizar temporal | FAIL parcial | El estado volatil dejo de ser legible por HTTP, pero ninguna de las dos sesiones activas recibio un evento `finish`, `delete` o `terminal`. |
| Eliminar de SST | PASS | DELETE devolvio 204; tres sesiones obtuvieron 404 luego del borrado y el listado no resucito la conversacion. |
| Aislamiento cross-principal | PASS | Listado no enumero el recurso ajeno y read/save/finish/delete devolvieron 404 al segundo principal. |

Los harnesses reproducibles son:

- `scripts/qa-cr-sst-0207-http.js`;
- `scripts/qa-cr-sst-0207-realtime.js`;
- `scripts/qa-cr-sst-0207-browser.js`.

El harness realtime resuelve `socket.io-client` desde el checkout owner de
Fend mediante `NODE_PATH` o `QA_SOCKET_IO_CLIENT`. El browser usa Chrome del
sistema y `playwright-core`; para esta ejecucion se instalo con
`npm install --no-save --package-lock=false playwright-core` y el
`node_modules` temporal se elimino despues de inspeccionar las capturas.

No imprimen passwords, bearer tokens, cookies, payloads de mensajes ni URLs
privadas.

## Evidencia visual

Las capturas fueron inspeccionadas y no contienen mensajes, tokens, cookies,
emails ni credenciales:

- `localhost-retention-consent.png`: estado temporal, consentimiento y acciones
  diferenciadas;
- `localhost-clear-local-saved-list.png`: vista local vacia y referencia
  guardada disponible;
- `localhost-saved-delete-confirmed.png`: confirmacion del borrado durable y
  nueva vista temporal vacia.

## Edge reservado

El agente ngrok expone un unico tunnel HTTPS reservado. La misma matriz se
detuvo antes de crear identidad: `POST /api/auth/register` devolvio 302 por el
control de acceso externo. No se persistio la URL privada ni se intento eludir
la autenticacion. La superficie no puede declararse PASS hasta contar con un
mecanismo de QA autorizado para ese gate.

## Cleanup y residuos

Los recursos creados por las ejecuciones exitosas se finalizaron o eliminaron
mediante `/api/chat` en el bloque `finally`. Dos intentos abortados despues de
promocion perdieron sus credenciales aleatorias antes de poder ejecutar el
delete por contrato.

Un readback PostgreSQL exclusivamente de conteo, sin leer emails, IDs ni
contenido, encontro:

- 8 identidades sinteticas `retention.*@example.invalid`;
- 2 conversaciones sinteticas guardadas residuales;
- ningun mensaje, token, cookie, Secret o credencial fue leido o persistido.

No se ejecuto DELETE SQL ni mutacion Redis. La limpieza de esos residuos exige
un contrato de producto o una autorizacion/lifecycle de remediacion separado.

## Decision de checkpoint

No corresponde cerrar CR-SST-0207 ni SST-117. Los siguientes gates requieren
separacion explicita:

1. owner Bend: emitir y documentar un evento terminal a todas las sesiones
   activas al finalizar/eliminar;
2. QA/cache: definir un mecanismo product-safe para observar miss/hit y provocar
   una eviction acotada sin acceso directo al backing store;
3. Infra/edge: habilitar una estrategia autorizada de acceso QA al ngrok
   reservado;
4. cleanup: disponer de una ruta de producto para identidades y conversaciones
   sinteticas inaccesibles.

No hubo escritura Jira, mutacion de repos hijos, despliegue, sync manual,
cambio de flag, produccion ni acceso a datos reales.
