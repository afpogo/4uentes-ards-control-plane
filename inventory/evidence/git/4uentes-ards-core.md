# Git Evidence - 4uentes-ards-core

Observed at: 2026-05-26

## Local Binding

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-core
```

## Git

- Remote: `git@github.com:afpogo/4uentes-ards-core.git`
- Branch: `mcp-server-implementation`
- Upstream: `origin/develop`
- HEAD: `4b8902b`
- Working tree: dirty, 9 porcelain entries observed
- Stash: none observed

Observed dirty entries:

```text
 M admin/ADR-FORMAT.md
 M admin/README.md
 M admin/concepts/ards-core-as-mcp.md
 M admin/mcp-contract-draft.md
 M admin/profile-taxonomy.md
 M admin/roadmap/mcp-evolution-stages.md
 M package.json
?? admin/decisions/0002-mcp-read-only-first.md
?? admin/decisions/0003-project-type-taxonomy.md
```

## ARDS/SDD Artifacts

- `AGENTS.md`: present
- `standard/ARDS_KIND_MODEL_v1.md`: present
- `specs/00-index.yaml`: present
- `docs/00-overview.md`: present
- `docs/ai/policy.md`: not present

## Validation

- Check command: `npm run check`
- This repo is the standard source consumed by `4uentes-orchestor`.
