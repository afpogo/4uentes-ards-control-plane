# CR-SST-0208 - Readback canónico posterior al PR #37

Fecha: 2026-08-22.

## Hallazgo

El PR #37 fue fusionado en `origin/main` mediante `7837e39` después de la
publicación inicial del PR #38. Ese merge convirtió en canónico un namespace de
retención diferente al mapa todavía no fusionado de la rama de reconciliación.
Por ello el PR #38 volvió a estado `CONFLICTING` aunque había pasado el gate
sobre la base anterior.

## Autoridad aplicada

La ref fusionada `origin/main` prevalece sobre los lifecycles no fusionados del
PR #38. La autorización del usuario fue explícita para conservar ese mapa,
reasignar las dos intenciones únicas todavía no publicadas y no ejecutar
escrituras Jira.

## Mapa vigente

| Request | Intención | Estado |
| --- | --- | --- |
| `CR-SST-0202` | Contrato de retención consciente | `done`; se retira el `running` residual |
| `CR-SST-0203` | Reconciliación Jira de seguridad preproductiva | `done` |
| `CR-SST-0204` | Bend: retención y cache | `planned` |
| `CR-SST-0205` | Infra: runtime Redis de development | `planned` |
| `CR-SST-0206` | Fend: consentimiento de retención | `planned` |
| `CR-SST-0207` | QA integrado de retención | `planned` |
| `CR-SST-0208` | Reconciliación del namespace y policy de worktrees | `running` |
| `CR-SST-0209` | Auth: sesión web durante registro | `planned` |

Los lifecycles duplicados de retención que el PR #38 había asignado a
`0208/0209` se retiran. No se modifica el scope de las unidades publicadas por
el PR #37.

## Jira

Se conserva el readback publicado por el PR #37:

- `SST-113` refleja `CR-SST-0202`;
- `SST-114` refleja `CR-SST-0204`;
- `SST-115` refleja `CR-SST-0205`;
- `SST-116` refleja `CR-SST-0206`;
- `SST-117` refleja `CR-SST-0207`.

`CR-SST-0208` y `CR-SST-0209` no tienen mirror Jira asignado. Las búsquedas
read-only no encontraron usos externos de esos IDs. No se creó, editó,
comentó, transicionó, reparentó ni enlazó ningún issue durante esta resolución.

## Compatibilidad del worktree

El path físico `worktrees/CR-SST-0207-namespace` se conserva para no mover un
checkout activo. Es un alias operativo legado y no reserva ni redefine la
identidad `CR-SST-0207`, que pertenece al QA integrado publicado por el PR #37.

## Validación requerida

- gate de identidad sin slugs incompatibles ni coexistencia running/terminal;
- self-test del validator;
- gate estructural de la policy de worktrees;
- `git diff --check`;
- `npm.cmd run check` completo;
- readback GitHub del PR #38 después de actualizar la rama.
