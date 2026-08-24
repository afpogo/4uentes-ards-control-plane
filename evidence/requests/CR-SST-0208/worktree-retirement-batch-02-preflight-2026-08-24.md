# CR-SST-0208 - Preflight de retiro de worktrees, lote 02

Fecha observada: 2026-08-24.

## Resultado

El inventario del control plane se recalculó contra
`origin/main@ae56c5eeee40d580058c36a16ea02fc1c626c263` después de refrescar las
referencias remotas. Se observaron 46 worktrees:

- 41 están limpios y su HEAD es alcanzable desde `origin/main`;
- 2 están limpios pero conservan un commit no integrado;
- 2 están integrados pero contienen cambios sin commit;
- la raíz está dirty, conserva 15 commits no integrados y permanece en
  cuarentena.

Este conteo reemplaza el snapshot del 2026-08-22 para el control plane. No
reclasifica automáticamente los worktrees owner de repos hijos.

## Selección exacta del lote 02

Los siete paths siguientes tienen lifecycle `done` publicado, estado Git
limpio y contenido integrado:

| Path | Branch | HEAD |
| --- | --- | --- |
| `worktrees/CR-4UENTES-0040-control-plane` | `agent/cr-4uentes-0040-adoption-readback` | `de0ba1904edf27597aa1a9a57b615a68cc41fa8f` |
| `worktrees/cr-sst-0161-governance-adoption` | `agent/cr-sst-0161-governance-adoption` | `83a3ffb4c0e72f68a39c09eb6e349b9cb27394b2` |
| `worktrees/cr-sst-0173-closure` | `agent/cr-sst-0173-closure` | `846ebb6e887da4d95651e86085b2296d59a04651` |
| `worktrees/cr-sst-0186-adoption-readback` | `agent/cr-sst-0186-adoption-readback` | `63b37863276b4beaae0d0db18f4c9d5695565d00` |
| `worktrees/cr-sst-0187-adoption-readback` | `agent/cr-sst-0187-adoption-readback` | `4874dd7cf4541b427d05893cb5df47b1f464ea61` |
| `worktrees/CR-SST-0188-post-merge-readback` | detached | `64eaa0d24a0b5e6aeb7b8c770cb5aa33adc04a94` |
| `worktrees/CR-SST-0188-remediation-readback` | `agent/cr-sst-0188-remediation-readback` | `851dec1246d3fa78ec477c307bf66b056f4bcad3` |

## Gates observados

Inmediatamente antes de registrar este preflight se comprobó para cada path:

- `git status --porcelain` sin entradas;
- HEAD ancestro de la ref canónica refrescada;
- cero archivos `*.lock` bajo el gitdir del worktree;
- cero procesos Windows externos cuyo command line referencie el path;
- cero bind mounts de contenedores activos hacia los paths.

La primera lectura de procesos sin elevación fue rechazada por Windows y no se
usó como evidencia. La repetición autorizada, excluyendo el proceso de la
propia auditoría, produjo cero coincidencias. La inspección completa de mounts
Docker tampoco produjo coincidencias con el control plane.

## Exclusiones explícitas

- No se retirará la raíz dirty ni `worktrees/init-sst-0007`.
- `worktrees/CR-SST-0207-integrated-matrix` contiene el archivo único no
  trackeado `scripts/qa-cr-sst-0207-http.js` y queda en cuarentena.
- `worktrees/CR-HPT-0016-jira-lifecycle-execution` y
  `worktrees/cr-sst-0178-public-qa-reconciliation` conservan un commit no
  integrado cada uno y no son elegibles.
- `worktrees/cr-sst-0184-control-plane` no tiene representación `done` en el
  árbol canónico actual y queda fuera aunque su HEAD esté integrado.
- `worktrees/system-feature-studies` ahora está integrado, pero se difiere a un
  readback posterior porque su identidad y branch cambiaron desde el inventario
  anterior.
- No se borrarán branches, refs ni commits en este lote.

## Autorización y publicación

El lote queda `ready-pending-exact-user-confirmation`. La autorización debe
enumerar estos siete paths y habilita solamente `git worktree remove` seguido
de readback. Cualquier diferencia en status, ancestry, locks, procesos o mounts
al momento de ejecutar bloquea el path afectado.

`CR-SST-0208` declara `jira_write_allowed: false` y no tiene issue primario
registrado. Jira queda `not-applicable-no-write`: no se crea ni modifica un
mirror para representar este retiro local.

## Perfil operativo

- provider: `codex`;
- resource level/source: `normal/default`;
- task class: `complex-high-risk-task` por incluir retiro destructivo de paths;
- primary profile: `gpt-5.6-sol`, reasoning `max`;
- fallback: reducir el lote o bloquear ante cualquier ambigüedad;
- subagent deployment: ninguno; ejecución secuencial en el agente principal.

