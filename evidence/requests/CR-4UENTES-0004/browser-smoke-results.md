# Browser Smoke Results - CR-4UENTES-0004

## Status

Validated locally on 2026-07-04.

## Route Set

- `/`
- `/afpogo/me`
- `/afpogo/experience`
- `/afpogo/experience/company/giresa`
- `/afpogo/projects/all`
- `/afpogo/skills&certs`
- `/afpogo/contact`

## Initial Result

Before `CR-4UENTES-0005`, the preview server returned:

| Route | Result |
| --- | --- |
| `/` | 200 |
| `/afpogo/me` | 404 |
| `/afpogo/experience` | 404 |
| `/afpogo/experience/company/giresa` | 404 |
| `/afpogo/projects/all` | 404 |
| `/afpogo/skills&certs` | 404 |
| `/afpogo/contact` | 404 |

## Follow-Up Fix

`CR-4UENTES-0005` added an explicit local SPA fallback for Vite dev/preview.

## Final Result

After the fallback fix, every route returned HTTP 200 and the app HTML shell:

| Route | Result |
| --- | --- |
| `/` | 200, `has-app=true` |
| `/afpogo/me` | 200, `has-app=true` |
| `/afpogo/experience` | 200, `has-app=true` |
| `/afpogo/experience/company/giresa` | 200, `has-app=true` |
| `/afpogo/projects/all` | 200, `has-app=true` |
| `/afpogo/skills&certs` | 200, `has-app=true` |
| `/afpogo/contact` | 200, `has-app=true` |

Generated JS and CSS assets referenced by `/` also returned HTTP 200.

## Tooling Note

The in-app browser automation failed to initialize in this environment, so this
run used deterministic HTTP smoke against the local preview server. Screenshot
or interactive browser evidence remains a future publication-readiness
follow-up.
