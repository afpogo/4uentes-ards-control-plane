# CR-SST-0208 - Adopción de policy de worktrees

Fecha: 2026-08-22.

## Resultado

El análisis de recuperación y ciclo de worktrees dejó de ser una recomendación
informal. Se adoptó localmente como `worktree-request-lifecycle-policy` para el
perfil control-plane.

La policy define:

- autoridad separada para request, branch, worktree, ref canónica y Jira;
- reserva inbox-first antes de abrir ejecución paralela;
- máximo de un worktree activo por request y repositorio físico por defecto;
- clasificación obligatoria de árboles limpios, no fusionados, dirty o
  mezclados;
- recuperación selectiva antes de cualquier retiro;
- bloqueo de `running` y `done` simultáneos;
- readback de integración y comprobación de dependencias antes de
  `git worktree remove`;
- prohibición de crear árboles por chat, agente, subagente o prueba sin una
  necesidad de aislamiento documentada.

## Adopción y discovery

- Human doc: `docs/policies/worktree-request-lifecycle-policy.md`.
- Registry: `specs/integration/policies.yaml`.
- Entrada operativa: `AGENTS.md`.
- State link: `state/policy-links.yaml`.
- Índice humano: `docs/policies/README.md`.

La policy es `origin-repo-policy` local de `4uentes-orchestor`. No se declara
canon compartido. Su promoción a `4uentes-ards-core` requiere un request y
handoff separados.

## Enforcement

- `scripts/verify-request-identities.js` impide colisiones en el merge tree.
- `scripts/verify-worktree-request-lifecycle-policy.js` valida registro,
  discovery, secciones normativas y wiring.
- Ambos se ejecutan desde `npm run check`.
- La inspección de refs, worktrees, mounts y procesos permanece operacional y
  debe producir evidencia antes de un retiro; CI no elimina worktrees.

## Límites

Esta adopción no autoriza eliminar worktrees o branches, modificar repositorios
hijos, escribir Jira ni desplegar. Los 24 candidatos identificados continúan
sin remover hasta una decisión posterior.
