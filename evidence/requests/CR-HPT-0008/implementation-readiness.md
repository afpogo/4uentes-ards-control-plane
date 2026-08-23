# CR-HPT-0008 — readiness de implementación

Fecha: 2026-08-22

## Prerequisites satisfechos

- CR-HPT-0002: gobernanza, owner validation, policies y control-plane link.
- CR-HPT-0003: identidad de servicio y scope `account_id + stable_subject`.
- CR-HPT-0005: contrato de recursos cotidianos aprobado.
- CR-HPT-0012: scaffold FastAPI ejecutable.

## Decisiones recomendadas

1. PostgreSQL con SQLAlchemy 2, Alembic y psycopg 3.
2. Cantidades decimales exactas con unidad explícita en cada evento que cambia
   cantidad; el saldo se deriva de eventos no reversados.
3. Condición durable declarada por el usuario: `USABLE`, `LIMITED`, `UNUSABLE`
   o `DISPOSED`, sin diagnóstico de seguridad.
4. Sin score subjetivo de beneficio en el primer corte.
5. Desperdicio parcial valorizado sólo cuando existen costo y unidad
   compatibles; de otro modo el valor queda no disponible.
6. `DEFER` se registra como hecho, pero el costo monetario de demora se difiere
   hasta contar con un contrato de escenarios y evidencia.
7. Los endpoints dependen de un puerto `PrincipalContext` fail-closed; los tests
   pueden inyectarlo, pero producción no puede leer ni escribir datos sin un
   adapter confiable aprobado.

## Motivo del gate

Estas decisiones afectan schema, migraciones, privacidad y semántica
financiera. Por policy de arquitectura no se convierten en implementación a
partir de una aprobación genérica. CR-HPT-0008 permanece en `planned` y no
autoriza todavía mutación del owner.
