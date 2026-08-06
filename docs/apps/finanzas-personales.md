# Finanzas Personales

## Proposito

`finanzas-personales` es una solucion logica independiente gobernada por el
control-plane global de 4uentes. Su Jira mirror usa el proyecto `HPT`, cuyo
nombre observado es `home-phinance-ticket`.

## Servicios

- `finanzas-personales-frontend`: experiencia web y contratos inbound.
- `finanzas-personales-backend`: API, persistencia y orquestacion de boundaries
  internos de calculo, OCR e IA.

Ambos servicios viven hoy en el mismo repositorio Git. La raiz del repositorio
no es un servicio adicional.

## Estado

La superficie actual es ARDS/SDD de producto en draft. No se observaron
runtimes, deployments ni rutas ejecutables de validacion.

## Boundaries

- La integracion directa frontend-web a backend-api requiere excepcion o una
  decision posterior de BFF.
- Python, OCR e IA no se catalogan como servicios hasta que exista ownership,
  contrato y evidencia runtime independiente.
- Auth, autorizacion, sharing, retencion y datos financieros sensibles requieren
  CRs de riesgo alto.
- El repo hijo conserva autoridad sobre specs y docs de comportamiento.

## Lifecycle

- `INIT-HPT-0001`: adopcion de gobernanza.
- `CR-HPT-0001`: onboarding del control-plane.
- `CR-HPT-0002`: adopcion de policies y owner baseline del repo hijo.
- `CR-HPT-0003`: reconciliacion del boundary frontend-backend.

