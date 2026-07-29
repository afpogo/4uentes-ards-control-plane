# CR-SST-0115 - Resumen De Intencion

## Objetivo

Definir el contrato BFF/API para transportar selecciones anotadas desde
`sst-fend` hacia `node-auth` y `sst-bend`.

## Campos Minimos

- `sourceRef`
- `sourceText`
- `selector`
- `selectionRange`
- `contentTags`
- `relevance`
- `acceptanceState`
- `originArticleId`

## Resultado Esperado

Contrato listo para implementar persistencia y lectura sin romper el limite
BFF.
