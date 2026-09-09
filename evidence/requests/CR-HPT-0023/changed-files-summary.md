# Resumen de cambios owner de CR-HPT-0023

Fecha: 2026-08-28

## Runtime y persistencia

- Migración reversible para vigencia, revocación, origen de rotación e índice
  único parcial por cuenta.
- Modelo, política de dominio, servicio de aplicación y repositorio Sequelize.
- Controller y cuatro rutas owner-only bajo `/4uentes/v1/integrations`.
- Middleware de rol endurecido para no aceptar claims JWT como fallback.

## Contratos y QA

- Spec API y capability outbound de binding provisioning.
- Documentación humana en español y tarea owner.
- Test automatizado y harness HTTP con placeholders sintéticos.
- Incorporación al check ARDS del owner.

La lista exacta y auditable se obtiene con `git status --short` dentro de
`worktrees/CR-HPT-0023-sst-owner`; incluye también el resultado preservado de
`CR-HPT-0019`, que es la base funcional declarada del gate.
