# Regla experimental de publicación y cierre

## Propósito

Esta regla evita que un frente quede “terminado” sólo porque el código pasó
checks locales. Un cierre gobernado también debe publicar lo construido,
releer las fuentes canónicas, sincronizar el tracker cuando corresponda y
retirar los worktrees temporales únicamente al final.

Su identificador es
`execution-publication-and-tracker-closure-rule`. Durante `CR-CP-0022` su
estado es experimental y su aplicación es prospectiva mediante opt-in.

## Secuencia obligatoria

| Orden | Gate | Evidencia esperada |
| --- | --- | --- |
| 1 | Plan publicado | lifecycle aprobado mergeado y leído antes de mutaciones externas gobernadas |
| 2 | Implementación publicada | checks aprobados, PR owner mergeado y ref canónica releída, o `not-applicable` |
| 3 | Tracker reconciliado | lote exacto autorizado y readback, o `not-applicable` con motivo |
| 4 | Cierre publicado | lifecycle `done` y evidencia mergeados en la rama canónica del control plane |
| 5 | Limpieza segura | readback del merge terminal antes de retirar worktrees temporales |

La secuencia no convierte Jira en autoridad ni permite merges sin checks. Cada
write externo mantiene sus autorizaciones y límites propios.

## Cierre finito

El readback posterior al merge terminal no obliga a crear otro commit. Ese
readback confirma que la rama canónica contiene el `done`; exigir un commit
adicional para registrar cada readback produciría una cadena infinita.

Por eso el `done` declara el contrato de publicación terminal. El agente debe
comprobar el merge remoto antes del cleanup y reportar el resultado en su
handoff operativo. Una auditoría o una promoción posterior puede citar ese
merge sin reabrir el request terminado.

## Aplicabilidad y excepciones

- La adopción se activa con `execution_publication_rule.rule_id`.
- No se reescriben requests históricos.
- Git y tracker declaran aplicabilidad por separado.
- `tracker_mirror.applicable=false` requiere una razón verificable.
- Un bloqueo de merge mantiene el request `running`; no se degrada a `done`.
- Un resultado externo parcial consume su lote y requiere readback antes de
  cualquier nueva autorización.

## Contrato mínimo

El bloque de adopción declara:

- ID y estado `trial`;
- aplicabilidad Git;
- obligación de merge del plan y del cierre terminal;
- aplicabilidad del tracker y su routing cuando exista;
- obligación de readback remoto antes del cleanup.

Un request `done` agrega `trial_result` con el resultado de publicación del
plan, implementación, tracker, contrato terminal y cleanup gate.

## Validación

```powershell
node scripts/verify-execution-publication-rule.js --self-test
node scripts/verify-execution-publication-rule.js
npm run check
```

El validator sólo inspecciona lifecycles que adoptan explícitamente el trial.
Sus self-tests incluyen casos inválidos para tracker sin razón, readback
deshabilitado y `done` incompleto.

## Promoción futura

Esta regla no es una policy. Si `CR-CP-0022` completa el circuito sin excepción,
`CR-CP-0023` podrá proponerla a `4uentes-ards-core` como policy
`core-profile-scoped`. Ese follow-up deberá releer el merge terminal del trial,
modificar Core desde un lifecycle separado y mantener la propagación a child
repos como trabajo request-driven.
