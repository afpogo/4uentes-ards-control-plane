# Git Evidence - 4uentes-auth

Observed at: 2026-05-26

## Local Binding

```text
C:\Users\andre\Desktop\4uentes\apps\node-auth
```

The folder name is the legacy alias. The canonical service identity remains
`4uentes-auth`.

## Git

- Remote: `git@github.com:afpogo/4uentes-auth.git`
- Branch: `main`
- Upstream: `origin/main`
- HEAD: `dfe576f`
- Working tree: dirty, 23 porcelain entries observed
- Stash: none observed

Observed dirty entries include:

```text
 M .gitignore
 M AGENTS.md
 M docker-compose.yml
 M docs/ai/policy.md
 M package.json
 M specs/00-index.yaml
 M src/domain/constants/articulo.constants.ts
 M src/domain/datasources/articulo.datasource.ts
 M src/domain/index.ts
 M src/domain/repositories/articulo.repository.ts
 M src/domain/services/articulo.service.ts
 M src/infrastructure/datasources/articulo.datasource.impl.ts
 M src/infrastructure/repositories/articulo.repository.ts
 M src/presentation/articulo/controller.ts
 M src/presentation/articulo/routes.ts
?? .dockerignore
?? .github/
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

- Check command: `npm run check`
- Package name: `4uentes-auth`
