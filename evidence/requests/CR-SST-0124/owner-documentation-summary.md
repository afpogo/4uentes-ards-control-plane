# CR-SST-0124 Owner Documentation Summary

Date: 2026-07-07

## Owner Policy

Owner documentation authority policy was applied for the `sst-fend` child repo
mutation.

## Updated Owner Files

- `docs/33-articles-frontend.md`
- `specs/33-articles-frontend.yml`
- `docs/38-learning-workspace-frontend.md`
- `specs/38-learning-workspace-frontend.yml`

## Documented Contract

- Native `text` articles may be created without an external source URL.
- Creation result exposes a runtime/app URL derived from the current SPA origin
  and article id.
- Runtime URL opens `/leafArticulo/:id`, which redirects into the existing
  article detail route.
- Runtime URL is navigation-only.
- `url` and `payload.data.sourceUrl` remain external-source fields.
- `LearningWorkspace` keeps using `articleId` as `sourceRef` and
  `originArticleId`; runtime URL is not a LearningWorkspace source reference.

## Node Auth Owner Documentation Update

Owner documentation authority policy was also applied for the BFF mutation in
`4uentes-auth` (`node-auth` alias local).

Updated owner files:

- `docs/bf/03-routing.md`
- `specs/routing.yaml`
- `specs/integrations-api.yaml`
- `docs/capabilities/inbound/sst-bend--article-text-ingestion.md`
- `specs/capabilities/inbound/sst-bend--article-text-ingestion.yaml`
- `docs/capabilities/outbound/article-text-ingestion.md`
- `specs/capabilities/outbound/article-text-ingestion.yaml`

Documented contract:

- `/api/articles` and `/api/articulos` remain equivalent for SPA article create.
- Native `text` creates may send `payload.kind=text` with `payload.data={}` and
  omit `url/sourceUrl`.
- `web` creates and creates without `payload` still require `url/sourceUrl`.
- Optional `url/sourceUrl` on `text` remains URL-format validated.
- `/api/extension/text-articles` remains reserved for browser-extension
  PDF/snapshot ingestion and URL-backed extension context.
