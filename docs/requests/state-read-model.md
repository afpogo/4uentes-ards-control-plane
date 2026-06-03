# State Read Model Para Features Y Bugfixes

## Proposito

El `state read-model` es una vista documental del estado actual de `features` y
`bugfixes` que ya existen como requests, specs, evidencia o trabajo observado.

No reemplaza el request lifecycle ni ejecuta runtime productivo. Su funcion es
mantener una respuesta auditable para preguntas como:

- que estado tiene una feature ahora
- que bugfix ya fue reproducido, corregido o validado
- que evidencia falta antes de marcar algo como `done`
- que servicios estan afectados

## Alcance V1

La primera version cubre solamente:

- `feature_state`
- `bugfix_state`

Los documentos vivos estan en:

- `state/features/*.current.yaml`
- `state/bugfixes/*.current.yaml`
- `state/capability-links.yaml`

La definicion normativa esta en:

- `specs/states/feature-bugfix-state-model.yaml`
- `specs/states/capability-state-linkage.yaml`
- `state/state-machine.yaml`

## Relacion Con Requests

El request lifecycle documentado sigue siendo:

```text
inbox -> planned -> queued -> running -> done
                  -> rejected
```

En V1, este lifecycle queda referenciado pero no se valida de forma estricta
desde `state/`. La duplicacion historica entre `inbox` y `planned` puede seguir
existiendo como deuda visible y no bloqueante.

## Estados Canonicos

Los estados permitidos para `feature_state` y `bugfix_state` son:

```text
unknown
intake
discovered
ards-documented
planned
implementation-pending
runtime-partial
implemented-local
validated-local
validated-live
ready-for-release
released
done
blocked
deferred
rejected
deprecated
```

`done` requiere evidencia de validacion. Estados no terminales sin
`evidence_refs` pueden existir, pero el validator emite `WARN`.

## Bugfix Markers

Los `bugfix markers` permitidos son:

```text
reproduced
root-caused
fix-proposed
fix-implemented-local
regression-tested
hotfixed
```

Estos markers permiten describir progreso tecnico sin forzar que todo bugfix
tenga un request historico desde el primer dia.

## Validacion

Ejecutar:

```powershell
npm run check:state
```

El comando valida estructura, referencias a catalogo, solution, requests,
specs, evidencia y enlaces `capability -> state`. Tambien bloquea paths
absolutos locales dentro de `state/`.

El check completo del repo incluye esta validacion:

```powershell
npm run check
```
