# CR-SST-0085 - Readiness Jira

## Estado

- Proyecto esperado: `SST`
- Tipo esperado para mirror: `Epic`
- Source of truth: `4uentes-orchestor`
- Rol Jira: mirror operativo
- Escritura Jira ejecutada: no

## Observacion

Durante la planificacion previa se probo el MCP de Atlassian con busqueda
read-only y devolvio `403` con mensaje de app no instalada en la instancia.

Ese bloqueo no impide la adopcion local de `Initiative`, pero si impide crear
o reconciliar una Epic real hasta resolver acceso y aprobar una escritura
explicita.

## Regla

La futura Epic Jira debe reflejar `INIT-CP-0001`. No debe asignar autoridad
ARDS/SDD ni cerrar la Initiative sin evidencia local.
