# INIT-PORTFOLIO-0002 - Mobile Section Readiness

Fecha: 2026-07-05

## Decision

Se crea una nueva Initiative para tratar los problemas mobile observados en
secciones internas del portfolio.

## Motivo

`CR-4UENTES-0027` resolvio el primer shell mobile y elimino el blocker
desktop-only. La revision manual posterior indica que algunas secciones no
quedaron bien en mobile. Eso ya no es el mismo problema que el shell: requiere
auditar, priorizar y corregir secciones especificas.

## Politicas Aplicadas

- `Initiative ~= Jira Epic`: la Initiative local es fuente de verdad; Jira sera
  espejo operativo.
- Owner documentation enforcement: cada CR que mute `4uentes-portfolio` debe
  actualizar owner docs/specs o registrar excepcion antes del cierre.
- Atomizacion: no se hara un CR gigante de "arreglar mobile"; se separa por
  auditoria, secciones y cierre QA.
- Boundary: no pertenece a SST y no modifica core.

## Alcance Inicial Propuesto

- `CR-4UENTES-0028`: auditoria mobile y descomposicion del backlog.
- `CR-4UENTES-0029`: remediation mobile de experiencia.
- `CR-4UENTES-0030`: remediation mobile de proyectos y skills.
- `CR-4UENTES-0031`: remediation mobile de contacto y flujo CV CTA.
- `CR-4UENTES-0032`: QA visual cross-route mobile.

## Fuera De Alcance

- Activar descarga de CV sin PDF sanitizado aprobado.
- Reescribir narrativa profesional.
- Cambiar scope SST/4uentes.
- Reabrir `CR-4UENTES-0027` salvo que cambie el contrato del shell.
