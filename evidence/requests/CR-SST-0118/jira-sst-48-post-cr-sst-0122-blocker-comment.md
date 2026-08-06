# SST-48 / CR-SST-0118 - Revalidacion posterior a CR-SST-0122

Se reejecuto la validacion en `/learning` despues de cerrar `CR-SST-0122 / SST-51`.

Resultado:

- El bug backend de `accept(annotationIds)` por comparacion hash-vs-UUID ya no se reproduce.
- En Chrome, `/learning` muestra la hoja, genera preview y permite aceptar.
- Red:
  - `POST /api/learning-workspaces/sources/preview`: 200.
  - `POST /api/learning-workspaces/sources/{previewId}/accept`: 201.
  - `GET /api/learning-workspaces/context`: 200.
- Consola: sin errores JavaScript relevantes.

Bloqueo residual:

- El contexto aceptado visible queda con `annotations: []` y `contentBlocks: []`.
- Esto no cumple todavia el E2E de SST-48, porque la intencion requiere validar contenido anotado aceptado y render/template con bloques/anotaciones.

Decision:

- No mover `SST-48` a `Listo`.
- Mantener `SST-48` En curso.
- Crear follow-up para corregir payload/render frontend si se confirma que la UI no envia o no consume las anotaciones esperadas.

Evidencia ARDS/SDD:

- `evidence/requests/CR-SST-0118/e2e-revalidation-after-cr-sst-0122-2026-07-05.md`
- `evidence/requests/CR-SST-0118/chrome-learning-after-cr-sst-0122-2026-07-05.png`
