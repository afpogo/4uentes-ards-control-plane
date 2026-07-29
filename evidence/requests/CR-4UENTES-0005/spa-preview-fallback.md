# SPA Preview Fallback - CR-4UENTES-0005

## Problem

`CR-4UENTES-0004` found that `npm run preview` served `/` but returned 404 for
direct SPA routes such as `/afpogo/me` and `/afpogo/contact`.

## Intended Behavior

Local dev and preview should serve `index.html` for route-like GET requests that
are not static assets, so React Router can render the matching route.

## Boundary

This CR only changes local Vite middleware behavior and owner documentation.
Static hosting fallback behavior remains a deployment follow-up until the target
host is selected.

## Result

Completed. Local Vite dev and preview now serve the SPA shell for route-like
GET/HEAD requests that are not static assets.

Validated route set:

- `/`
- `/afpogo/me`
- `/afpogo/experience`
- `/afpogo/experience/company/giresa`
- `/afpogo/projects/all`
- `/afpogo/skills&certs`
- `/afpogo/contact`
