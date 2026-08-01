# CR-SST-0121 - implementación y validación del permiso visual efímero

Fecha: 2026-07-23  
Estado: listo para QA manual; CR permanece en progreso

## Implementación owner

Repo: `sst-extension`.

- `<all_urls>` se declara solamente en `optional_host_permissions`.
- `auto` y `visual-only` lo solicitan directamente desde el click explícito.
- `text-only` y `prefer-text` nunca solicitan ni liberan el permiso global.
- UI crea un lease identificado; background espera su cleanup inicial, verifica
  el permiso real y reclama sólo el lease esperado.
- La captura que posee el lease lo libera en éxito, error y fallo temprano de
  storage; un reinicio MV3 limpia únicamente markers owner abandonados.
- Un grant global sin marker owner no se elimina durante cleanup.
- La denegación conserva una sesión basada en metadata con warning cerrado
  `host-permission-denied`, sin ejecutar captura visual ni lectura de página.
- El consentimiento para transportar previews privadas sigue separado, por
  sesión y apagado por defecto.

## Owner docs

- `specs/features/sessions.yaml`
- `docs/00-overview.md`
- `docs/qa/session-capture-validation.md`

## Validación

- `pnpm check`: PASS.
- Baseline ARDS/SDD: PASS.
- Tests: 27 archivos, 123 tests PASS.
- Build Chrome MV3: PASS.
- Manifest generado: `<all_urls>` sólo en `optional_host_permissions`.
- `git diff --check`: PASS.
- Repetición independiente focalizada:
  - permission helper;
  - command handler/lifecycle;
  - degradación de session service;
  - 3 suites, 32/32 tests PASS.

## Límite

La prueba automatizada no sustituye la aceptación visible del diálogo de Chrome
ni la confirmación de que el permiso desaparece al terminar una captura real.
Esos puntos se ejecutan bajo `CR-SST-0103 / SST-35`.
