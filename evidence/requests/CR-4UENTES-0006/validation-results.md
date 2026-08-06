# Validation Results - CR-4UENTES-0006

## Status

Passed on 2026-07-04.

## Portfolio Validation

Command:

```bash
npm.cmd run check
```

Result:

- Passed.
- Vite chunk-size warning no longer appears.
- Main JS asset after lazy loading: `dist/assets/index-ONtrlpv0.js`, about
  463.92 kB.
- Build emitted route-specific chunks for dashboard screens.

## Route Smoke

After preview restart, all documented routes returned HTTP 200 with the app HTML
shell:

- `/`
- `/afpogo/me`
- `/afpogo/experience`
- `/afpogo/experience/company/giresa`
- `/afpogo/projects/all`
- `/afpogo/skills&certs`
- `/afpogo/contact`

Generated asset files in `dist/assets`: 22.

## Control-Plane Validation

Command:

```bash
npm.cmd run check
```

Result:

- Passed.
- Local bindings summary: 39 OK, 0 WARN, 0 FAIL.
- State model and capability links passed.
- Owner documentation gate validated `CR-4UENTES-0006`.
