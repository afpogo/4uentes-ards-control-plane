# Resultado de QA visual y HTTP

Fecha: 2026-09-05. Artefacto: build local de `11b1f67`.

HTTP mediante un servidor estático sin fallback SPA para archivos faltantes:

- `GET /`: `200 text/html`.
- `GET /pdfs/afpogo_cv.pdf`: `404`.
- `HEAD /pdfs/afpogo_cv.pdf`: `404`.

La superficie de navegador integrada no estuvo disponible por falta del
contexto de sandbox requerido. Se utilizó Chrome headless local sobre el mismo
artefacto en `1440x1000` y `390x844`:

- el CTA del CV no aparece en desktop ni mobile;
- la acción principal de Home permanece visible;
- no se observó una regresión causada por este slice sin cambios de estilos;
- existe overflow mobile previo en el nombre y footer, fuera del alcance de
  este slice y bloqueante para la promoción estable.

Las dos capturas temporales contenían imágenes personales ya renderizadas por
el sitio. Fueron inspeccionadas localmente y eliminadas después del QA; no se
commitearon ni publicaron.
