# CR-4UENTES-0035 - Analisis Actual De UI De Proyectos

Fecha: 2026-07-07

## Resumen

La seccion de proyectos de `4uentes-portfolio` ya contiene campos de evidencia
en el modelo de datos, pero la experiencia visible todavia no funciona como un
sistema consistente de evidencia profesional.

## Archivos Revisados

- `src/pages/Dashboard/screens/Projects/constants.ts`
- `src/pages/Dashboard/screens/Projects/index.tsx`
- `src/pages/Dashboard/screens/Projects/Project.i18n.ts`
- `src/pages/Dashboard/screens/Projects/components/ProjectLayout/index.tsx`
- `src/pages/Dashboard/screens/Projects/components/ProjectLayout/styles.module.scss`
- `src/pages/Dashboard/components/ProjectCard/index.tsx`
- `src/pages/Dashboard/components/ProjectCard/styles.module.scss`
- `src/pages/Dashboard/screens/Projects/components/FrontCardProject/index.tsx`
- `src/pages/Dashboard/screens/Projects/components/FrontCardProject/styles.module.scss`
- `src/pages/Dashboard/screens/Projects/components/BackCardProject/index.tsx`
- `src/pages/Dashboard/screens/Projects/components/BackCardProject/styles.module.scss`

## Hallazgos

- `IPortfolioProject` ya define `evidenceLabel`, `evidenceDisplay`,
  `evidenceSummary`, `evidenceSource` y `publicRepoAllowed`.
- `FrontCardProject` muestra `evidenceDisplay`, pero todavia lo trata como un
  texto suelto dentro de la card.
- `BackCardProject` muestra un bloque de evidencia, stack y descripcion, pero
  mantiene labels hardcodeados y mezcla castellano/ingles.
- `Project.i18n.ts` esta vacio, por lo que las nuevas etiquetas deben pasar por
  una base i18n incremental.
- `ProjectCard` usa flip 3D con altura fija, card interna al 80% y `overflow:
  auto`; agregar mas texto sin ajustar layout puede empeorar mobile.
- La accion `ir al repositorio` abre directamente el `repoUrl` y no expresa
  todavia una politica visible de allowlist/disponibilidad.

## Decision

Implementar el CR como sistema editorial de evidencia visible, no como
integracion runtime con GitHub. El valor se obtiene al explicar que evidencia
representa cada proyecto y que claims quedan limitados.

## Riesgos

- Sobrecargar cards existentes con mas texto.
- Presentar demos publicos como evidencia productiva.
- Agregar copy nuevo fuera de i18n.
- Exponer repositorios o contexto privado sin allowlist explicita.
