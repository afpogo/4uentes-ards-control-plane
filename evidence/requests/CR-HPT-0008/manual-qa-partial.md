# CR-HPT-0008 — QA manual parcial

Fecha: 2026-08-22

Herramienta: MCP Chrome DevTools.

## Entorno

- Uvicorn local en `127.0.0.1:8766`, detenido al finalizar.
- Swagger UI inspeccionado en `/docs`.
- Límite de negocio inspeccionado en
  `/api/v1/household-resources` sin identidad de prueba.

## Resultado

| Superficie | Evidencia observada | Resultado |
|---|---|---|
| Swagger UI | `Phinance-API 0.1.0`, OAS 3.1 | PASS |
| Recursos | POST/GET colección y GET detalle visibles | PASS |
| Eventos | POST/GET por recurso visibles | PASS |
| Resumen | GET `use-and-waste` visible | PASS |
| Plataforma | GET `/health` y GET `/ready` visibles | PASS |
| Seguridad por defecto | GET de recursos sin contexto confiable | PASS, HTTP 503 |
| Problem details | código `PRINCIPAL_CONTEXT_UNAVAILABLE` | PASS |
| Red Chrome | request GET observado con status 503 | PASS |

Se tomaron capturas durante la sesión MCP de Swagger y de la respuesta 503. El
conector no permitió persistirlas en el workspace del control plane; la
evidencia reproducible queda en el snapshot de accesibilidad, la inspección de
red y `backend/qa/http/smoke.py`.

## Límite del QA

No se simuló identidad mediante headers. El flujo funcional autenticado se
validó mediante dependency override en tests y contra PostgreSQL real de QA.
El adapter SST, routing/control plane de runtime y UI de `sst-fend` requieren
requests posteriores.
