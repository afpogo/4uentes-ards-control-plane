CR-SST-0100 / SST-32 - cierre operativo

Resultado:

- Implementacion completada en `sst-extension`.
- La lista de sesiones muestra calidad de captura agregada: PDF visual, PDF textual fallback y tabs con warnings.
- La UI muestra degradaciones por pestania desde metadata sanitizada, sin exponer contenido privado.
- Acciones existentes preservadas: retry, restore/open origin y delete.
- Owner documentation policy satisfecha.

Validacion:

- `sst-extension` tests/check: PASS.
- `4uentes-orchestor npm run check`: PASS.
- QA manual del usuario: captura de sesion ejecutada, sesion creada en SST y articulos/PDFs generados.

Gaps separados fuera de este cierre:

- `CR-SST-0119` / `SST-49`: parametrizacion de modo de captura.
- `CR-SST-0120` / `SST-50`: contrato de `preview image` para articulos derivados de sesion, incluyendo PDFs textuales sin preview visual.

Boundary:

- Jira es mirror operativo; ARDS/SDD permanece como fuente de verdad.
- No se incluyeron contenido privado, raw PDFs, thumbnails privados, cookies, JWTs ni secretos en evidencia.
