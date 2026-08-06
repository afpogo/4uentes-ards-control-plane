# QA Autenticado CR-SST-0127

Fecha: 2026-07-11.

## Alcance

- Ruta de creacion: `/artsst`, modal New, tipo Text.
- Ruta de detalle: `/artsst?view=detail&detail=<id>`.
- Viewports: desktop `1440x900` y mobile emulado `390x844`.
- Articulo QA: `QA CR-SST-0127 Text Kind 2026-07-11`.

## Resultado

- La creacion respondio `201` con un articulo directo, no envelope.
- El request envio `payload.kind: text`; no envio URL artificial.
- La respuesta conservo `payload.kind: text` y el filtro persistido con
  `type: text`.
- El catalogo incremento de 44 a 45 y mostro el articulo nuevo.
- Detail y Edit identificaron el articulo como `Text`.
- Desktop no mostro overflow, solapamientos ni texto cortado atribuible al CR.
- Mobile no mostro overflow horizontal; el documento tuvo `scrollWidth` igual
  a `clientWidth` y ningun elemento offender.
- En mobile, `Catalog context` se ubico debajo del contenido principal.
- No aparecieron requests HTTP nuevas: create/list/detail/documents/agent-jobs
  conservaron las rutas existentes.
- Los warnings de consola observados son preexistentes: React Router future
  flag y deprecacion `findDOMNode` de componentes AntD/observer.

## Evidencia Visual

- `evidence/requests/CR-SST-0127/qa-desktop-1440x900.png`
- `evidence/requests/CR-SST-0127/qa-mobile-390x844.png`

## Limite De La Prueba

La instancia real devolvio `payload.kind`, por lo que el fallback cuando el BF
omite ese campo queda probado por los tests automatizados Text y Transcript.
No se registran headers, tokens, cookies, datos de cuenta ni credenciales.

## Gate De Cierre

El comportamiento objetivo pasa, pero `CR-SST-0127` permanece abierto porque
el check completo de `sst-fend` esta bloqueado por cuatro declarations CSS
Modules desactualizadas y la suite completa conserva una expectativa
preexistente `textSheet.selectionHint`. Esos defectos se separan en
`CR-SST-0136`; no forman parte de este patch.
