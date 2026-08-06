# CR-SST-0075 - Fix QA manual: creacion de tags y UI del selector

## Estado

- Fecha: 2026-06-23
- Repo objetivo: `sst-fend`
- Request: `CR-SST-0075`
- Jira: `SST-23`
- Motivo: durante la prueba manual del formulario de creacion de articulos se
  detecto que la creacion de tags fallaba y que el selector quedaba visualmente
  fuera del lenguaje de cartas/modal de SST.

## Causa funcional

- El frontend enviaba `scope` dentro del body de `POST /api/tags/values`.
- El BFF `node-auth` es passthrough para `/api/tags/values` y no transforma el
  body.
- El contrato SST de `POST /tags/values` acepta `definitionKey`, `label`,
  `slug` opcional, `resourceType` y `metadata`.
- Enviar `scope` en el body provoca rechazo del contrato aguas abajo.

## Correccion funcional

- Se removio `scope` del tipo `CreateTagValueRequest`.
- Se removio `scope` del payload enviado por `ArticleForm` al crear un tag.
- Se mantiene `resourceType=articulo`, `definitionKey=tema` y metadata de
  productor frontend.

## Correccion UI

- Se envolvio el selector gobernado en una superficie propia de carta.
- Se agregaron estilos locales para:
  - borde y foco del selector;
  - pastillas de tags;
  - dropdown;
  - label del campo.
- Se regeneraron las declaraciones de CSS Modules.

## Validacion

Comandos ejecutados:

```powershell
npm.cmd run css:types
npm.cmd run build
```

Resultado:

- `css:types`: PASS, actualizo `ArticleForm/styles.module.scss.d.ts`.
- `build`: PASS.
- Webpack mantiene 3 warnings de performance por tamano de bundle.

## Boundary

- No se modifico `sst-bend`.
- No se modifico `4uentes-auth`.
- No se modifico `sst-extension`.
- Se leyo `node-auth` solo para confirmar que `/api/tags/values` es passthrough.
