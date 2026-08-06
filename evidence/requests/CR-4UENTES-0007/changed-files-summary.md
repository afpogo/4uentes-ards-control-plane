# CR-4UENTES-0007 - Changed Files Summary

## Control Plane

- `requests/inbox/CR-4UENTES-0007-portfolio-visual-screenshot-and-publication-qa.yaml`
- `requests/planned/CR-4UENTES-0007-portfolio-visual-screenshot-and-publication-qa.yaml`
- `state/features/portfolio-visual-screenshot-publication-qa.current.yaml`
- `state/00-index.yaml`
- `state/capability-links.yaml`
- `initiatives/INIT-PORTFOLIO-0001-portfolio-publication-readiness.yaml`
- `evidence/requests/CR-4UENTES-0007/manual-qa-results.md`
- `evidence/requests/CR-4UENTES-0007/changed-files-summary.md`
- `evidence/requests/CR-4UENTES-0007/validation-results.md`
- `evidence/requests/CR-4UENTES-0007/home-blank-runtime-error.png`
- `evidence/requests/CR-4UENTES-0007/home-fixed-dev-render-viewport.png`
- `evidence/requests/CR-4UENTES-0007/contact-policy-visible-viewport.png`

## Child Repo

- `4uentes-portfolio: vite.config.mts`
- `4uentes-portfolio: docs/qa/visual-checklist.md`
- `4uentes-portfolio: docs/qa/stabilization-checklist.md`
- `4uentes-portfolio: specs/features/00-index.yaml`

## Runtime Behavior

- Dev SPA fallback no longer serves raw `index.html` for browser script/module
  requests.
- Dev SPA fallback uses Vite HTML transformation for document navigation, so
  React Refresh preamble is preserved.
- Production build behavior remains governed by Vite build output and preview
  fallback.
