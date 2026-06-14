# Phase 1 Runtime QA Manual

## Estado

- Fecha de ejecucion: 2026-06-11
- Request gobernante: `CR-SST-0060`
- Jira issue: `SST-4`
- Feature state: `sst-tags-governance`
- Resultado: pass
- Herramienta: Chrome DevTools MCP sobre `http://localhost:4090/artsst`
- Subagentes: no usados; la sesion QA dependia de un unico navegador autenticado.

## Alcance

Se valido el slice de Articulos para el contrato gobernado de tags:

- autenticacion via BFF;
- list con `includeTags=true`;
- create con tags estructurados;
- detail con `includeDocuments=true&includeTags=true`;
- update con preservacion y agregado de tags;
- render frontend en cards y detail.

## Sesion Autenticada

Se creo y autentico un usuario temporal QA por el BFF usando el mismo esquema de
hash del frontend:

- email: `sst.qa.tags.20260612@example.com`
- register: `POST /api/auth/register` -> `200`
- login: `POST /api/auth/login` -> `200`
- refresh al entrar a Articulos: `POST /api/auth/refresh` -> `200`

No se persistieron requests completos de DevTools porque podian contener bearer
tokens o cookies. La evidencia de payload y respuesta se registro solo como
resumen sanitizado.

## Red Validada

Durante el flujo manual se observaron estos requests:

- `GET /api/articulos?page=1&limit=10&includeTags=true` -> `200`
- `POST /api/articulos` -> `201`
- `GET /api/articulos/{id}?includeDocuments=true&includeTags=true` -> `200`
- `PUT /api/articulos/{id}` -> `200`
- `GET /api/articulos?page=1&limit=10&includeTags=true` -> `200`

Requests auxiliares de documentos y agent jobs respondieron `200` o `304` y no
bloquearon el flujo de tags.

## Articulo QA

- id: `016ccafa-22cf-467f-b657-e7ffec02e41a`
- titulo: `QA SST tags governance 20260612014849`
- url: `https://example.com/sst-tags-governance-qa-20260612014849`

Create/list devolvio tags estructurados:

```json
[
  {
    "definitionKey": "tema",
    "label": "qa-tema-20260612014849",
    "slug": "qa-tema-20260612014849",
    "value": "qa-tema-20260612014849",
    "status": "active"
  },
  {
    "definitionKey": "tema",
    "label": "gobernanza-sst",
    "slug": "gobernanza-sst",
    "value": "gobernanza-sst",
    "status": "active"
  }
]
```

Update agrego un tercer tag y detail lo devolvio con occurrence asociado:

```json
[
  {"definitionKey": "tema", "label": "qa-tema-20260612014849", "occurrenceId": true},
  {"definitionKey": "tema", "label": "gobernanza-sst", "occurrenceId": true},
  {"definitionKey": "tema", "label": "fase-1-update", "occurrenceId": true}
]
```

## UI Validada

- Lista inicial vacia autentica y carga sin error.
- Cards renderiza los tags: `qa-tema-20260612014849`, `gobernanza-sst`.
- Detail renderiza seccion `TAGS` con `TEMA` para cada valor.
- Edit modal precarga los tags existentes en el campo gobernado.
- Luego de guardar, cards y detail renderizan tambien `fase-1-update`.
- Consola DevTools despues del flujo autenticado: sin warnings ni errors.

## Evidencia Visual

- `evidence/requests/CR-SST-0060/qa-manual-sst-fend-articles-empty-list.png`
- `evidence/requests/CR-SST-0060/qa-manual-sst-fend-article-tags-list.png`
- `evidence/requests/CR-SST-0060/qa-manual-sst-fend-article-tags-cards.png`
- `evidence/requests/CR-SST-0060/qa-manual-sst-fend-article-tags-detail.png`
- `evidence/requests/CR-SST-0060/qa-manual-sst-fend-article-tags-updated-detail.png`

## Check Backend Posterior

Con ambientes levantados:

- repo: `C:\Users\andre\Desktop\4uentes\apps\4uentes-sstbend\sst-bend`
- comando: `npm.cmd run check`
- resultado: pass, exit code `0`

Notas del check:

- `scripts/ards-check.js` reporto `[ARDS CHECK] OK`.
- Los protected smokes que requieren `SMOKE_JWT` quedaron en skip esperado.
- La cobertura protegida parcial queda registrada como advertencia operativa,
  no como bloqueo del flujo manual validado por BFF/frontend.

## Resultado

Phase 1 queda runtime-validada para Articulos en backend, BFF y frontend:

- create: pass;
- list: pass;
- detail: pass;
- update: pass;
- estructura de tags preservada: pass;
- render UI: pass.

Quedan fuera del cierre minimo de esta prueba:

- decision final de `sst-extension` como productor opcional;
- selector gobernado `TagDefinition`/`TagValue`;
- prefix engine runtime;
- scopes futuros como `bitacora`.
