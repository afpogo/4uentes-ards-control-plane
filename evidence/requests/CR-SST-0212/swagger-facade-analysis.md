# CR-SST-0212 — estrategia de Swagger para `sst-phinance`

Fecha observada: 2026-08-22. Identidad reconciliada: 2026-08-23.

Phinance ya ofrece Swagger UI en `/docs`, ReDoc en `/redoc` y el documento
generado en `/openapi.json` mediante FastAPI. La superficie faltante está en
`sst-bend`, donde `/4uentes/v1/phinance` funciona como fachada dentro del
servicio existente.

| Superficie | Ruta | Propósito |
|---|---|---|
| Swagger SST | `/4uentes/v1/phinance/docs` | QA del contrato consumido desde SST |
| OpenAPI SST | `/4uentes/v1/phinance/openapi.json` | Proyección reproducible de la fachada |
| Swagger owner | `/docs` en Phinance | Inspección de la API propietaria |
| OpenAPI owner | `/openapi.json` en Phinance | Fuente generada del runtime financiero |

`sst-phinance` no es otro microservicio. Es un route group y una capa
anticorrupción en `sst-bend`; Phinance-API conserva la autoridad owner.

La proyección no expone headers internos, `finance_profile_id`, credenciales
servicio-a-servicio ni detalles de persistencia. Swagger puede recibir el token
de usuario durante QA, pero nunca debe incorporarlo al spec ni persistirlo.

La entrega segura mantiene este orden: publicar contrato y shell fail-closed;
publicar `PrincipalContext v1`; implementar capacidades productora y
consumidora; y recién entonces habilitar proxy con QA de aislamiento,
audience, entitlements y fallas upstream.

Esta evidencia proviene de `a0665bf`, donde aparecía bajo el ID colisionado
`CR-SST-0207`. Sólo su contenido SST-Phinance se preserva bajo `CR-SST-0212`.
