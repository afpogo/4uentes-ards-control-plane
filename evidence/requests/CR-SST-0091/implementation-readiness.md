# CR-SST-0091 - Readiness De Implementacion `sst-bend`

## Objetivo

Preparar la implementacion futura de `LearningWorkspace` en `sst-bend` sin
modificar todavia el repo hijo.

Este CR toma el modelo aprobado en `CR-SST-0090` y lo convierte en un gate de
backend: contratos, discovery, paths a confirmar, pruebas, rollback e
idempotencia.

## Boundary

Permitido en este CR:

- crear request y evidencia de readiness;
- definir contrato backend minimo;
- definir checklist de discovery read-only para `sst-bend`;
- nombrar pruebas futuras esperadas;
- mantener Jira como mirror.

No permitido en este CR:

- editar `sst-bend`;
- crear migrations;
- crear endpoints;
- persistir contenido;
- exponer contexto al chatbot;
- crear `TagDefinition`;
- modificar `sst-chatbot`, `sst-fend`, `4uentes-auth` o infra.

## Gate Antes De Mutar `sst-bend`

Antes de aplicar cambios en `sst-bend`, la ejecucion futura debe registrar:

- path local y branch del repo;
- resumen de worktree dirty;
- framework de ORM/migrations;
- middleware de auth/scope existente;
- modelos o servicios existentes de memoria de usuario;
- POC o parser existente de `learning-content`;
- archivos objetivo exactos;
- tests objetivo exactos;
- comandos de build/check/test;
- estrategia de rollback;
- evidencia de que preview no aprobado no entra al recall durable.

## Secuencia Recomendada

1. Hacer discovery read-only de `sst-bend`.
2. Registrar file plan exacto.
3. Confirmar modelo de persistencia y rollback.
4. Implementar `LearningWorkspace` y referencias runtime.
5. Implementar preview/accept/reject/context como servicios testeables.
6. Agregar endpoints solo despues de servicios puros y tests.
7. Ejecutar checks del repo hijo.
8. Registrar evidencia de resultados y archivos modificados.

## Decision De Creacion

Default:

- crear workspace vacio durante account provisioning si existe hook confiable;
- si el hook no existe o no es estable, crear lazy en primer uso.

La implementacion debe registrar cual opcion encontro en `sst-bend`.
