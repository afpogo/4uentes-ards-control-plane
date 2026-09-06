# Plan de ejecución owner de CR-SST-0234

## Clasificación operativa

- Provider: `codex`.
- Recursos: `normal`, fuente `default`.
- Tarea: `complex-high-risk-task` por contrato HTTP, autorización, snapshots y
  persistencia.
- Perfil requerido por policy: `gpt-5.6-sol`, reasoning `max`.
- Perfil efectivo: sesión Codex disponible; sin delegación ni downgrade de
  decisiones sensibles.
- Fallback: reducir alcance y bloquear antes que modificar contratos con
  evidencia incompleta.

## Unidades auditables

### 1. Contrato y documentación owner

Objetivo: fijar en `sst-bend` la semántica observable antes del runtime.

Outputs: actualización de `specs/api/learning-workspaces.yaml`, documentación
API, capability outbound, playbook, runbook y dos mapas Mermaid con fallback
textual. Riesgo: medio. DoD: referencias, autoridad, precondiciones, stop
conditions y rollback quedan explícitos.

### 2. Resolver y snapshots

Objetivo: resolver descriptores autorizados de artículo, documento y resultado
de agente hacia contenido owner, y persistir una identidad de snapshot
inmutable, versionada y con hash.

Outputs: ports/adapters, persistencia reversible, casos de uso y API compatible.
Riesgo: alto por scope y datos. DoD: no confiar en cuerpos suministrados por el
caller cuando existe descriptor autoritativo; fallar cerrado frente a scope,
tipo o fuente ausente; no almacenar secretos.

### 3. Validación y publicación

Objetivo: probar compatibilidad, autorización, inmutabilidad e idempotencia.

Outputs: pruebas focales, `npm run check`, revisión de diff, PR owner y readback.
Riesgo: medio. DoD: ningún deployment ni migración ejecutada; capability queda
en el estado que refleje honestamente la readiness de consumidores.

## Stop conditions

- baseline remoto diferente o branch/worktree duplicado;
- checkout owner con cambios ajenos reutilizado por error;
- contrato canónico incompatible con el runtime observado;
- necesidad de acceder a secretos, datos compartidos o ejecutar migraciones;
- cambio requerido fuera de `sst-bend`;
- checks owner o gate completo del control plane en rojo.

## Rollback y compensación

Antes del merge, el rollback consiste en no publicar el branch owner. Después
del merge, schema y comportamiento deberán revertirse mediante migración y
commit explícitos; no se autoriza rollback destructivo ni ejecución sobre
entornos en este gate.
