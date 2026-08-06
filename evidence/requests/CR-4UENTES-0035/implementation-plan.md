# CR-4UENTES-0035 - Plan De Implementacion

Fecha: 2026-07-07

## Objetivo

Mejorar la presentacion de proyectos para que un recruiter o revisor tecnico
entienda rapidamente que evidencia ofrece cada proyecto.

## Scope

Incluye:

- Tarjetas/listado de proyectos.
- Etiquetas visibles de evidencia.
- Rol/contribucion del usuario.
- Stack y disponibilidad de repo/demo.
- Limites de claims para no presentar demos como experiencia productiva.
- Owner docs/specs del repo hijo.

No incluye:

- Runtime GitHub fetching.
- Backend, BFF, auth o analytics.
- Claims de produccion, clientes, metricas o seniority no aprobados.
- Cambios de CV.
- Rehacer Home/Hero.
- Reescribir Experience o Skills/Certs.
- Remediation mobile por secciones.

## Owner Enforcement

El repo hijo debera actualizar docs/specs en el mismo lifecycle:

- `docs/evidence/README.md`
- `docs/portfolio-intent.md`
- `docs/qa/visual-checklist.md`
- `specs/features/00-index.yaml`

## Analisis De UI Actual

Archivos revisados en `4uentes-portfolio`:

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

Hallazgos:

- El modelo de datos ya incluye `evidenceLabel`, `evidenceDisplay`,
  `evidenceSummary`, `evidenceSource` y `publicRepoAllowed`.
- La UI ya muestra parcialmente evidencia en front/back, pero sin sistema visual
  consistente ni criterio claro de claims.
- El copy visible sigue hardcodeado y mezclado entre castellano e ingles.
- El boton de repositorio abre `repoUrl` directo desde el DOM y no respeta aun
  una regla visual explicita de allowlist/disponibilidad.
- Las cards usan flip 3D, altura fija y overflow interno; esto puede romper
  lectura mobile si se agregan mas textos sin ajustar layout.
- `Project.i18n.ts` esta vacio, por lo que el corte debe dejar preparada la
  base de internacionalizacion aunque no migre toda la seccion.

## Intencion De Arquitectura

El CR debe tratar la evidencia como metadata editorial versionada en el repo,
no como dato obtenido en runtime desde GitHub. La UI debe convertir esa metadata
en senales claras para recruiter/revisor tecnico:

- tipo de evidencia;
- disponibilidad de repositorio o demo;
- stack;
- alcance y limite del claim;
- texto breve de contexto.

La practica esperada es que cada proyecto pueda demostrar valor sin inflar la
experiencia laboral. Un demo publico debe quedar presentado como demo o practica;
una evidencia privada debe explicar el contexto sin exponer informacion sensible.

## Plan De Implementacion

1. Normalizar el modelo visible de evidencia.
   - Revisar `IPortfolioProject` y confirmar campos minimos.
   - Mantener allowlist explicita mediante `publicRepoAllowed`.
   - No agregar fetching automatico ni lectura dinamica de GitHub.

2. Mejorar la tarjeta de proyecto.
   - `FrontCardProject`: mostrar badge de evidencia, resumen corto y accion
     condicionada por disponibilidad publica.
   - `BackCardProject`: separar evidencia, stack y descripcion en bloques
     legibles; eliminar labels con errores o mezcla innecesaria de idioma.
   - `ProjectCard/styles.module.scss`: reducir riesgo mobile por altura fija,
     overflow y textos largos.

3. Preparar i18n incremental.
   - Poblar `Project.i18n.ts` con labels comunes de evidencia y acciones.
   - Usar traducciones para textos de UI nuevos.
   - Dejar migracion completa de contenido largo para CR posterior si excede
     este scope.

4. Actualizar owner docs/specs.
   - `docs/evidence/README.md`: documentar taxonomia visible, allowlist y
     limites de claims.
   - `docs/portfolio-intent.md`: registrar intencion recruiter/revisor tecnico.
   - `docs/qa/visual-checklist.md`: agregar checks de cards, textos largos y
     acciones de repo.
   - `specs/features/00-index.yaml`: registrar feature/capability del sistema
     de evidencia de proyectos.

5. Validar.
   - `4uentes-portfolio: npm.cmd run build`.
   - QA visual manual con Chrome DevTools MCP en desktop y mobile.
   - `4uentes-orchestor: npm.cmd run check`.

## Criterios De Aceptacion

- Cada card comunica el tipo de evidencia sin depender solo del flip.
- La accion al repositorio solo se presenta como publica cuando
  `publicRepoAllowed` lo permite.
- Los textos nuevos no rompen mobile ni quedan cortados de forma incoherente.
- No se introducen claims de produccion, clientes, metricas o seniority.
- El repo hijo queda con owner docs/specs actualizados en el mismo lifecycle.
- La evidencia de cierre incluye build, QA visual y check completo del
  control plane.
