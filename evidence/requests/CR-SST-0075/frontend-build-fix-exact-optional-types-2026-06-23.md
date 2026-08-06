# CR-SST-0075 - Fix build frontend por exactOptionalPropertyTypes

## Estado

- Fecha: 2026-06-23
- Repo objetivo: `sst-fend`
- Request: `CR-SST-0075`
- Jira: `SST-23`
- Motivo: la UI de articulos no compilaba al abrir el flujo manual por errores
  TypeScript en el selector gobernado de tags.

## Error observado

- `articles.mappers.ts` fallaba al mapear tags del articulo a
  `ArticleFormTagValue[]`.
- `ArticleForm/index.tsx` fallaba al crear opciones y valores seleccionados para
  el selector gobernado.
- La causa fue `exactOptionalPropertyTypes: true`: los objetos estaban
  declarando propiedades opcionales con valor `undefined` explicito.

## Correccion aplicada

- En `ArticleForm/index.tsx` se agrego un helper local para construir
  `ArticleFormTagValue` omitiendo `id`, `slug`, `value` y `metadata` cuando no
  existen.
- En `ArticleForm/index.tsx` se reemplazo `filter(Boolean)` por un type guard
  explicito para `GovernedTagOption`.
- En `articles.mappers.ts` se agrego un helper equivalente para hidratar los
  defaults del formulario desde `IArticleTag` sin serializar opcionales como
  `undefined`.

## Validacion

Comando ejecutado:

```powershell
npm.cmd run build
```

Resultado:

- `sst-fend` build: PASS
- Webpack compilo con 3 warnings de performance por tamano de bundle.
- No quedaron errores TypeScript en `ArticleForm` ni `articles.mappers`.

## Boundary

- No se modifico `sst-bend`.
- No se modifico `4uentes-auth`.
- No se modifico `sst-extension`.
- El cambio se mantiene dentro del scope `sst-fend` aprobado por `CR-SST-0075`.
