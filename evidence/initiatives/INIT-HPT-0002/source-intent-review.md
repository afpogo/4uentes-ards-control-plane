# Revisión De Intención De La API De Instrumentos Personales

Fecha de observación: 2026-08-21

## Resultado

La evolución propuesta no pertenece a la iniciativa de onboarding
`INIT-HPT-0001`. Esa iniciativa prepara gobernanza, owner baseline y el
boundary de cuenta antes de implementar runtime. El nuevo objetivo es producto:
construir una API auditable de instrumentos financieros para uso personal y
permitir que SST la consuma sin apropiarse de su backend.

Por eso se registra `INIT-HPT-0002` como hipótesis independiente y relacionada.
No aprueba implementación ni modifica repos hijos.

## Intención Interpretada

- El módulo debe aparecer dentro de la experiencia SST como una capacidad
  invitada y opcional.
- `finanzas-personales-backend` conserva ownership de dominio, datos, API y
  auditoría.
- SST conserva ownership de sesión, cuenta activa, membership, navegación y
  experiencia web.
- El diseño debe poder admitir consumidores futuros distintos de SST.
- Alphinance sirve como antecedente para estudiar operaciones e instrumentos,
  no como implementación que deba copiarse.
- La cartera agrupa cuentas financieras y obtiene instrumentos mediante
  posiciones derivadas de operaciones.
- Los primeros instrumentos pueden ser `USER_DEFINED` y evolucionar mediante
  reconciliación auditable hacia identidades reales de mercado.

## Límites

- No se ofrece asesoramiento financiero.
- No se ejecutan órdenes contra brokers o mercados.
- No se adopta el alcance empresarial completo de Alphinance.
- No se resuelven en esta iniciativa retención, sharing, RBAC, proveedores de
  market data ni integración bancaria.
- Jira queda como mirror no solicitado; ARDS/SDD conserva la autoridad.

## Secuencia Propuesta

1. `CR-HPT-0005`: decidir contrato de dominio y boundary SST.
2. `CR-HPT-0008`: implementar una primera rebanada productora, después de los
   prerequisitos de gobernanza y principal context.
3. `CR-SST-TODO`: adoptar la capability desde el owner SST correspondiente.
4. `CR-HPT-TODO-ECONOMIC-VALIDATION`: validar aislamiento, reversas,
   idempotencia, auditoría y el flujo integrado.
