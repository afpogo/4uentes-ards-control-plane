# CR-SST-0193 - Bloqueo De Preflight Del Control Plane

Fecha: 2026-08-18

## Resultado

El lifecycle y el plan de `CR-SST-0193` fueron registrados, pero no se creÃ³ el
worktree ni se modificÃ³ `sst-bend` porque `npm run check` fallÃ³ antes de la
mutaciÃ³n del repo hijo.

## Falla Observada

El binding local `finanzas-personales-frontend` apunta al repositorio combinado
de finanzas personales. Su worktree contiene eliminaciones locales ya
existentes de estos artefactos requeridos:

- `frontend/AGENTS.md`;
- `frontend/specs/00-index.yaml`;
- `frontend/docs/00-overview.md`;
- `frontend/docs/ai/policy.md`.

El validador reportÃ³ `38 OK`, `9 WARN` y `4 FAIL` en local bindings. Los nueve
warnings corresponden a remotes no observables y no son el bloqueo; las cuatro
ausencias sÃ­ lo son.

## ProtecciÃ³n De Cambios Ajenos

No se restauraron, movieron ni editaron esos archivos porque las eliminaciones
pertenecen a otro worktree y pueden ser intencionales. Tampoco se removiÃ³ el
binding para ocultar la falla ni se creÃ³ una excepciÃ³n automÃ¡tica.

## Estado De CR-SST-0193

- Request: `running`, autorizado pero bloqueado en preflight.
- Worktree de `sst-bend`: no creado.
- Runtime de memoria: no modificado.
- Jira: sin cambios.

## CorrecciÃ³n De Evidencia

Se intentÃ³ validar contra un worktree detached limpio de HPT y se registrÃ³
incorrectamente un `PASS`. Ese resultado no representaba el binding local
configurado y fue retirado. El binding vuelve a apuntar al worktree real de
Finanzas Personales y este bloqueo continÃºa vigente.

El worktree limpio de `sst-bend` que llegÃ³ a crearse despuÃ©s de ese resultado
invÃ¡lido no recibiÃ³ cambios de runtime y fue retirado junto con su branch local.

## Desbloqueo Requerido

El owner debe restaurar/adoptar los cuatro artefactos en el worktree de
finanzas personales o autorizar una correcciÃ³n acotada del binding/excepciÃ³n.
DespuÃ©s se debe repetir `npm run check`; sÃ³lo con `0 FAIL` se crea el worktree
de `sst-bend` y comienza la implementaciÃ³n.
