# CR-SST-0069 Gate 2 - preview read-only en frontend

Fecha: 2026-06-12

## Alcance

Se introdujo en `sst-fend` una adopcion read-only del preview del
`SST Tag Prefix Engine` publicado por `node-auth`.

Superficie de usuario:

- ficha de articulo (`ArticleDetailView`);
- accion bajo demanda `Previsualizar tags`;
- render separado de `tagValues`, `externalRefs`, `importedRefs` e `issues`.

## Cambios runtime

Archivos principales en `sst-fend`:

- `src/services/tagPrefixEngineService.ts`
- `src/services/types/tagPrefixEngine.ts`
- `src/services/constants/servicePaths.ts`
- `src/pages/Articles/components/ArticleDetailView/ArticleDetailView.tsx`
- `src/pages/Articles/components/ArticleDetailView/ArticleDetailView.i18n.ts`
- `src/pages/Articles/components/ArticleDetailView/styles.module.scss`
- `src/pages/Articles/components/ArticleDetailView/styles.module.scss.d.ts`

Decisiones:

- consumir `POST /api/tags/prefix-engine/preview` via BF;
- no llamar directo a `sst-bend`;
- construir `sourceText` desde titulo, descripcion, URL y tags actuales;
- renderizar `ImportedReference` como referencia importada, no como `TagValue`;
- tratar `issues` como resultado de preview;
- no persistir salida ni crear `TagDefinition`.

## Cambios ARDS/SDD

Archivos principales en `sst-fend`:

- `specs/capabilities/inbound/node-auth--tag-prefix-engine-preview.yaml`
- `docs/capabilities/inbound/node-auth--tag-prefix-engine-preview.md`
- `docs/tasks/2026-06-12-sst-fend-tag-prefix-engine-preview.md`
- `specs/capabilities/inbound/00-index.yaml`
- `docs/capabilities/00-overview.md`
- `specs/33-articles-frontend.yml`
- `docs/33-articles-frontend.md`

## Validacion tecnica

Comando:

```bash
npm run check
```

Resultado:

- `[ARDS CHECK] OK`
- build Webpack OK
- 24 suites OK
- 142 tests OK
- 22 warnings historicos de `react-hooks/exhaustive-deps`
- 0 errores

## QA runtime

Comprobacion HTTP del dev server:

```text
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
```

QA visual con Chrome DevTools MCP:

- Ejecutado con `mcp__chrome_devtools`.
- Pagina:
  `http://localhost:4090/artsst?page=1&mode=tree&node=34d86f32-6232-4442-96b2-e8420590cf2a&view=detail&detail=89aecc4e-222b-4c04-866e-f33e647647c5`.
- Articulo: `Modulo 3: backend de servicio sin servidor`.
- Resultado visible:
  - `2 BLOCKS`
  - `1 TAGS`
  - `1 EXTERNAL REFS`
  - `1 IMPORTED REFS`
  - `0 ISSUES`
  - `EXTERNAL REF` separado de `IMPORTED REF`
- Screenshot:
  `evidence/requests/CR-SST-0069/qa-visual-sst-fend-tag-prefix-preview.png`

Durante QA se detecto y corrigio un drift de prefijos: la UI generaba prefijos
de `learning-content` para `scope=articulos`. Se ajusto la generacion a los
prefijos registrados para articulos: `titulo`, `desc`, `tema`, `source` y
`diccionario-ref`.

## Decision de compuerta

Gate 2 aprobado.

La funcionalidad frontend esta compilada, testeada, documentada y validada con
QA visual en Chrome DevTools MCP.
