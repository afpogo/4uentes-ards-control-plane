CR-SST-0124 / SST-53 cierre validado.

Validacion manual autenticada confirmada por owner:

- Se pudo crear un articulo de tipo texto sin URL/source reference.
- El bloqueo `400 {"error":"Missing url"}` quedo resuelto en `node-auth`.
- El flujo conserva la regla esperada: textos nativos pueden omitir `url/sourceUrl`; articulos web siguen requiriendo URL.

Validacion tecnica registrada:

- `node-auth npm.cmd run build`: PASS.
- `node-auth npm.cmd run check`: PASS.
- Validacion puntual DTO/mapper:
  - `payload.kind=text`, `payload.data={}`, sin URL: PASS.
  - `payload.kind=text` con URL valida: PASS.
  - `payload.kind=text` con URL invalida: FAIL esperado.
  - `web` sin URL: FAIL esperado.
  - `web` con URL valida: PASS.
- `4uentes-orchestor npm.cmd run check`: PASS.

Evidencia control-plane:

- `evidence/requests/CR-SST-0124/node-auth-missing-url-fix.md`
- `evidence/requests/CR-SST-0124/validation-results.md`
- `evidence/requests/CR-SST-0124/changed-files-summary.md`
- `evidence/requests/CR-SST-0124/owner-documentation-summary.md`

Decision: transicionar `SST-53` a `Listo`.
