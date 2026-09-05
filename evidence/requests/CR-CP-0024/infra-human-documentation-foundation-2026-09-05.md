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
