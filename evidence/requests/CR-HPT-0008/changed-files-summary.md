# CR-HPT-0008 — resumen de cambios

Fecha: 2026-08-22

## Owner `finanzas-personales`

- ARDS/SDD y specs owner describen recursos económicos cotidianos separados de
  instrumentos negociables.
- FastAPI expone alta/listado/detalle de recursos, alta/listado de eventos y
  resumen de uso/desperdicio.
- El dominio usa cantidades `Decimal`, unidad explícita, estado durable y saldo
  derivado de eventos append-only.
- `PrincipalContext` es un puerto fail-closed; ningún body, query o header del
  navegador puede seleccionar owner o cuenta.
- SQLAlchemy 2, psycopg 3 y Alembic implementan PostgreSQL con migración
  reproducible, idempotencia y auditoría atómica.
- El alta de eventos serializa por recurso para proteger cantidades ante
  escrituras concurrentes.
- El harness `.http` y el smoke automatizado verifican OpenAPI y el límite
  fail-closed.

Commit owner: `b46608e` (`feat(phinance): add everyday resource API slice`).

El cambio preexistente en
`07-06_Lluvia_de_ideas_Plataforma_de_finanzas_personales_con_IA-Resumen.md`
permaneció fuera del commit.

## Control plane

- Lifecycle completo de CR-HPT-0008 y autorización explícita previa a la
  mutación del repo hijo.
- Evidencia de alcance, archivos, PostgreSQL, validación y QA Chrome DevTools.
- INIT-HPT-0002 promueve CR-HPT-0008 de candidato a request conocido.

No se modificaron SST, infraestructura, OCR, IA, broker ni instrumentos de
mercado.
