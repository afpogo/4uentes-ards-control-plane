# CR-SST-0099 - Atomized plan

## Politicas Aplicadas

- `agent-task-atomization-policy`: separar discovery, runtime, docs y
  validacion.
- `agent-architecture-boundary-policy`: no cambiar contratos backend ni
  ownership cross-repo sin CR separado.
- `owner-documentation-authority-policy`: `sst-extension` es owner documental
  del comportamiento runtime modificado.
- `human-doc-language`: evidencia humana en espanol; identifiers tecnicos se
  mantienen estables.

## Unidades

1. Discovery local en `sst-extension`
   - Inputs: `src/shared/sessions.ts`, storage normalizers, session capture
     service, API gateway tests.
   - Output: shape final de outcome/warnings.
   - Riesgo: medio por compatibilidad de storage.

2. Runtime y normalizacion
   - Implementar tipos y normalizacion backward-compatible.
   - Mantener payload hacia `node-auth` compatible con `CR-SST-0098`.
   - Riesgo: alto si se cambia el contract outbound accidentalmente.

3. Tests
   - Tests de normalizacion/migracion de items antiguos.
   - Tests de warnings sanitizados.
   - Tests de payload outbound compatible.

4. Owner docs
   - `specs/features/sessions.yaml`
   - `specs/integration/node-auth-extension-session-ingestion.yaml`
   - `docs/integration/node-auth-extension-session-ingestion.md`

5. Cierre
   - `pnpm check` en `sst-extension`.
   - `npm.cmd run check` en control-plane.
   - Jira mirror `SST-31`.

## Subagentes

No se delega decision de arquitectura ni contrato. Si se usan subagentes, deben
limitarse a lectura acotada o revision de tests/documentacion; la decision final
queda en el agente principal.
