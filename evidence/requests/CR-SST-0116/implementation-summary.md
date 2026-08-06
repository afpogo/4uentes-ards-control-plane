# CR-SST-0116 - Implementation Summary

Fecha: 2026-07-04

## Alcance Implementado

Se implemento persistencia runtime para selecciones anotadas aceptadas en
`sst-bend` y se ajusto `node-auth` para transportar payloads validos del
contrato `CR-SST-0115`.

## `sst-bend`

Cambios principales:

- nuevo dominio `learning-annotation.entity.js`;
- nuevo modelo `LearningAnnotationRef`;
- nueva migracion `20260704120000-create-learning-annotation-refs`;
- `POST /learning-workspaces/sources/preview` acepta `annotations[]`;
- preview persiste anotaciones en estado `previewed` sin exponerlas como
  contexto aceptado;
- `accept` soporta `annotationIds`;
- `reject` soporta `annotationIds`;
- `GET /context` expone solo anotaciones `accepted`;
- `scripts/test-learning-workspace.js` cubre flujo legacy y flujo anotado.

## `node-auth`

Cambios principales:

- `API_BODY_LIMIT` configurable con default `1mb`;
- `express.json` global usa ese limite para no rechazar `sourceText` valido de
  LearningWorkspace antes de llegar a SST;
- owner docs/specs documentan que el BFF preserva annotated selections sin
  reinterpretarlas.

## Fuera De Alcance

- UI rica final en `sst-fend`;
- busqueda SQL avanzada por tags/relevancia;
- e2e con JWT real via Chrome/HTTP;
- transicion Jira por MCP.
