# Preflight De Reserva Para CR-CP-0028

Fecha: 2026-09-05.

## Decisión

`CR-CP-0028` queda asignado únicamente a la promoción de
`knowledge-to-execution-documentation-policy` hacia `4uentes-ards-core` como
`core-profile-scoped`.

Este gate sólo reserva la identidad y conserva evidencia. No modifica Core,
repositorios funcionales, Infra, runtime ni Jira.

## Identidad Y Trabajo Concurrente

La inspección del árbol canónico, refs locales y remotas, worktrees y PRs no
encontró `CR-CP-0028` ni otra promoción activa de esta policy.

`CR-CP-0027` sí está ocupado por una intención diferente: adopción de la policy
en `sst-4uentes-infra`. Su worktree está activo y su PR owner permanece fuera
de este alcance. No se reutiliza, fusiona ni modifica.

Baselines observados:

- control plane: `origin/main@277d62f57a8104162c67220f91ce6f28aa0499e1`;
- Core remoto por HTTPS:
  `origin/develop@ded8c466dc3c02a02f7b24642ce99de6cebcc91c`;
- PRs de control plane con texto exacto `CR-CP-0028`: ninguno;
- PRs de Core con `CR-CP-0028` o `knowledge-to-execution`: ninguno;
- policy equivalente en el checkout de Core: no observada.

La primera consulta Git de Core usó la URL SSH configurada localmente y falló
por ausencia de una clave aceptada. El readback se repitió por HTTPS y confirmó
el baseline sin escribir refs ni archivos en Core.

## Clasificación Y Boundary

La promoción propuesta es `core-profile-scoped`. No es `core-general`: su
aplicabilidad depende de perfiles que producen o mantienen guidance humano
vinculado a autoridad técnica y ejecución gobernada.

No corresponde un overlay. La policy es un contrato durable y reusable, no un
delta contextual sobre otra policy publicada. Además, el control plane aún no
tiene un kind, schema ni resolver activo para `policy_overlay`.

Core es el owner del canon compartido. Conforme a `AGENTS.md`, este workflow
del control plane sólo puede publicar el request, el plan y el handoff. La
aceptación, implementación, validación y publicación en Core deben ocurrir en
un workflow situado en el repo owner.

## Relación Con CR-CP-0026 Y CR-CP-0027

- `CR-CP-0026` es la fuente local validada y cerrada.
- `CR-CP-0028` gobierna la propuesta de promoción al owner Core.
- `CR-CP-0027` es una adopción owner-local de Infra y no demuestra canon Core.

El orden observado —adopción Infra activa antes de canon Core— no cambia la
autoridad: esa adopción debe conservar su fuente y manifest propios, y una
publicación posterior en Core no la vuelve adoptada retroactivamente ni la
sobrescribe en silencio.

## Degradación De Recursos

El operador solicitó subagentes para validación paralela. Se intentaron dos
subtareas read-only acotadas. La primera no pudo iniciar con el modelo heredado
disponible para la cuenta; el retry con fallback alcanzó el límite de uso.

Aplicando `agent-resource-degradation-policy` y `agent-delegation-policy`, el
fallback fue una revisión secuencial por el agente principal, manteniendo el
scope mínimo verificable y sin delegar autoridad de arquitectura ni ownership.
No se presenta output delegado como evidencia exitosa.

El runtime tampoco expone control de temperatura, por lo que el valor `0.5`
pedido por el operador queda registrado como solicitado pero no como aplicado.

## Fuentes Revisadas

- `docs/policies/worktree-request-lifecycle-policy.md`;
- `docs/policies/agent-resource-degradation-policy.md`;
- `docs/policies/agent-delegation-policy.md`;
- `docs/policies/agent-architecture-boundary-policy.md`;
- `docs/policies/execution-publication-and-tracker-closure-policy.md`;
- `requests/done/CR-CP-0026-define-knowledge-to-execution-documentation-policy.yaml`;
- precedentes de promoción `CR-CP-0020` y `CR-CP-0023`;
- registry local y handoff outbound de policies;
- checkout, refs, worktrees y PRs observables de Core.

## Próximo Gate

Después del merge y readback de esta reserva:

1. refrescar `origin/main`;
2. retirar este worktree de reserva sólo si está limpio y su commit es
   alcanzable desde el canon;
3. crear un único worktree limpio de ejecución de `CR-CP-0028`;
4. publicar plan, estado running y handoff outbound;
5. detener la mutación cross-repo en el boundary del owner Core.
