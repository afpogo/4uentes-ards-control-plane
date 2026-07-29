# CR-SST-0087 - Estado Actual De Tags Governance

## Lectura

El bloque `SST-4` de tags governance quedo cerrado para los scopes activos de
esta etapa:

- `articulos`
- `diccionario`

La continuidad viva queda fuera de ese cierre:

- `learning-content`
- `bitacora`

## Estado Por Track

| Track | Estado local | Jira mirror | Nota |
| --- | --- | --- | --- |
| `sst-tags-governance` | `implemented-local` | `SST-4` cerrado | Mantiene gaps abiertos para scopes futuros. |
| `dictionary-tags` | `validated-live` | `SST-10` cerrado | Validado antes y preservado durante CR-SST-0076. |
| `sst-tag-prefix-engine` | `validated-live` | relacionado a `SST-4`/runtime | Preview validado; persisted import queda futuro. |
| `learning-content-tags` | `implemented-local` | `SST-6` en curso | Siguiente track activo. |

## Siguiente Avance Recomendado

Abrir un CR dedicado para `learning-content-tags` antes de tocar repos hijos.
El primer corte deberia decidir:

- si el parser POC pasa a endpoint runtime import/preview;
- que `resourceType` y `sourceType` usara learning-content;
- que bloques frontend se renderizan primero;
- como se excluyen artefactos generados de lab por defecto.
