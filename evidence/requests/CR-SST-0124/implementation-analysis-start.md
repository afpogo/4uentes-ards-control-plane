# CR-SST-0124 Implementation Analysis Start

Date: 2026-07-07

## Intent

Create the first MVP slice for native SST text articles that have no external
URL. After creation, the user should be able to open the article in the web app
through a local/runtime URL.

## Working Proposal

Use a derived runtime URL in the frontend instead of persisting a fake external
URL:

```text
{runtimeOrigin}/articulos/{articleId}
```

If the existing router does not support that exact path, analysis may choose
the smallest existing-compatible pattern, for example:

```text
{runtimeOrigin}/articulos?articleId={articleId}
```

The selected route/link must be documented in owner ARDS/SDD.

## Acceptance Checks

- Native text article creation remains valid when URL is blank.
- Create-result UI exposes an "open in SST" style action for the new article.
- The runtime URL opens the article from the browser on localhost and does not
  require an external source.
- The article payload does not persist the runtime URL as `url` or
  `payload.data.sourceUrl`.
- Web/source articles keep their existing URL behavior.

## Initial Boundary Decision

Start in `sst-fend`. Escalate to `node-auth` or `sst-bend` only if the frontend
cannot derive a stable runtime URL from the article id and runtime origin.

