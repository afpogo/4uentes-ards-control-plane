# Diseño y límite de la regla de publicación y cierre

Fecha: 2026-08-23. Request: `CR-CP-0022`.

## Problema observado

Un cambio puede estar validado localmente y aun quedar incompleto como proceso:
branch sin merge, owner sin readback, Jira desactualizado, lifecycle terminal
sin publicar o worktree retirado antes de comprobar la rama canónica. Los
frentes `CR-HPT-0018` y `CR-HPT-0019` mostraron que tratar esos pasos como una
secuencia finita mejora trazabilidad y evita estados intermedios olvidados.

## Regla experimental

Para requests que adopten explícitamente el trial:

1. publicar y releer el plan antes de mutaciones externas gobernadas;
2. validar, mergear y releer cada implementación owner aplicable;
3. reconciliar el tracker mediante lote exacto o declarar `not-applicable` con
   motivo verificable;
4. publicar el lifecycle `done` y su evidencia;
5. releer la rama canónica antes de retirar worktrees temporales.

El paso 5 no genera otro commit obligatorio. Su finalidad es confirmar que el
merge terminal ya contiene el `done`; exigir evidencia Git adicional dentro
del mismo `done` produciría una recursión sin término.

## Límites

- Estado: regla ARDS/SDD experimental, todavía no policy.
- Aplicación: prospectiva y opt-in; no reescribe historia.
- Jira: mirror operativo, con autorización exacta por lote.
- Core: `4uentes-ards-core` no se modifica bajo este request.
- Promoción: sólo mediante `CR-CP-0023` si contrato, validator, trial, Jira y
  readback terminal pasan sin excepción.

## Definition of Done del trial

- machine contract y documentación humana publicados;
- validator normal y self-tests positivos/negativos aprobados;
- `npm run check` completo aprobado;
- Jira reconciliado o excepción válida;
- lifecycle terminal mergeado y leído desde `origin/main`;
- worktree retirado solamente después de ese readback.
