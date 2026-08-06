# CR-SST-0123 LearningContext / Article Separation Capability

Date: 2026-07-07

## Decision

`LearningContext` and `Article` are separate product/runtime concepts.

- `Article`: live SST resource, catalog entry, title, description, optional
  external source URL, ArticleTags and article lifecycle.
- `LearningContext`: accepted learning material, source text, fragments,
  annotations, content blocks, relevance, preview/accept/reject state and
  provenance.

The frontend UX for `SST-52` can test and design the real content-generation
sheet against `LearningContext` without requiring that every draft already be a
persisted Article.

## Backend Producer Capability

Owner: `sst-bend`

Updated:

- `specs/capabilities/outbound/learning-workspace-context.yaml`
- `docs/capabilities/outbound/learning-workspace-context.md`

Contract clarified:

- LearningWorkspace preview/accept does not require Article creation.
- LearningWorkspace preview/accept does not require external `sourceUrl`.
- `originArticleId` is optional provenance/linkage, not a required source
  identity.
- Accepted LearningContext can later link to an Article, but the Article is not
  the LearningContext itself.
- `ArticleTag` remains article-wide; `LearningContentTag` and `relevance`
  apply to fragments/content blocks.

## BFF Consumer Capability

Owner: `node-auth`

Updated:

- `specs/capabilities/inbound/sst-bend--learning-workspace-context.yaml`
- `docs/capabilities/inbound/sst-bend--learning-workspace-context.md`

Contract clarified:

- BFF remains a thin authenticated passthrough for LearningWorkspace.
- BFF must not convert LearningContext payloads into Article CRUD requests.
- BFF must not require `articleId`, `url` or `sourceUrl` for
  LearningWorkspace preview/accept payloads.
- BFF preserves optional `originArticleId` when present.

## Frontend Guidance For SST-52 QA

The frontend can validate the sheet UX as a LearningContext surface:

- write/paste/import text into a real sheet;
- select lines, paragraphs, ranges, blocks, headers, footers or document scope;
- attach LearningContentTag/relevance to fragments;
- generate preview;
- accept/reject preview explicitly;
- render accepted context separately from ArticleTag/article metadata.

The Article resource can be linked later through `originArticleId` or another
governed association, but should not be required for the first UX validation.

## Relation To SST-53

`SST-53 / CR-SST-0124` remains a separate Article runtime issue: creating a
native `text` Article without external URL currently hits runtime
`400 {"error":"Missing url"}` in authenticated QA.

That blocker should not prevent `SST-52` UX testing of the LearningContext
sheet, as long as the test path uses LearningWorkspace preview/accept/context
directly and does not depend on `POST /api/articulos` creating the Article.

