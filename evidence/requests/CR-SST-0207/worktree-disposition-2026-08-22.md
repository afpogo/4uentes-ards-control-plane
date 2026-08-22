# CR-SST-0207 - Disposición de worktrees

Fecha: 2026-08-22.

## Worktrees con contenido activo

| Worktree lógico | Estado | Disposición |
| --- | --- | --- |
| `CR-SST-0207-namespace` | Reconciliación activa sobre `origin/main` | Coordinador canónico; único árbol modificado en esta ejecución. |
| raíz | Muy divergente, con cambios SST/HPT mezclados | Cuarentena; no merge, limpieza ni rebase. |
| `cr-sst-0178-public-qa-reconciliation` | Limpio, tres commits sobre main | Se portó `0202`; QA/cierre de `0199` queda para integración posterior preservando commits. |
| `system-feature-studies` | Limpio, dos commits sobre main | Se portó el lifecycle/evidencia `0203`; el feature study se evalúa por separado. |
| `cr-sst-0202-consent-chat-retention` | Cambios no trackeados; `running` y `done` simultáneos | Cuarentena. Se portaron sólo inbox/planned con IDs canónicos `0208/0209/0204-0206`; no se importó `done`. |
| `init-sst-0007` | Muy atrasado y con artefactos Jira antiguos | Fuente histórica; no merge completo. |

## Candidatos limpios a retiro posterior

Los siguientes 24 worktrees estaban limpios, sin commits exclusivos frente a
`origin/main` y con HEAD ya alcanzable desde main. No se removieron porque el
retiro físico requiere una confirmación separada de que ningún proceso externo
los usa.

- `.worktrees/cr-sst-0178-browser-qa`
- `CR-4UENTES-0040-control-plane`
- `cr-cp-0006-control-plane`
- `cr-cp-0006-core-readback`
- `cr-cp-0006-sst-rollout-reconciliation`
- `cr-sst-0125-closure`
- `cr-sst-0125-control-plane`
- `cr-sst-0125-jira-sync`
- `cr-sst-0161-governance-adoption`
- `cr-sst-0173-closure`
- `cr-sst-0178-chatbot-cp-reconciliation`
- `cr-sst-0178-development-continuation`
- `cr-sst-0178-integrated-chat-raw-v2`
- `cr-sst-0178-runtime-readback`
- `cr-sst-0179-multisession-lifecycle-publication`
- `CR-SST-0180-control-plane`
- `cr-sst-0181-control-plane-running`
- `cr-sst-0184-control-plane`
- `cr-sst-0186-adoption-readback`
- `cr-sst-0187-adoption-readback`
- `CR-SST-0188-post-merge-readback`
- `CR-SST-0188-remediation-readback`
- `fend-knowledge`
- `sst-6-jira-closure`

No se ejecutó `git worktree remove`, no se borraron branches y no se modificó
ningún worktree en cuarentena.
