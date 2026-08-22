# CR-SST-0208 - Readback actualizado de disposición de worktrees

Fecha observada: 2026-08-22.

## Resultado

Se refrescaron las referencias remotas y se inspeccionaron 79 raíces Git
físicas vinculadas al workspace: 30 del control plane, 46 worktrees owner y
3 clones de cierre embebidos. No se retiró ningún worktree ni se borró ninguna
branch.

La clasificación resultante es:

- 7 árboles con cambios sin commit: retiro bloqueado;
- 4 árboles limpios cuyo HEAD no es ancestro de `origin/main` o
  `origin/develop`; uno tiene un patch equivalente ya integrado y tres
  conservan commits únicos;
- 33 candidatos estrictos a retiro posterior: limpios, integrados y asociados
  a un lifecycle `done` publicado;
- 34 árboles limpios integrados pero con lifecycle activo, ambiguo o sin mapping
  terminal suficiente; requieren readback específico antes del retiro.

Esta clasificación reemplaza el conteo operativo anterior de 24 candidatos,
pero no cambia la regla: la ausencia de cambios Git no prueba que ningún
proceso, mount o servicio dependa del path.

## Árboles dirty en cuarentena

| Repo | Worktree | Cambios observados | Gate |
| --- | --- | ---: | --- |
| `4uentes-orchestor` | raíz | 222 entradas; 31 trackeadas | `npm.cmd run check` falla en `scripts/test-verify-local-bindings.js`: `spawnSync` devuelve `status: null` |
| `4uentes-orchestor` | `init-sst-0007` | 6 entradas; 3 trackeadas | PASS |
| `sst-extension` | `cr-sst-0152-sst-extension-a` | 56 entradas; 44 trackeadas | bloqueado por dependencias ausentes (`vitest`/`node_modules`) |
| `sst-4uentes-infra` | `cr-sst-0178-browser-socket-ingress` | 4 entradas trackeadas | PASS |
| `sst-4uentes-infra` | `CR-SST-0178-infra` | 23 entradas; 18 trackeadas | PASS |
| `sst-chatbot` | `CR-SST-0178-chatbot` | 9 entradas; 6 trackeadas | bloqueado porque el worktree no contiene `.venv` |
| `sst-fend` | `.worktrees/init-sst-0007-closure/fend` | 5 entradas trackeadas | bloqueado por dependencia ausente (`eslint`) |

El árbol raíz mezcla commits HPT no publicados con cambios de control plane de
varias iniciativas y requests. El worktree de extension está nombrado por
`CR-SST-0152`, aunque sus cambios sin commit incluyen una ampliación funcional
de captura de sesiones. Ninguno puede adoptarse, descartarse o atribuirse por
el nombre del path; ambos requieren extracción por unidades auditables.

## Commits limpios todavía no integrados

| Worktree | Estado |
| --- | --- |
| `cr-sst-0178-public-qa-reconciliation` | Conserva un commit único y además contiene la asignación histórica incompatible de `CR-SST-0202`; portar selectivamente, no fusionar completo. |
| `system-feature-studies` | Conserva un commit único con correcciones Jira/evidencia de `CR-SST-0204`; requiere publicación o supersesión explícita. |
| `CR-SST-0178-auth` | Conserva tres commits únicos de auth/chat; `CR-SST-0178` sigue activo y el retiro está bloqueado. |
| `CR-SST-0193-bend` | El HEAD no es ancestro de develop, pero `git cherry origin/develop HEAD` marca su único patch como equivalente; retirar sólo después de registrar supersesión/readback owner. |

## Candidatos estrictos a retiro posterior

Los siguientes 33 árboles están limpios, integrados en la ref canónica owner y
correlacionados con un request `done` publicado:

