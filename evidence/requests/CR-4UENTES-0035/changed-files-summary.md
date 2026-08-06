# CR-4UENTES-0035 - Changed Files Summary

Fecha: 2026-07-07

## Repo Hijo

Repositorio: `4uentes-portfolio`

UI/runtime:

- `src/config/i18n.ts`
- `src/components/Footpart/styles.module.scss`
- `src/pages/Dashboard/components/ProjectCard/styles.module.scss`
- `src/pages/Dashboard/screens/Projects/Project.i18n.ts`
- `src/pages/Dashboard/screens/Projects/constants.ts`
- `src/pages/Dashboard/screens/Projects/index.tsx`
- `src/pages/Dashboard/screens/Projects/styles.module.scss`
- `src/pages/Dashboard/screens/Projects/components/FrontCardProject/index.tsx`
- `src/pages/Dashboard/screens/Projects/components/FrontCardProject/styles.module.scss`
- `src/pages/Dashboard/screens/Projects/components/BackCardProject/index.tsx`
- `src/pages/Dashboard/screens/Projects/components/BackCardProject/styles.module.scss`
- `src/pages/Dashboard/screens/Projects/components/ProjectFilterComponent/styles.module.scss`
- `src/pages/Dashboard/screens/Projects/components/ProjectLayout/styles.module.scss`

Owner docs/specs:

- `docs/evidence/README.md`
- `docs/portfolio-intent.md`
- `docs/qa/visual-checklist.md`
- `specs/features/00-index.yaml`

## Resumen

- Se agrego `roleSummary` al modelo local de proyectos.
- Se conecto el namespace i18n `projects`.
- Las cards muestran badge de evidencia, disponibilidad de repo, contribucion,
  resumen de evidencia y limite de claim.
- La accion de repositorio queda condicionada por `publicRepoAllowed`.
- Se ajusto layout de cards y filtros para reducir overflow mobile.
- Se corrigio el footer responsive para evitar solapamiento con contenido largo
  en rutas interiores.
- Se actualizaron owner docs/specs bajo owner enforcement.
