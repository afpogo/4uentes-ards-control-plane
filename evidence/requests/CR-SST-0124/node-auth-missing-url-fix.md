# CR-SST-0124 - Node Auth Missing URL Fix

## Estado

- Fecha: 2026-07-07
- Repo: `4uentes-auth` (`node-auth` alias local)
- Jira mirror: `SST-53`
- Resultado: fix BFF implementado y validado localmente

## Problema

QA autenticado confirmo que `sst-fend` enviaba el shape correcto para articulos
`text` nativos:

- `payload.kind=text`
- `payload.data={}`
- sin `url` falsa
- sin `sourceUrl` falsa

`node-auth` rechazaba ese body antes de llegar a `sst-bend` con:

```text
400 {"error":"Missing url"}
```

## Cambio Runtime

Archivos actualizados en `node-auth`:

- `src/domain/dtos/articulo/articulo.dto.ts`
- `src/presentation/articulo/controller.ts`
- `src/domain/entities/articulo/index.ts`
- `src/domain/constants/articulo.constants.ts`
- `src/infrastructure/mapperers/articulo.mapper.ts`

Comportamiento alineado:

- `payload.kind=text` acepta `payload.data={}` sin `url/sourceUrl`.
- `payload.kind=text` sigue validando formato cuando recibe `url/sourceUrl`.
- Requests `web` o sin `payload` siguen fallando con `Missing url` si no traen
  `url/sourceUrl`.
- El body de create/idempotencia omite `url` cuando esta ausente.
- El mapper de respuesta acepta articulos `text` sin URL persistida.

## Owner ARDS/SDD

Archivos owner actualizados en `node-auth`:

- `docs/bf/03-routing.md`
- `specs/routing.yaml`
- `specs/integrations-api.yaml`
- `docs/capabilities/inbound/sst-bend--article-text-ingestion.md`
- `specs/capabilities/inbound/sst-bend--article-text-ingestion.yaml`
- `docs/capabilities/outbound/article-text-ingestion.md`
- `specs/capabilities/outbound/article-text-ingestion.yaml`

El handoff ahora explicita que `/api/articles` y `/api/articulos` son
equivalentes para SPA, que texto nativo no requiere `url/sourceUrl`, y que
`/api/extension/text-articles` sigue reservado para extension con PDF/snapshot
y URL.

## Validacion

```text
npm.cmd run build
```

Resultado: PASS.

Validacion puntual sobre JS compilado:

```text
ArticuloDTO.create: text without url => PASS
ArticuloDTO.create: text with valid sourceUrl => PASS
ArticuloDTO.create: text with invalid sourceUrl => FAIL esperado
ArticuloDTO.create: web without url => FAIL esperado
ArticuloDTO.create: web with url => PASS
ArticuloMapper.articuloEntityFromObject: text response without url => PASS
```

```text
npm.cmd run check
```

Resultado: PASS (`[ARDS CHECK] OK`).

## SST Bend Inspection

No se muto `sst-bend`.

Inspeccion puntual:

- `src/apps/sst/presentation/schemas/articulo.dto.js` deriva
  `sourceKind = value.payload?.kind || "web"`.
- El schema exige `url/sourceUrl` solo cuando `sourceKind === "web"`.
- `payload.kind=text` esta permitido por el schema y `payload.data` es required
  pero acepta objeto vacio.
- `src/apps/sst/domain/articulos/article-payload.factory.js` solo exige
  `payload.data.url` para `web`; para `text`, `payload.data.sourceUrl` es
  opcional y, si existe, debe ser string.

Conclusion: el blocker observado estaba en `node-auth`; no se requirio cambio
runtime en `sst-bend`.

## Pendiente

Final authenticated Chrome DevTools QA remains pending:

- abrir `/artsst` autenticado;
- crear articulo `Text` sin `Source reference`;
- confirmar `POST /api/articulos` retorna `201`;
- confirmar que no persiste URL falsa ni `payload.data.sourceUrl`;
- abrir runtime URL `/leafArticulo/:id`;
- confirmar que no dispara scraping ni LearningWorkspace automaticamente.
