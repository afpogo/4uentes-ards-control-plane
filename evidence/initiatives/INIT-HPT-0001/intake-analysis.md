# Analisis De Intake De Home Phinance Ticket

Fecha: 2026-07-12

## Resultado

El repositorio `finanzas-personales` puede incorporarse al control-plane como
una solucion logica independiente con dos servicios: frontend web y backend
API. El repositorio raiz funciona como workspace/monorepo y no debe catalogarse
como un tercer servicio ni como control-plane.

## Identidades

- Solucion logica: `finanzas-personales`.
- Servicio frontend: `finanzas-personales-frontend`.
- Servicio backend: `finanzas-personales-backend`.
- Namespace ARDS/SDD y Jira: `HPT`.
- Proyecto Jira observado: `home-phinance-ticket`.
- Repositorio owner observado: `finanzas-personales`.

El nombre Jira conserva `phinance` porque es el nombre existente del proyecto.
Las identidades logicas nuevas usan `finanzas-personales` y no heredan ese typo.

## Arquitectura Observada

- `frontend/` declara el perfil `frontend-web`.
- `backend/` declara el perfil `backend-api`.
- No existe implementacion runtime ni ruta de validacion ejecutable.
- Python, OCR e IA son boundaries propuestos, no servicios desplegables
  observados.
- El consumo directo `frontend-web -> backend-api` requiere una excepcion
  arquitectonica o una decision posterior de BFF.

## Policies Aplicadas

- Jira es mirror; el control-plane conserva source of truth.
- La Initiative debe existir antes de la Epic y cada CR antes de su Tarea.
- Los cambios futuros en el repo hijo deben actualizar owner docs/specs.
- La adopcion de policies y `control_plane_link` es request-driven.
- El trabajo se atomiza en onboarding, adopcion del repo hijo y contrato de
  integracion.
- Las decisiones de seguridad, auth, permisos y datos financieros no se
  delegan ni se cierran en el onboarding.

## Riesgos

- Datos financieros y comprobantes son sensibles.
- Auth, sharing permissions y retencion siguen sin decision final.
- El technical owner y la responsabilidad de release siguen como `TODO`.
- El estado `synced` del backend no refleja el common policy runtime actual.

