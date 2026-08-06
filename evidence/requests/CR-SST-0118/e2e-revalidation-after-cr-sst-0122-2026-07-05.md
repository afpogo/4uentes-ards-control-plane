# CR-SST-0118 - Revalidacion E2E posterior a CR-SST-0122

## Estado

- Fecha: 2026-07-05
- Jira mirror: `SST-48`
- Fix previo aplicado: `CR-SST-0122 / SST-51`
- Resultado: parcialmente desbloqueado, no cerrar.

## Resultado visible

Chrome DevTools MCP pudo abrir `http://localhost:4090/learning` con sesion activa.

La pantalla muestra:

- `Learning Sheet`
- editor de hoja
- controles de relevancia/granularidad
- boton `Generar preview`
- botones `Aceptar` y `Rechazar`
- paneles `Preview`, `Warnings`, `Template renderizado` y `Contexto aceptado`

Evidencia visual:

- `evidence/requests/CR-SST-0118/chrome-learning-after-cr-sst-0122-2026-07-05.png`

## Flujo ejecutado

1. Abrir `/learning`.
2. Generar preview desde la hoja local default.
3. Aceptar preview.
4. Observar template/contexto aceptado.
5. Revisar requests de red y consola.

## Red

Requests relevantes observados:

- `POST /api/learning-workspaces/sources/preview`: success 200.
- `POST /api/learning-workspaces/sources/{previewId}/accept`: success 201.
- `GET /api/learning-workspaces/context`: success 200.

El fallo 500 por UUID/hash detectado antes de `CR-SST-0122` ya no aparece en este flujo.

## Consola

No se observaron errores JavaScript. Solo logs de HMR/i18n y warning conocido de React Router future flag.

## Bloqueo residual

Aunque el flujo visual acepta el preview, el contexto renderizado en pantalla queda sin contenido anotado:

- `annotations: []`
- `contentBlocks: []`

Esto no cumple todavia la intencion de `CR-SST-0118`, que requiere validar editor/text entry, tagging/relevance, preview, accept, persistence, render/template y read/query con contenido anotado aceptado.

## Decision

- No transicionar `SST-48` a `Listo`.
- Mantener `CR-SST-0118 / SST-48` en curso.
- Abrir un follow-up para corregir la integracion frontend payload/render si se confirma que la UI no envia o no consume las anotaciones esperadas.
- Mantener `CR-SST-0122 / SST-51` cerrado: el bug backend de UUID/hash quedo resuelto.
