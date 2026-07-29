# Proyecto 4uentes

## Alcance

Contenedor para activos publicos y profesionales bajo la solucion `4uentes`.

Hoy incluye:

- `4uentes-portfolio`
- publicacion profesional del usuario
- evidencia visible de proyectos, experiencia, certificados, CV y contacto

## Artefactos Canonicos

- Catalogo: [../../../catalog/services/4uentes-portfolio.yaml](../../../catalog/services/4uentes-portfolio.yaml)
- Solucion: [../../../solutions/4uentes.yaml](../../../solutions/4uentes.yaml)
- App doc: [../../apps/4uentes-portfolio.md](../../apps/4uentes-portfolio.md)
- Particion de scope: [../../cross-repo/control-plane-scope-partition.md](../../cross-repo/control-plane-scope-partition.md)

## Politicas Aplicables

- [human-doc-language](../../policies/human-doc-language-policy.md): prosa
  humana en espanol; IDs, comandos, paths y nombres tecnicos estables no se
  traducen.

## Iniciativa

- [INIT-PORTFOLIO-0001](../../../initiatives/INIT-PORTFOLIO-0001-portfolio-publication-readiness.yaml)

## Requests

- [CR-4UENTES-0001](../../../requests/planned/CR-4UENTES-0001-portfolio-scope-partition-onboarding.yaml): scope partition onboarding.
- [CR-4UENTES-0002](../../../requests/planned/CR-4UENTES-0002-portfolio-owner-docs-scope-reconciliation.yaml): owner docs reconciliation.
- [CR-4UENTES-0003](../../../requests/planned/CR-4UENTES-0003-portfolio-local-stabilization-baseline.yaml): local stabilization baseline.
- [CR-4UENTES-0004](../../../requests/planned/CR-4UENTES-0004-portfolio-browser-smoke-baseline.yaml): browser/route smoke baseline.
- [CR-4UENTES-0005](../../../requests/planned/CR-4UENTES-0005-portfolio-spa-preview-fallback.yaml): SPA preview fallback.
- [CR-4UENTES-0006](../../../requests/planned/CR-4UENTES-0006-portfolio-validation-warning-remediation.yaml): validation warning remediation.
- [CR-4UENTES-0008](../../../requests/planned/CR-4UENTES-0008-portfolio-positioning-and-evidence-taxonomy.yaml): positioning and evidence taxonomy.

## Baseline Actual

- `4uentes-portfolio` pertenece a `4uentes`, no a `sst`.
- El repo hijo conserva autoridad sobre comportamiento frontend.
- El control-plane conserva autoridad sobre catalogo, requests, state,
  evidence e iniciativas.
- `npm.cmd run check` pasa en el control-plane sin warnings.

## Gaps Siguientes

- Aplicar posicionamiento employment-first y taxonomia de evidencia al repo hijo.
- Resolver evidencia visual con screenshots o Lighthouse cuando el browser
  tooling este disponible.
- Definir deploy target, URL publica y fallback de rutas en hosting.
- Definir minimo mobile antes de promocion publica.
