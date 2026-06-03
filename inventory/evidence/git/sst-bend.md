# Git Evidence - sst-bend

Observed at: 2026-05-26

## Local Binding

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-sstbend\sst-bend
```

## Git

- Remote: `git@github.com:afpogo/sst-bend.git`
- Branch: `develop`
- Upstream: `origin/develop`
- HEAD: `08f6c3f`
- Working tree: dirty, 23 porcelain entries observed
- Stash: 1 observed

Observed stash:

```text
stash@{0}: On new/articulosService: Se agrega configuracion git ops para el branch new/articulosService
```

Observed dirty entries include:

```text
 M .dockerignore
 M AGENTS.md
 M db/models/index.js
 M docker-compose.yml
 M docs/ai/policy.md
 M package.json
 M specs/00-index.yaml
 M src/apps/sst/presentation/controllers/articulos.controller.js
 M src/apps/sst/presentation/routes/articulos.routes.js
 M src/apps/sst/presentation/schemas/articulo.dto.js
?? .github/workflows/build-publish-development.yml
?? db/migrations/20260524120000-create-document-agent-jobs.js
?? db/models/document-agent-job.js
?? docs/cross-repo/
?? docs/documentation-information-architecture.md
?? docs/idioma-markdown.md
?? src/apps/sst/application/articulos/create-document-agent-job.usecase.js
?? src/apps/sst/application/articulos/document-agent.service.js
?? src/apps/sst/application/articulos/get-document-agent-job.usecase.js
?? src/apps/sst/application/articulos/list-document-agent-jobs.usecase.js
```

## ARDS/SDD Artifacts

- `AGENTS.md`: present
- `specs/00-index.yaml`: present
- `docs/00-overview.md`: present
- `docs/ai/policy.md`: present

## Validation

- Check command: `npm run check`
- Package name: `sst`
