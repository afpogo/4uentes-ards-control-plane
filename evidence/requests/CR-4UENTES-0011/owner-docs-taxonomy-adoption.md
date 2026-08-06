# Adopcion De Taxonomia En Owner Docs - CR-4UENTES-0011

## Decision

Este CR adopta en `4uentes-portfolio` la taxonomia definida por
`CR-4UENTES-0008` antes de mutar contenido visible.

El alcance queda limitado a owner docs y specs locales del repo hijo. No se
modifican componentes React, constantes visibles, assets, datos de contacto,
deploy ni integracion runtime con GitHub.

## Taxonomia Adoptada

- `professional_experience`: historial laboral, rol, contexto, responsabilidad,
  stack, alcance e impacto aprobado por el owner.
- `public_project_evidence`: proyectos publicos inspeccionables por reclutadores,
  lideres tecnicos, clientes o colaboradores.
- `demo_or_learning`: proyectos o ejercicios que muestran practica, aprendizaje
  o exploracion, sin presentarlos como evidencia senior de produccion.
- `certification_support`: certificados y conocimiento formal que respaldan
  skills, sin reemplazar evidencia de experiencia o proyecto.
- `private_enterprise_evidence`: trabajo empresarial que solo puede describirse
  en alto nivel sin exponer sistemas, clientes ni informacion confidencial.
- `contact_asset`: email, telefono, ubicacion, CV, GitHub, LinkedIn y otros
  activos de contacto que requieren politica explicita de exposicion publica.

## Orden De Aplicacion

1. Adoptar la taxonomia en owner docs.
2. Etiquetar evidencia de proyectos en un CR posterior.
3. Revisar copy visible de experiencia en un CR posterior.
4. Definir politica de exposicion de contacto en un CR posterior.
5. Revisar GitHub solo con allowlist explicita de repositorios.

## Guardrails

- No inferir seniority, impacto productivo, clientes ni uso en produccion solo a
  partir de repositorios GitHub.
- No publicar datos privados, informacion confidencial ni actividad personal
  inferida.
- No publicar copy generado por IA sin revision del owner.
- Mantener GitHub como revision editorial o snapshot build-time aprobado; no
  introducir fetching runtime en el frontend actual.
