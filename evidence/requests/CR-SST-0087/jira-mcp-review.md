# CR-SST-0087 - Revision Jira/MCP Para Tags Governance

## Estado

- Fecha: 2026-06-28
- Request: `CR-SST-0087`
- Initiative: `INIT-SST-0001`
- Proyecto Jira esperado: `SST`
- Escritura Jira: no

## Intento MCP

Se intento consultar Atlassian MCP con busqueda read-only para tickets de tags:

```text
SST tags governance dictionary-tags learning-content-tags sst-tag-prefix-engine SST-4 SST-6 SST-21 SST-22 SST-24
```

Resultado:

```text
403 - The app is not installed on this instance
```

El bloqueo impide confirmar el estado live actual desde Jira en esta sesion.

## Evidencia Local Usada

- `evidence/requests/CR-/jira-reconciliation-summary.md`
- `evidence/requests/CR-/duplicate-search-summary.md`
- `evidence/requests/CR-SST-0076/jira-sst-24-close-transition-summary.md`
- `evidence/requests/CR-SST-0076/jira-sst-4-parent-close-transition-summary.md`
- `evidence/requests/CR-SST-0076/jira-sst-6-next-track-continuity.md`

## Mapa Observado

| Jira | State | Lectura local |
| --- | --- | --- |
| `SST-4` | `sst-tags-governance` | Cerrado como corte de Diccionario + Articulos. |
| `SST-21` | `CR-SST-0073` | Backend tags API cerrado. |
| `SST-22` | `CR-SST-0074` | BFF tags facade cerrado. |
| `SST-23` | `CR-SST-0075` | Selector Articulos cerrado. |
| `SST-24` | `CR-SST-0076` | Diccionario/adopcion global cerrado en Jira. |
| `SST-6` | `learning-content-tags` | Siguiente track activo; no cerrar. |
| `SST-10` | `dictionary-tags` | Cerrado previamente como `validated-live`. |

## Conclusion

El avance actual no debe continuar sobre `SST-4`. La continuidad debe abrirse
como `INIT-SST-0001` y apuntar al track `SST-6` / `learning-content-tags`.
