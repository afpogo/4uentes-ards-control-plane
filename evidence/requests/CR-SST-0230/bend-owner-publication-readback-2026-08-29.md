# CR-SST-0230: publicación y readback owner de Bend

Fecha: 2026-08-29  
Owner: `sst-bend`  
Resultado: `merged-and-read-back`

## Alcance y autorización

La autorización publicada de `CR-SST-0230` permitió modificar y publicar
primero Bend en un worktree aislado, actualizar su documentación ARDS/SDD y
avanzar Auth únicamente después del merge y readback de Bend. Jira, deployment
deliberado, GitOps directo, cluster y producción permanecieron excluidos.

## Publicación owner

- branch: `feat/CR-SST-0230/chat-cache-outcome`;
- commit owner: `330cf6f30e42fc54bb14815a7d15743c57e7e127`;
- PR owner: `afpogo/sst-bend#29`;
- merge owner: `3751d383451b790569fbbfa6421ff00eda5105eb`;
- branch canónica: `develop`;
- readback: el commit candidato es ancestro de `origin/develop` y las
  superficies owner publicadas contienen el contrato exacto
  `X-SST-Chat-History-Cache: hit|miss|bypass`.

## Resultado funcional

Bend calcula el resultado por request para las dos particiones del historial.
La precedencia combinada es `bypass > miss > hit`. El header aparece solamente
en respuestas `200`; body y status no cambian. PostgreSQL conserva autoridad y
Redis continúa fail-open. No se añadió estado global, contenido sensible,
detalle de infraestructura ni endpoint administrativo.

## Documentación owner

El commit actualizó las seis superficies requeridas por el lifecycle:

- `specs/api/chat-retention-v1.yaml`;
- `specs/capabilities/outbound/chat-retention-v1.yaml`;
- `docs/api/chat-retention.md`;
- `docs/capabilities/outbound/chat-retention-v1.md`;
- `docs/tasks/TODO-cr-sst-0230-chat-cache-qa.md`;
- `httpPruebas/sst.chat.http`.

También quedaron alineados runtime y pruebas focalizadas.

## Validaciones

- tests focalizados de cache, HTTP, degradación, precedencia y concurrencia:
  PASS;
- `git diff --check`: PASS;
- parseo YAML focalizado: PASS;
- CI owner Node 18 y Node 20: PASS;
- build de imagen del PR sin publicación: PASS;
- `sst-bend npm run check`: PASS completo el 2026-08-29, después de que el
  preflight local de SST volvió a responder `200`;
- `4uentes-orchestor npm run check` previo a la publicación owner: PASS,
  incluido `scripts/verify-owner-documentation.js`.

El check owner reportó skips explícitos para smokes protegidos sin
`SMOKE_JWT`; el comando concluyó `[ARDS CHECK] OK` con exit code `0`.

## Efecto automático posterior al merge

El merge realizado por el usuario disparó el workflow preexistente de push a
`develop`. Aunque no se ejecutó una acción directa de deployment desde este
flujo, el workflow:

- publicó la imagen development `develop-3751d383451b`;
- creó en `sst-4uentes-infra` el commit
  `1e229dd51df0e713ed5e5d98d7dd5fc47d2d4645`;
- actualizó el tag de la imagen Bend en el overlay development;
- completó los checks de Infra con éxito.

El job denominado `CD Pipeline` observado en Infra renderizó y validó el
desired state. Sus pasos no incluyeron `kubectl apply`. No se consultó el
cluster ni se verificó una reconciliación GitOps externa porque ambas acciones
quedan fuera del gate autorizado. Esta consecuencia automática se registra
como desviación de orden y no como autorización retroactiva de deployment.

## Estado restante

El gate Bend está publicado y validado. `CR-SST-0230` continúa `running` para
implementar y publicar el forwarder estricto en `4uentes-auth`. Su PR podrá
prepararse bajo la autorización vigente, pero su merge volvería a disparar la
publicación automática development y la actualización de Infra; ese efecto no
debe consumirse sin una autorización posterior o sin desacoplar el workflow.

Jira no fue creado, editado, comentado ni transicionado. `SST-117` continuó
observado en estado `En curso`, sin resolución, y no existe un issue exacto
para `CR-SST-0230`.
