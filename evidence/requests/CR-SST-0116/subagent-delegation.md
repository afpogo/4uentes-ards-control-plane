# CR-SST-0116 - Subagent Delegation

Fecha: 2026-07-04

## Politica Aplicada

Se aplico `agent-delegation-policy` para acelerar analisis read-only en repos
hijos sin delegar la decision de arquitectura.

## Subagentes

- `019f2f1c-8b93-7243-8dc4-1623194005ab`: analisis read-only de `sst-bend`.
- `019f2f1c-a4df-7cd2-acbd-d0bd8a26f687`: analisis read-only de `node-auth`.

## Resultado Integrado

Ambos concluyeron que:

- `node-auth` ya tiene rutas BFF y passthrough delgado para
  `/api/learning-workspaces/*`;
- `node-auth` no interpreta tags, selectores ni relevancia;
- el bloqueo principal esta en `sst-bend`;
- `sst-bend` no acepta aun `annotations[]` ni persiste previewed annotations;
- `accept` actual requiere repostear `preview`, mientras `CR-SST-0115`
  necesita aceptar por `annotationIds` o aceptar todo el preview;
- `context` actual devuelve bloques aceptados, pero no un read model explicito
  de anotaciones aceptadas.

## Decision

Implementar `CR-SST-0116` como corte runtime principalmente en `sst-bend`, con
actualizacion owner en `node-auth` para documentar el passthrough y el limite
de body si aplica.
