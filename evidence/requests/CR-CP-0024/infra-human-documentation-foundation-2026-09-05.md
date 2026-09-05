# Fundación documental humana para custodia de comprobantes

Fecha: 2026-09-05

Request gobernante: `CR-CP-0024`

Owner slice: `CR-HPT-0024` / `HPT-16`

## Intención autorizada

El usuario pidió establecer raíces documentales reutilizables para que las
explicaciones humanas no queden sólo en la conversación. Los documentos deben
tratarse como código y usar mapas Mermaid cuando una relación, secuencia o
dependencia se beneficie de una representación visual.

La estructura autorizada separa:

- aprendizaje: visión, conceptos, lenguaje compartido y responsabilidades;
- playbook: decisiones, gates, criterios y rutas de adopción;
- runbook: comandos, precondiciones, ejecución, QA y rollback;
- specs/manifests: autoridad técnica y estado deseado machine-readable.

## Alcance owner

La documentación pertenece a `sst-4uentes-infra`, autoridad de plataforma. Se
reutilizará el worktree existente de `CR-HPT-0024`, ya limpio e integrado en
`develop@a4d120061d0d4d53352b1de766858602ff759750`. No se creará otro
worktree para el mismo request y repositorio.

Se abrirá una rama local nueva desde esa base. El subgate permite editar,
validar y crear un commit local. No permite push, PR, merge, cambio del cluster,
restart, rollback, Secrets ni cierre Jira.

## Criterio documental

Cada mapa nuevo debe declarar fuentes y autoridad, ser legible sin depender del
color y tener leyenda y fallback textual. Todo comando operativo debe vivir en
un runbook enlazado; el aprendizaje y los playbooks no deben convertirse en
copias divergentes de comandos.

Jira no puede recibir el comentario de inicio porque el OAuth de Atlassian sigue
devolviendo `unauthorized_client`; la reconciliación queda pendiente y el
control plane conserva la autoridad.

## Resultado local

Se reutilizó el worktree `worktrees/CR-HPT-0024-infra-owner`. La rama anterior
estaba limpia, integrada y alcanzable desde
`origin/develop@a4d120061d0d4d53352b1de766858602ff759750`. No existía
colisión local ni remota para la nueva rama
`docs/CR-HPT-0024/human-receipt-custody-guides`.

El commit owner local
`67c4874b2404235d70dc56ce143343954f5c707e` establece:

- raíz `docs/learning/` y fundamentos humanos de custodia;
- raíz `docs/playbooks/` y playbook de adopción;
- vínculo explícito con el runbook técnico de development;
- arquitectura de información `learning → playbook → runbook → specs`;
- siete mapas Mermaid con autoridad, fuentes, leyenda y fallback textual;
- `scripts/verify-human-documentation.js` y el gate
  `npm run check:human-docs` dentro del check owner completo.

Pasaron el check focalizado, `npm run check`, resolución de enlaces locales,
`git diff --check`, búsqueda de whitespace y scan de material sensible. El
worktree quedó limpio y un commit por delante de `origin/develop`.

La autorización quedó consumida por el commit local. Push, PR y merge siguen
prohibidos hasta un gate separado.
