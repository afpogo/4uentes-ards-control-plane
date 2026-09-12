# Gate de ejecución propuesto para CR-SST-0238

Fecha: 2026-09-12. Owner funcional: `sst-fend`. Owner de orquestación:
`4uentes-orchestor`.

Este documento prepara el próximo lote; no publica todavía el lifecycle
`running`, no autoriza escrituras Jira ni modifica `sst-fend`, runtime o
infraestructura. ARDS/SDD conserva autoridad y Jira sigue siendo espejo.

## Readback de entrada

- Control-plane canónico leído en
  `main@729cc79a0256c5cbd9ba319ad931ba075a250aad`.
- `CR-SST-0238` está `planned` y se vincula de forma única con `SST-131`.
- Jira mostró `SST-131` como `Subtask` de `SST-102`, en
  `Tareas por hacer`, resolución nula y cero comentarios. La transición
  `En curso` estaba disponible con id observado `21`.
- `sst-fend` se refrescó y leyó en
  `origin/develop@d1e9ef5e578220ea666d033c05ba2cccb1bb7e8e`.
- No existe branch ni worktree owner para `CR-SST-0238`.

Los cuatro gaps del plan siguen presentes en esa revisión owner:

1. `firstLogin` todavía ejecuta `gotoOnboard` hacia la ruta inexistente
   `/onboard`.
2. Landing todavía pasa `fetchPriority` a React 18.2.
3. `SstButton` todavía no reenvía su ref al botón Ant Design.
4. `RouterProvider` todavía no activa `future.v7_startTransition`.

El checkout principal de `sst-fend` contiene cambios de otros requests y queda
fuera de alcance. El worktree histórico del control-plane
`worktrees/CR-SST-0238-onboarding-console-gates` está dirty, 160 commits detrás
de `origin/main` y conserva material ya publicado junto con una identidad
histórica colisionada; debe preservarse sin reusar, limpiar ni retirar en este
gate.

## Lote exacto que requiere autorización

La ventana propuesta dura como máximo 60 minutos y empieza sólo después de
fusionar y releer desde `main` el lifecycle `running` y su ledger de
autorización. La primera escritura externa vuelve el lote de un solo uso.

### 1. Publicación de inicio en el control-plane

- Mover exclusivamente `CR-SST-0238` de `requests/planned/` a
  `requests/running/`.
- Registrar la autorización, la revisión owner fijada, el branch/worktree
  previsto, los límites Jira y las rutas owner permitidas.
- Ejecutar `npm.cmd run check`, publicar PR, fusionarlo y hacer readback de
  `origin/main` antes de tocar Jira o `sst-fend`.

### 2. Inicio del espejo Jira

Máximo dos escrituras sobre `SST-131`, después de releer issue, jerarquía,
unicidad y transición:

1. Agregar exactamente este comentario inicial:

   `CR-SST-0238 inicio: lifecycle running publicado y leído desde main antes de modificar sst-fend. Alcance limitado a corregir la entrada firstLogin hacia defaultModule/Home y los warnings React fetchPriority, findDOMNode y v7_startTransition; incluye specs/docs/tests owner. Sin merge, runtime, Docker, deployment, datos reales ni cambios Auth/Bend/Infra. ARDS/SDD conserva autoridad; Jira es espejo y queda En curso.`

2. Transicionar `SST-131` de `Tareas por hacer` a `En curso` mediante la
   transición aplicable leída en el preflight; el id `21` es sólo el valor
   observado y debe confirmarse de nuevo.

No se autorizan otros comentarios, ediciones, links, transiciones, cambios de
parent, assignee, prioridad o resolución. Después de cada escritura se exige
readback. Cualquier resultado incierto, drift o fallo consume la autorización
y detiene el lote.

### 3. Implementación owner hasta PR abierto

- Crear un worktree limpio de `sst-fend` desde el `origin/develop` refrescado,
  usando branch `agent/cr-sst-0238-authenticated-entry-react-compatibility` y
  path dedicado
  `worktrees/CR-SST-0238-sst-fend-owner`.
- Modificar únicamente:
  - `src/machines/AuthMachine/states/isValidUser.ts`;
  - `src/pages/Landing/index.tsx`;
  - `src/components/SstButton/index.tsx`;
  - `src/App/index.tsx`;
  - `src/machines/AuthMachine/__tests__/isValidUser.test.ts`;
  - `src/components/SstButton/__tests__/SstButton.test.tsx`;
  - `src/App/__tests__/App.test.tsx`;
  - `specs/31-auth-frontend.yml`;
  - `docs/31-auth-frontend.md`;
  - `docs/tasks/2026-09-12-cr-sst-0238-authenticated-entry-react-compatibility.md`.
- Enviar `firstLogin` al `defaultModule` existente, sin crear ni redirigir
  superficialmente `/onboard`.
- Retirar `fetchPriority`, reenviar la ref mediante el contrato soportado de
  Ant Design y activar `future.v7_startTransition` sin retirar `StrictMode`.
- Agregar pruebas focales para la navegación `firstLogin`, el ref real del
  botón y el flag del router; no agregar dependencias.
- Ejecutar pruebas focales y `npm.cmd run check` completo del owner.
- Actualizar documentación owner y `orchestrator_link`, commitear, publicar el
  branch y abrir un PR hacia `develop`. El merge queda fuera del lote.
- Publicar en el control-plane evidencia sanitizada del resultado y ejecutar
  nuevamente `npm.cmd run check`.

## Exclusiones y condiciones de detención

No se autoriza fusionar el PR owner, recrear contenedores, iniciar servidores,
usar credenciales de usuario, ejecutar QA en `localhost:4090`, desplegar,
modificar Infra/GitOps, cambiar Auth/Bend, habilitar onboarding ni manipular
datos reales. Esas acciones pertenecen a gates posteriores.

Detener ante cambios nuevos en `origin/develop`, necesidad de salir de las
rutas enumeradas, incompatibilidad del tipo de ref, regresión de auth/routing,
fallo de tests/check, datos sensibles, drift Jira o incertidumbre de escritura.
Antes de merge owner el rollback consiste en corregir o cerrar el PR; no existe
rollback runtime porque este lote no lo modifica.

## Próxima decisión humana

Se requiere autorización explícita del lote y de la ventana de 60 minutos. La
autorización no puede inferirse de la creación de `SST-131` ni de este preflight.
