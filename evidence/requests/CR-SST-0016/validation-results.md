# CR-SST-0016 - Validation Results

## Validacion ejecutada

| Repo | Comando | Resultado | Notas |
| --- | --- | --- | --- |
| `sst-bend` | `npm.cmd run test:tag-engine` | PASS | 6/6 tests. |
| `sst-bend` | `npm.cmd run test:diccionario:stage2` | PASS | 9/9 tests. |
| `sst-bend` | `npm.cmd run test:diccionario:stage3` | PASS | 11/11 tests. |
| `sst-bend` | `npm.cmd run check` | BLOCKED | El script exige preflight HTTP contra `http://localhost:3005/4uentes/v1/public/gallery`; fallo con `fetch failed` porque SST/scrapper no estaban levantados. |
| `4uentes-orchestor` | `npm.cmd run check:state` | PASS | `18 OK, 5 WARN, 0 FAIL`; 13 state files y 13 capability links. |
| `4uentes-orchestor` | `npm.cmd run check` | PASS | Catalogo, local bindings y state model sin FAIL. |

## Warnings aceptados

- Dos bugfix states historicos siguen sin `request_ids` ni `evidence_refs`.
- `document-agent` mantiene warning por falta de evidencia formal en estado no terminal.

## Bloqueo ambiental

`sst-bend npm.cmd run check` no tiene modo optional para el preflight de
servicios. Para pasarlo se debe levantar SST local en puerto `3005`; scrapper
protegido puede quedar skip si no hay `SMOKE_JWT`.
