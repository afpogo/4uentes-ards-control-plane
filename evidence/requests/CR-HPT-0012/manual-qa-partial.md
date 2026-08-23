# CR-HPT-0012 — QA manual parcial

Fecha: 2026-08-22

Herramienta: MCP Chrome DevTools

Objetivo: validar el primer scaffold ejecutable, no funcionalidades financieras.

## Entorno

- Proceso: Uvicorn local sobre `127.0.0.1:8766`.
- Página inspeccionada: `/docs`.
- Endpoints inspeccionados: `/health`, `/ready`, `/openapi.json`.
- Contexto de navegador aislado: `cr-hpt-0012`.

## Resultado

| Superficie | Evidencia observada | Resultado |
|---|---|---|
| Swagger UI | título `Phinance-API`, versión `0.1.0`, OAS 3.1 | PASS |
| Contrato visible | sólo aparecen `GET /health` y `GET /ready` | PASS |
| Liveness | HTTP 200 con servicio `finanzas-personales-backend` | PASS |
| Readiness | HTTP 200, `runtime: ok` y sin afirmar dependencias futuras | PASS |
| OpenAPI | HTTP 200; paths exactos `/health` y `/ready` | PASS |
| Consola | un 404 de `favicon.ico` al abrir JSON directo | OBSERVACIÓN |

La captura completa de Swagger fue tomada durante la sesión MCP y mostró
únicamente el grupo `platform` y los schemas de health/readiness. El conector no
permitió persistirla fuera de su workspace interno; la evidencia reproducible
principal queda en el snapshot, la inspección de red y el harness versionado.

El 404 de `favicon.ico` es una solicitud automática de Chrome al navegar un
documento JSON, no un endpoint del contrato ni una falla del runtime. No se
agrega una ruta cosmética porque ampliaría innecesariamente el scaffold.

## Límite del QA

No se probaron autenticación SST, cuenta activa, persistencia, operaciones
financieras, OCR ni despliegue porque no forman parte de CR-HPT-0012.
