# Git Evidence - sst-extension

Observed at: 2026-05-26

## Local Binding

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\sst-extension
```

## Git

- Remote: `git@github.com:afpogo/sst-extension.git`
- Branch: `develop`
- Upstream: `origin/develop`
- HEAD: `0b71e6b`
- Working tree: dirty, 6 porcelain entries observed
- Stash: none observed

Observed dirty entries:

```text
 M AGENTS.md
 M docs/ai/policy.md
 M specs/00-index.yaml
?? docs/cross-repo/
?? docs/documentation-information-architecture.md
?? docs/idioma-markdown.md
```

## ARDS/SDD Artifacts

- `AGENTS.md`: present
- `specs/00-index.yaml`: present
- `docs/00-overview.md`: present
- `docs/ai/policy.md`: present

## Validation

- Check command: `pnpm run check`
- Package name: `sst-extension`

## Notes

- Represents the SST browser extension runtime.
- Runtime is Manifest V3 with popup, background, side panel/options, storage, and messaging boundaries.
- Participates in SST quick-save, sessions, dictionary, and text-article-pdf flows.
- Delegates auth and ingestion boundaries to `4uentes-auth` through the observed legacy `node-auth` alias.
- Does not own SST graph materialization; that remains with `sst-fend`.
