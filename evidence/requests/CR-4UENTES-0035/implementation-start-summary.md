# CR-4UENTES-0035 - Inicio De Implementacion

Fecha: 2026-07-07

## Cambios Iniciados En Repo Hijo

Repositorio: `4uentes-portfolio`

Superficie modificada:

- UI de project cards.
- Namespace i18n `projects`.
- Modelo local de proyectos.
- Owner docs de evidencia, intencion y QA visual.
- Spec index de features.

## Intencion

Convertir las tarjetas de proyectos en una superficie de evidencia profesional
legible para recruiters y revisores tecnicos, sin presentar demos como entrega
productiva ni agregar integracion runtime con GitHub.

## Owner Enforcement

La mutacion del repo hijo incluye owner docs/specs en el mismo lifecycle:

- `docs/evidence/README.md`
- `docs/portfolio-intent.md`
- `docs/qa/visual-checklist.md`
- `specs/features/00-index.yaml`

## Validacion Pendiente

- `4uentes-portfolio: npm.cmd run build`
- QA visual manual con Chrome DevTools MCP
- `4uentes-orchestor: npm.cmd run check`
