# CR-SST-0064 Runtime Validation Results

## Estado

- Fecha: 2026-06-12
- Request gobernante: `CR-SST-0064`
- Jira issue: `SST-10`
- Feature state: `dictionary-tags`
- Resultado: pass
- Estado soportado: `validated-live`

## Decisiones De Cierre

- `TagDefinition CRUD` queda fuera del cierre de `SST-10`.
- Crear/reutilizar `TagValue` y `TagOccurrence` dentro de Diccionario queda
  validado por runtime.
- Diccionario cierra separado de Articulos, Learning Content, Bitacora y prefix
  engine runtime.
- `sst-extension` queda no bloqueante por el gap conocido de account-context.
- Infra/k8s/ngrok no forman parte de este cierre local-live.

## Backend `sst-bend`

Comandos ejecutados:

| Command | Resultado |
|---|---|
| `npm.cmd run test:diccionario` | PASS, 10/10 |
| `npm.cmd run test:diccionario:stage2` | PASS, 9/9 |
| `npm.cmd run test:diccionario:stage3` | PASS, 11/11 |
| `npm.cmd run qa:diccionario:stage3` | PASS, `[DICCIONARIO STAGE3 QA] OK` |
| `npm.cmd run check` | PASS, con protected smokes en skip esperado por falta de `SMOKE_JWT` para otros dominios |

El smoke live uso un JWT QA en memoria. No se guardo ni se imprimio el token.

## BFF `4uentes-auth`

Comandos y smoke:

| Validation | Resultado |
|---|---|
| `npm.cmd run check` | PASS, `[ARDS CHECK] OK` |
| `POST /api/auth/login` | PASS, token usado solo en memoria |
| `GET /api/diccionario/sheets` | PASS |
| `POST /api/diccionario/sheets` | PASS |
| `POST /api/diccionario/entries` | PASS |
| `PATCH /api/diccionario/entries/:id` | PASS |
| `GET /api/diccionario/tag-values?definitionKey=diccionario.area` | PASS |
| `GET /api/diccionario/tag-occurrences?definitionKey=diccionario.area` | PASS |
| `POST /api/diccionario/entries/:id/reveal` | PASS |

Resumen sanitizado observado:

```json
{
  "createdSheetId": "8a722036-2503-4ba6-9987-7b4df6512674",
  "createdEntryId": "924f464c-9d57-4b3a-82d0-5fa14ff019dc",
  "updatedEntryId": "924f464c-9d57-4b3a-82d0-5fa14ff019dc",
  "tagValueCount": 4,
  "tagOccurrenceCount": 6,
  "revealHasValue": true,
  "tagLabels": ["validated-live", "qa-bff-dictionary"]
}
```

Nota: un primer intento con `x-active-account-id: qa-dictionary-local` fallo
porque el backend espera UUID. La validacion final paso dejando que el
middleware resuelva el contexto por usuario.

## Frontend `sst-fend`

Validaciones:

| Validation | Resultado |
|---|---|
| `npm.cmd run check` | PASS, 24 suites / 142 tests, 22 warnings existentes de hooks |
| Chrome DevTools login QA | PASS |
| `/dictionary` legacy tab | PASS, carga `GET /api/diccionario/rf` como `304` valido/cacheado |
| `/dictionary` management tab | PASS, `GET /api/diccionario/sheets`, `/entries`, `/tag-values` |
| UI create entry | PASS, `POST /api/diccionario/entries` -> `201` |
| UI reload after create | PASS, `/entries` -> `200`, `/tag-values` -> `304` |

Evidencia visual:

- `evidence/requests/CR-SST-0064/qa-manual-dictionary-management-created-entry.png`

Console DevTools:

- Sin errores del flujo.
- Warnings observados: React Router future flags existentes.

## Control Plane

Artefactos actualizados:

- `state/features/dictionary-tags.current.yaml` -> `validated-live`;
- `requests/done/CR-SST-0064-dictionary-tags-validated-live-closure.yaml`;
- `evidence/requests/CR-SST-0064/runtime-validation-results.md`.

Check final:

- `npm.cmd run check`: PASS, 0 fails.
- Warnings remanentes: remotes no observables y dos bugfix states historicos
  sin request/evidence; no pertenecen a `CR-SST-0064`.
