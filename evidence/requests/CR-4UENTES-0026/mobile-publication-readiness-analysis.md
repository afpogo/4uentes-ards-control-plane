# CR-4UENTES-0026 - Mobile Publication Readiness Analysis

## Resultado

Mobile es un blocker de publicacion, pero este corte no implementa el fix. El
objetivo es dejar claro el alcance antes de mutar el repo hijo.

## Evidencia Actual

Owner docs ya declaran mobile como requisito:

- `docs/architecture/README.md`: mobile support is a publication requirement.
- `docs/portfolio-intent.md`: el portfolio debe ser usable en mobile con una
  experiencia lineal.
- `docs/qa/visual-checklist.md`: mobile behavior remains a TODO.

La implementacion actual en `src/components/PortFolioLayout/index.tsx` muestra
una rama mobile con mensaje desktop-only:

- "Lo sentimos,"
- "La vista esta disponible solamente para la version Desktop."

Eso significa que rutas internas como `/afpogo/me`, `/afpogo/experience`,
`/afpogo/projects`, `/afpogo/skills&certs` y `/afpogo/contact` no tienen una
experiencia mobile publicable.

## Riesgo De Producto

Para un portfolio profesional, mobile no es cosmetico. Reclutadores, hiring
managers o contactos pueden abrir el sitio desde telefono. Un bloqueo
desktop-only reduce confianza y puede impedir que vean experiencia, contacto o
evidencia.

## Alcance Recomendado Del Fix

El siguiente CR de implementacion deberia construir una experiencia mobile
lineal, no un rediseño completo:

- Header compacto con nombre, rol y accion de volver al home.
- Navegacion simple por links verticales.
- Contenido de cada ruta en una columna.
- Scroll vertical nativo.
- Mantener CV deshabilitado hasta asset sanitizado.
- Mantener contacto con politica actual.
- Evitar hover-only interactions como requisito para ver evidencia critica.

## Rutas Minimas Para QA Mobile

- `/`
- `/afpogo/me`
- `/afpogo/experience`
- `/afpogo/experience/company/giresa`
- `/afpogo/projects/all`
- `/afpogo/skills&certs`
- `/afpogo/contact`

## Criterio De Cierre Del Proximo CR

- No aparece mensaje desktop-only en mobile.
- Todas las rutas minimas renderizan contenido.
- No hay overflow horizontal incoherente.
- La navegacion es tactil y visible.
- Contacto mantiene politica de exposicion.
- CV sigue bloqueado si no hay PDF sanitizado.
- Chrome DevTools mobile viewport QA queda registrada.
