# Evidencia De Policies Y Subagentes

## Clasificacion

- Provider: `codex`.
- Recursos: `normal`, fuente `default`.
- Peso: `complex-high-risk-task`.
- Perfil principal: `gpt-5.6-sol`, esfuerzo `max`.
- Fallback declarado: `gpt-5.5`, esfuerzo `high`, solamente si conserva todos
  los gates; de otro modo corresponde atomizar o bloquear.

Se aplicaron el registry `specs/integration/policies.yaml` y las policies de
seleccion de modelo, degradacion, atomizacion, delegacion, contexto, limites
arquitectonicos, owner docs y autoridad del work tracker.

## Atomizacion

Cada repo se trato como una unidad read-only con objetivo, inputs, salida,
riesgo y Definition of Done verificables. Los inventarios no hicieron fetch,
checkout, tests que regeneraran artefactos, ediciones, commits ni publicaciones.

## Resultados Delegados Verificados

- `sst-bend`: fuente `b47ca013abea653d7651da5f71c537ea11f9ed64`;
  mezcla CRs gobernados, workflows y `example.png`; `CR-SST-0125` no esta
  implementado en esa fuente.
- `4uentes-auth`: fuente
  `5d722794e1094100be4fa088d99bcf6c7afb4e09`; los unicos cambios locales son
  dos logs que quedan excluidos; preview y auth requieren gates del agente
  principal.
- `sst-fend`: fuente
  `832b39e3811e887f567fa94550e02841057885cf`; `CR-SST-0149` esta separado en
  el worktree y el commit fuente mezcla pilotos y hunks `request_id: TODO`.
- `sst-extension`: base commit
  `2cd6ad495eaf15668ccbb586911ceaf9ac24b344` con delta de worktree; el split
  A/B requiere seleccion por hunks y Draft B tiene gaps de resize/re-encode,
  persistencia/retry y QA privada.
- `sst-4uentes-infra`: no existe delta manual allowlisted para
  `CR-SST-0152`; el cluster fue observado read-only en `Synced/Healthy` y usa
  los tres pins de rollback declarados.

El agente principal contrasto estos resultados con requests, owner docs,
remotos y validadores del control plane. Las decisiones de contrato, auth,
seguridad, Jira, merge, rollout y rollback no fueron delegadas.

## Observacion De Bases Remotas

El 2026-08-06 se consultaron los refs HTTPS sin modificar `origin` ni los
worktrees:

- bend `origin/develop`:
  `8d36a91832a3c55445255c938f0de257312f166b`;
- auth `origin/develop`:
  `82f84da4a99feb7b9606c5b1244f8f05ac60efaa`;
- frontend `origin/develop`:
  `164c19cfcb88c22048eb5cbf5b6c47aa2fa09776`;
- extension `origin/develop`:
  `2cd6ad495eaf15668ccbb586911ceaf9ac24b344`;
- infra `origin/develop`:
  `7299d2b5dfbe62b7a45a297bd277a419b8fae960`.

Cada base debe revalidarse despues del merge del control plane y antes de crear
el worktree aislado. Un cambio de SHA bloquea la recomposicion hasta actualizar
el manifest y la evidencia.
