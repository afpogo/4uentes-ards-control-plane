CR-SST-0100 / SST-32 - QA manual gap registrado

Se confirma QA manual de captura de sesion: la sesion se crea en SST y los articulos derivados pueden quedar persistidos con PDFs textuales validos cuando la captura visual no esta disponible.

Gap registrado: esos articulos de tipo texto pueden mostrarse sin `preview image` en SST, porque el PDF textual conserva contenido textual pero no una imagen visual confiable de la web.

Decision ARDS/SDD:
- `SST-32` mantiene el alcance de visibilidad UI de calidad de captura y warnings por pestania.
- `CR-SST-0119` queda reservado para parametrizar modo de captura: auto, solo visual, solo texto, preferir texto.
- `CR-SST-0120` queda reservado para definir contrato cross-repo de `preview image` en articulos derivados de sesion: thumbnail visual, derivacion downstream o razon explicita `preview unavailable`.

Evidencia local actualizada:
- `evidence/requests/CR-SST-0100/manual-qa-gap-analysis.md`
- `evidence/requests/CR-SST-0100/implementation-summary.md`
- `evidence/requests/CR-SST-0100/owner-documentation-enforcement.md`
- `evidence/requests/CR-SST-0100/validation-results.md`

Control-plane enforcement ejecutado: `npm run check` OK.
