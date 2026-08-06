# CR-4UENTES-0007 - Manual QA Results

## Session

- Tooling: Chrome DevTools MCP.
- Initial command: `npm run dev`.
- Initial configured port: `4090`.
- Actual portfolio QA port: `4190`.

## Initial Findings

`http://localhost:4090` was already serving a different SST app, so the
portfolio dev server was restarted on `http://localhost:4190`.

The first portfolio load showed a blank page. Chrome console reported module
MIME errors because missing module paths could receive SPA fallback HTML.

Evidence:

- `home-blank-runtime-error.png`

## Root Cause

The local SPA fallback accepted `*/*`, which is also used by module import
requests. A missing or unresolved module path could receive `index.html` with
`text/html`, causing Chrome to reject it as a JavaScript module.

The first fallback fix removed the module MIME error but exposed a second dev
runtime issue: raw `index.html` was served without Vite's React Refresh
preamble. The dev fallback now uses `server.transformIndexHtml(...)`.

## Fix Validation

- Portfolio dev server validated on `http://localhost:4192`.
- Home renders after fallback fix.
- Console no longer shows module MIME errors.
- Console no longer shows React Refresh preamble errors.
- Remaining warning: React Router future flag warning for v7 transition
  behavior.
- Missing browser script-style module request returns `404` instead of fallback
  HTML.
- Document navigation for `/afpogo/me` returns transformed HTML with React
  Refresh preamble.

Evidence:

- `home-fixed-dev-render-viewport.png`
- `contact-policy-visible-viewport.png`

## Route Smoke

| Route | Result | Notes |
| --- | --- | --- |
| `/` | Pass | Home renders, CV button remains disabled. |
| `/afpogo/me` | Pass | Professional profile renders. |
| `/afpogo/experience` | Pass with review note | Cards render; public copy still exposes granular company addresses. |
| `/afpogo/experience/company/giresa` | Pass with review note | Detail renders; company address remains granular. |
| `/afpogo/projects` | Pass | Redirects to `/afpogo/projects/all`. |
| `/afpogo/projects/all` | Pass | Project evidence labels render as demo/aprendizaje. |
| `/afpogo/skills&certs` | Pass | Skills/certificates view renders. |
| `/afpogo/contact` | Pass | Contact policy is visible: general location, email, GitHub, LinkedIn; no phone, granular personal address, or CV download. |

## Follow-Up Findings

- React Router v7 future flag warning is non-blocking but should be tracked if
  console cleanliness becomes a publication gate.
- Experience screens expose exact company office addresses. This is not the same
  as personal contact exposure, but it should be reviewed as public portfolio
  copy before broad publication.
- Full-page Chrome screenshot timed out once; viewport screenshot succeeded.

## Status

Manual QA baseline is unblocked and local route smoke passed with follow-up
notes.
