# CR-SST-0230: publicación y readback owner de Auth

Fecha: 2026-08-29  
Owner: `4uentes-auth`  
Resultado: `merged-and-read-back`

## Alcance y autorización

La autorización publicada de `CR-SST-0230` permitió modificar Auth en un
worktree aislado después del merge y readback de Bend, actualizar sus
superficies ARDS/SDD y publicar su PR owner. Jira, deployment deliberado,
GitOps directo, cluster y producción permanecieron excluidos.

## Publicación owner

- branch: `feat/CR-SST-0230/chat-cache-outcome-forwarder`;
- commit owner: `443aa7732403fe8c4ef386fdee93c4a7de39d11f`;
- PR owner: `afpogo/4uentes-auth#14`;
- merge owner: `13ebe6ffd57b909a01dceaf78e8d42698094f6a8`;
- branch canónica: `develop`;
- readback: el commit candidato es ancestro de `origin/develop` y el código y
  las superficies owner publicadas contienen el contrato exacto
  `X-SST-Chat-History-Cache: hit|miss|bypass`.

## Resultado funcional

Auth republica el header únicamente para `GET` history con respuesta upstream
`200` y sólo cuando existe exactamente un valor string `hit`, `miss` o
`bypass`. Descarta ausencia, repetición, combinación, whitespace, casing
distinto, valores desconocidos, errores del getter y metadata cache/Redis no
allowlisted. Las demás rutas y respuestas de error no lo exponen. Body y status
permanecen sin cambios y no se añadió estado global mutable.

## Documentación owner

El commit actualizó las diez superficies requeridas por el lifecycle:

- `specs/integrations-api.yaml`;
- `specs/routing.yaml`;
- `specs/capabilities/inbound/sst-bend--chat-retention-v1.yaml`;
- `specs/capabilities/outbound/chat-retention-v1.yaml`;
- `docs/bf/03-routing.md`;
- `docs/bf/06-integrations-api.md`;
- `docs/chat-sessions.md`;
- `docs/capabilities/inbound/sst-bend--chat-retention-v1.md`;
- `docs/capabilities/outbound/chat-retention-v1.md`;
- `httpPruebas/sst_server.http`.

También quedaron alineados el runtime, las pruebas focalizadas y la nota de
ejecución owner.

## Validaciones

- tests focalizados de allowlist, errores, rutas, status y concurrencia: PASS;
- `git diff --check`: PASS;
- parseo YAML focalizado: PASS;
- `4uentes-auth npm run check`: PASS completo;
- check `build-publish-update` del PR, con imagen sin push: PASS;
- workflow postmerge de Auth, incluido el check owner previo al build: PASS;
- `4uentes-orchestor npm run check` posterior a la mutación owner: PASS,
  incluido `scripts/verify-owner-documentation.js`.

La instalación aislada informó vulnerabilidades de dependencias ya presentes
en el lockfile (4 low, 3 moderate, 11 high y 2 critical). No se ejecutó
`audit fix` ni se modificaron manifests porque esa remediación queda fuera del
alcance de este gate.

## Efecto automático posterior al merge

El merge realizado por el usuario disparó el workflow preexistente de push a
`develop`, run `33234116482`. Aunque el agente no inició una acción directa de
deployment, el workflow:

- publicó la imagen development `develop-13ebe6ffd57b`;
- creó en `sst-4uentes-infra` el commit
  `ad777153a38851a13f41a5ea7794961facfbc88f`;
- actualizó el tag de la imagen `4uentes-auth` en el overlay development;
- completó los checks de Auth e Infra con éxito.

El run `33234174073`, denominado `CD Pipeline`, tuvo un único job de validación
que configuró `kubectl` y renderizó el overlay development. Sus pasos no
incluyeron `kubectl apply`. No se consultó el cluster ni se verificó una
reconciliación GitOps externa porque ambas acciones quedan fuera del gate
autorizado. Esta consecuencia automática se registra como desviación de orden
y no como autorización retroactiva de deployment.

## Estado restante

Los owners Bend y Auth están publicados, leídos desde sus ramas canónicas y
validados. `CR-SST-0230` continúa `running`: el próximo átomo es la QA integrada
miss-hit, invalidación por contratos de producto, miss-hit y cleanup. Esa QA
requiere un gate runtime separado y evidencia sanitizada; no habilita comandos
Redis directos ni deployment, cluster o producción por inferencia.

Jira no fue creado, editado, comentado ni transicionado durante este gate. El
mirror continúa pendiente de autorización explícita.
