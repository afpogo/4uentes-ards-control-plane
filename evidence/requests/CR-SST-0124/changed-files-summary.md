# CR-SST-0124 Changed Files Summary

Date: 2026-07-07

## Runtime Implementation Scope

Implemented the MVP runtime URL affordance for native SST text articles in
`sst-fend`.

## sst-fend Files Touched For This Cut

Code:

- `src/pages/Articles/components/ArticleCreateFlow/ArticleCreateFlow.tsx`
- `src/pages/Articles/components/ArticleCreateFlow/styles.module.scss`
- `src/pages/Articles/components/ArticleCreateFlow/styles.module.scss.d.ts`
- `src/pages/Articles/components/ArticleFormView/ArticleFormView.i18n.ts`

Tests:

- `src/pages/Articles/components/ArticleCreateFlow/__tests__/ArticleCreateFlow.test.tsx`

Owner ARDS/SDD:

- `docs/33-articles-frontend.md`
- `specs/33-articles-frontend.yml`
- `docs/38-learning-workspace-frontend.md`
- `specs/38-learning-workspace-frontend.yml`

## Behavior

- Created native `text` articles now render a runtime URL derived as
  `{window.location.origin}/leafArticulo/{articleId}`.
- The URL uses the existing `leafArticulo/:id` redirect path into the article
  detail surface.
- Web articles continue to expose only their external source URL.
- The runtime URL is not persisted as `url` or `payload.data.sourceUrl`.

## Repository Note

`sst-fend` already had unrelated local changes before this cut. This evidence
only claims the files and behavior above for `CR-SST-0124`.

## Node Auth Missing URL Fix

Implemented the BFF correction for the authenticated QA blocker in
`4uentes-auth` (`node-auth` alias local).

Code:

- `src/domain/dtos/articulo/articulo.dto.ts`
- `src/presentation/articulo/controller.ts`
- `src/domain/entities/articulo/index.ts`
- `src/domain/constants/articulo.constants.ts`
- `src/infrastructure/mapperers/articulo.mapper.ts`

Owner ARDS/SDD:

- `docs/bf/03-routing.md`
- `specs/routing.yaml`
- `specs/integrations-api.yaml`
- `docs/capabilities/inbound/sst-bend--article-text-ingestion.md`
- `specs/capabilities/inbound/sst-bend--article-text-ingestion.yaml`
- `docs/capabilities/outbound/article-text-ingestion.md`
- `specs/capabilities/outbound/article-text-ingestion.yaml`

Behavior:

- Native SPA `text` articles with `payload.kind=text` and `payload.data={}`
  can omit `url/sourceUrl`.
- `web` creates and creates without `payload` still require `url/sourceUrl`.
- Optional `url/sourceUrl` on `text` remains URL-format validated.
- Create/idempotency body construction no longer includes `url` when absent.
- Response mapping accepts persisted `text` articles without a fake URL.
