# Git Evidence - sst-fend

Observed at: 2026-05-26

## Local Binding

```text
C:\Users\andre\Desktop\4uentes\apps\sst-fend
```

## Git

- Remote: `git@github.com:afpogo/sst-fend.git`
- Branch: `develop`
- Upstream: `origin/develop`
- HEAD: `3f7e7a5`
- Working tree: dirty, 28 porcelain entries observed
- Stash: none observed

Observed dirty entries include:

```text
 M .dockerignore
 M AGENTS.md
 M Dockerfile
 M docs/ai/policy.md
 M package.json
 M specs/00-index.yaml
 M src/api/axiosConfig.ts
 M src/components/AppModalFrame/AppModalFrame.tsx
 M src/components/AppModalFrame/__tests__/AppModalFrame.test.tsx
 M src/components/FinderLayout/index.tsx
 M src/pages/Articles/components/ArticleDetailView/ArticleDetailView.i18n.ts
 M src/pages/Articles/components/ArticleDocumentsPanel/ArticleDocumentsPanel.tsx
 M src/pages/Articles/components/ArticleDocumentsPanel/__tests__/ArticleDocumentsPanel.test.tsx
 M src/pages/Articles/components/ArticlesList/ArticlesList.tsx
 M src/pages/Articles/index.tsx
 M src/pages/Dashboard/pages/Home/index.tsx
 M src/services/articuloService.ts
 M src/store/actions/articulo.action.ts
 M src/store/instances/constants.ts
 M src/store/selectors/articleNode.selector.ts
```

## ARDS/SDD Artifacts

- `AGENTS.md`: present
- `specs/00-index.yaml`: present
- `docs/00-overview.md`: present
- `docs/ai/policy.md`: present

## Validation

- Check command: `npm run check`
- Package name: `sst-fend`

## Notes

- Represents the SST frontend SPA.
- Consumes `4uentes-auth` through the observed legacy `node-auth` BFF/API boundary.
- `AGENTS.ms` exists as a deprecated alias artifact and is not source of truth.
