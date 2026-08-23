# CR-HPT-0003 - Resumen De Cambios

Fecha: 2026-08-18

## Control Plane

- `finanzas-personales-frontend` conserva identidad histórica con estado
  `deprecated` y deja de ser un binding activo.
- La solución HPT contiene sólo `finanzas-personales-backend` como runtime
  propio y registra a `sst-fend` como consumidor externo.
- Initiative, state y CRs planificados fueron reconciliados con la topología
  backend-only.
- El verificador de bindings exige una entrada para todo servicio no deprecado.
- Se agregaron fixtures y prueba de regresión del verificador.

## Owner HPT

Correcciones acotadas realizadas sobre el worktree preexistente:

- ARDS de producto y arquitectura;
- contrato SST integration y contrato personal finance;
- índices de API, capabilities, policies, states y owner overview;
- guía de tareas y reglas de agente;
- `backend/scripts/check-contracts.js` como gate reproducible sin dependencias.

Los cambios amplios que ya retiraban el frontend y redefinían Phinance-API
existían antes de iniciar este CR. No fueron descartados ni atribuidos a esta
ejecución. El worktree fue movido de `main` a
`feat/HPT-4/sst-boundary-account-scope` sin alterar su contenido.

## Fuera De Alcance

- runtime, migraciones o endpoints HPT;
- cuentas bancarias o instrumentos financieros;
- grupos/hogares compartidos;
- cambios en `sst-fend`, `sst-bend` o `4uentes-auth`;
- commits, push, PR o Jira.
