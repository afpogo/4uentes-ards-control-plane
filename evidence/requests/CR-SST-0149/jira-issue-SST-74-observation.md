# Jira Issue Observation: SST-74

## Estado

- Fecha: 2026-08-10
- Request: CR-SST-0149
- Escritura Jira: no

## Issue

- Summary: [CR-SST-0149][AUTH][Mobile] Corregir superposición de campos en signup
- Status: Listo
- Status category: Listo
- Resolution: Listo
- Assignee: Fuentes Sandferand
- Updated: 2026-08-04T22:22:58.660-0300
- Labels: ards-sdd, auth, auth-frontend-access-ui, mobile, orchestrator-reconciliation-pending, responsive, signup, sst-fend, visual-regression

## Transiciones Disponibles

- Por hacer (11) -> Tareas por hacer
- En curso (21) -> En curso
- In Review (31) -> En revisión
- Listo (41) -> Finalizada

## Descripcion Sanitizada

```text
## Autoridad y trazabilidad

* **Change Request:** CR-SST-0149
* **Initiative ARDS/SDD:** INIT-SST-0006
* **Epic Jira:** SST-72
* **Repositorio owner:** sst-fend
* **Autoridad:** el control-plane ARDS/SDD es source of truth; Jira es el mirror operativo.

## Problema reproducido

En signup móvil, los cinco campos pueden ocupar la misma posición y quedar superpuestos. La auditoría con Chrome DevTools reprodujo el defecto en 390x700 y 390x844: las clases `grid-area` están activas antes de que exista el `grid-template-areas` del breakpoint tablet.

En 768x1024 el shell también activa simultáneamente el aside fijo y el formulario de dos columnas, reduciendo el ancho útil de los campos de contraseña.

## Alcance autorizado

* Restaurar una columna estable en viewports estrechos.
* Activar dos columnas sólo cuando el ancho real permita controles utilizables.
* Mantener cinco campos en rectángulos distintos y sin superposición.
* Permitir scroll natural de página, sin clipping ni nested scroll.
* Agregar regresiones de layout y evidencia visual responsive.

## Límites

* Preservar RegisterForm, schema, AuthActor y contratos HTTP/session.
* Preservar `/signup` y el retorno a `/?auth=login`.
* No cambiar términos, privacidad, payloads, RBAC ni autenticación.
* El rebranding visual completo continúa separado en CR-SST-0150.

## Owner ARDS/SDD y continuidad

La implementación debe mantener actualizados en sst-fend:

* `specs/31-auth-frontend.yml`
* `docs/31-auth-frontend.md`
* `specs/15-ui-framework.yml`
* evidencia owner de implementación y QA

## Criterios de aceptación

1. Los cinco campos no se superponen en 320x568, 360x800, 390x844, 412x915, 768x1024, 1366x768 y 1440x900.
2. `documentElement.scrollWidth <= clientWidth`.
3. El orden visual coincide con el orden de teclado.
4. No se introducen alturas fijas, clipping global ni subscroll de formulario.
5. Pasan los checks de sst-fend y el `npm run check` completo del control-plane.
6. El cierre requiere evidencia nueva de Chrome DevTools; la evidencia histórica no alcanza.


```

## Evidencia

- JSON sanitizado: `evidence/requests/CR-SST-0149/jira-issue-SST-74-observation.json`
