# Resumen de archivos modificados

## Alcance

`CR-HPT-0006` registra y planifica una capacidad futura de recepción asistida de
documentos financieros. No autoriza implementación, modificación del ARDS/SDD
propietario ni cambios en repositorios hijos.

## Archivos del control plane

- `initiatives/INIT-HPT-0003-financial-document-intake-and-assisted-accounting.yaml`
  crea la iniciativa separada para esta hipótesis.
- `initiatives/00-index.yaml` incorpora la iniciativa al índice.
- `requests/inbox/CR-HPT-0006-define-governed-financial-document-intake.yaml`
  conserva la intención recibida.
- `requests/planned/CR-HPT-0006-define-governed-financial-document-intake.yaml`
  define límites, invariantes y futuros change requests candidatos.
- `evidence/initiatives/INIT-HPT-0003/source-intent-review.md` registra la
  necesidad de negocio y su estado previo a la API.
- `evidence/requests/CR-HPT-0006/initiative-boundary-summary.md` documenta la
  separación respecto de la iniciativa de recursos económicos personales.
- `evidence/requests/CR-HPT-0006/changed-files-summary.md` resume el cambio.
- `evidence/requests/CR-HPT-0006/validation-results.md` registra la validación.

## Repositorios no modificados

- No se modificó el repositorio propietario de finanzas personales.
- No se creó ni levantó una API.
- No se eligió proveedor de OCR, almacenamiento, modelo de IA o infraestructura.
- No se modificó SST ni ningún repositorio funcional.