- `4uentes-orchestor/worktrees/CR-4UENTES-0040-control-plane`
- `4uentes-orchestor/worktrees/cr-sst-0125-closure`
- `4uentes-orchestor/worktrees/cr-sst-0125-control-plane`
- `4uentes-orchestor/worktrees/cr-sst-0125-jira-sync`
- `4uentes-orchestor/worktrees/cr-sst-0161-governance-adoption`
- `4uentes-orchestor/worktrees/cr-sst-0173-closure`
- `4uentes-orchestor/worktrees/cr-sst-0184-control-plane`
- `4uentes-orchestor/worktrees/cr-sst-0186-adoption-readback`
- `4uentes-orchestor/worktrees/cr-sst-0187-adoption-readback`
- `4uentes-orchestor/worktrees/CR-SST-0188-post-merge-readback`
- `4uentes-orchestor/worktrees/CR-SST-0188-remediation-readback`
- `4uentes-orchestor/worktrees/cr-sst-0202-consent-chat-retention`
- `4uentes-orchestor/worktrees/fend-knowledge`
- `4uentes-auth/cr-sst-0152-4uentes-auth`
- `4uentes-auth/cr-sst-0186-auth-readme-fix`
- `4uentes-auth/CR-SST-0201-auth-validation`
- `4uentes-portfolio/CR-4UENTES-0040-portfolio-adoption`
- `4uentes-portfolio/CR-4UENTES-0040-portfolio-readback`
- `sst-4uentes-infra/CR-SST-0161-infra`
- `sst-4uentes-infra/CR-SST-0199-infra`
- `sst-4uentes-infra/CR-SST-0201-infra`
- `sst-4uentes-infra/CR-SST-0201-infra-chat-facade`
- `sst-4uentes-infra/CR-SST-0201-infra-migration`
- `sst-bend/cr-sst-0125-sst-bend`
- `sst-bend/cr-sst-0152-sst-bend`
- `sst-bend/CR-SST-0161-bend`
- `sst-bend/cr-sst-0188-bend-readme-fix`
- `sst-bend/CR-SST-0199-bend`
- `sst-bend/CR-SST-0199-bend-remediation`
- `sst-fend/cr-sst-0149-sst-fend`
- `sst-fend/cr-sst-0152-sst-fend`
- `sst-fend/CR-SST-0201-fend`
- `sst-fend/sst-fend-cr-0173`

El retiro físico sigue condicionado a comprobar procesos/mounts, registrar el
path exacto y ejecutar una confirmación separada. Borrar la branch continúa
siendo una decisión independiente.

## Preflight local de uso de paths

Después de publicar el inventario se ejecutó un preflight no destructivo sobre
los 33 candidatos estrictos:

- todos los paths existen y continúan siendo raíces Git válidas;
- no se observaron archivos `*.lock` ni marcadores `locked` en sus gitdirs;
- `git worktree list --porcelain` no reportó locks aplicables;
- no se observaron procesos Windows cuyo command line referencie los paths;
- Docker no tenía containers en ejecución ni bind mounts hacia `worktrees/`.

El primer intento de normalizar gitdirs absolutos con `Join-Path` produjo un
error de tooling y no se usó como evidencia. La repetición con
`git rev-parse --path-format=absolute --git-dir` completó sin hallazgos.

Resultado: los 33 paths pasan el preflight observable de uso local. Esto no
autoriza borrar branches y no elimina la necesidad de retirar por lotes
pequeños con readback posterior.

## Readback del coordinador

La normalización de `CR-SST-0208` está publicada y `CR-SST-0211` quedó integrado
por el PR #40 en `origin/main@554183b`. El worktree físico legado
`CR-SST-0207-namespace` ya no conserva commits únicos, pero no se reutiliza para
este readback: la recuperación continuó en el worktree limpio creado cuando el
coordinador todavía estaba mezclado.

## Siguiente gate

1. Publicar este readback de control plane.
2. Separar y publicar o superseder los tres conjuntos de commits únicos.
3. Extraer los siete árboles dirty por request/owner, sin merges completos.
4. Retirar los worktrees estrictos por lotes pequeños y registrar readback.
5. No borrar branches en el
   mismo lote salvo autorización explícita separada.
