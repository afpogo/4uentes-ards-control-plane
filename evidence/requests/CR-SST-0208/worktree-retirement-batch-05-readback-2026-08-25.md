# CR-SST-0208 - Readback de retiro por fase supersedida, lote 05

Fecha de ejecución: 2026-08-25.

## Resultado

La autorización `Autorizo el lote 05 de CR-SST-0208` se aplicó solamente a
los tres paths publicados en el PR #130:

| Path retirado | HEAD previo | Branch conservada |
| --- | --- | --- |
| `worktrees/INIT-SST-0010-publication` | `3b573ba757838b2c0bdad4170e9c4aa34d946eb4` | `agent/init-sst-0010-memory-workspace-publication` |
| `worktrees/sst-6-jira-closure` | `1ad099d949f3729186b491482cbb8eaa0e64b234` | `agent/sst-6-jira-closure` |
| `worktrees/CR-SST-0219-paragraph-derivation-contract` | `6d05f6087aa12cc4e0d32e6f2cfcba308e85420b` | `agent/cr-sst-0219-paragraph-derivation-contract-plan` |

Los tres worktrees fueron retirados correctamente. No se borraron branches,
refs ni commits.

## Preflight efectivo

La ejecución refrescó referencias y utilizó
`origin/main@405947095473cef743cd27c23c009e2173f78b0b`. Antes del retiro se
verificó para cada target:

- path registrado y resuelto dentro de la raíz autorizada;
- estado Git limpio y HEAD integrado;
- ausencia de locks, procesos dependientes y mounts Docker;
- branch local recuperable.

También se comprobó que `worktrees/CR-SST-0219-running` existía y estaba limpio
antes de retirar el checkout de planificación. El readback posterior confirmó
que continúa disponible.

## Inventario posterior

El registro contiene 30 worktrees:

- 24 limpios e integrados;
- 4 limpios con HEAD no integrado;
- 1 dirty integrado: `worktrees/init-sst-0007`;
- 1 dirty no integrado: la raíz del control plane.

Durante la ejecución activa de `CR-SST-0219` apareció el worktree
`worktrees/CR-SST-0219-contract` con un commit de materialización todavía no
integrado. Se preservó íntegramente y queda fuera de cualquier lote de retiro.
Los otros HEAD no integrados continúan siendo `CR-HPT-0016`, el diagnóstico de
`CR-SST-0178` y el worktree externo `CR-CP-0021`.

## Jira y recuperabilidad

No hubo escritura Jira. El cierre histórico de `SST-6` permaneció intacto y
los mirrors activos de `INIT-SST-0010` y `CR-SST-0219` no fueron modificados.

Los tres contenidos retirados estaban publicados y son recuperables desde las
branches o commits enumerados. No existía información única sin commit en los
paths retirados.

