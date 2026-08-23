# Finanzas Personales

## Proposito

`finanzas-personales` es una solucion logica independiente gobernada por el
control-plane global de 4uentes. Su Jira mirror usa el proyecto `HPT`, cuyo
nombre observado es `home-phinance-ticket`.

## Servicios

- `finanzas-personales-backend`: Phinance-API, persistencia y boundaries
  internos de cálculo.
- `finanzas-personales-frontend`: identidad histórica deprecada; no es un
  runtime activo.

`sst-fend` posee la experiencia web como servicio de la solución SST y consume
Phinance-API mediante un boundary autenticado todavía contract-pending. La raíz
del repositorio HPT no es un servicio adicional.

## Estado

La superficie actual es ARDS/SDD de producto en draft. No se observaron
runtimes, deployments ni rutas ejecutables de validacion.

## Boundaries

- SST debe resolver la cuenta activa, validar membership y entregar a HPT un
  contexto confiable; HPT no acepta `account_id` ni owner desde body o query.
- El mecanismo interno de handoff entre SST y Phinance-API debe cerrarse antes
  de implementar runtime.
- Python, OCR e IA no se catalogan como servicios hasta que exista ownership,
  contrato y evidencia runtime independiente.
- Auth, autorizacion, sharing, retencion y datos financieros sensibles requieren
  CRs de riesgo alto.
- El repo hijo conserva autoridad sobre specs y docs de comportamiento.

## Lifecycle

- `INIT-HPT-0001`: adopcion de gobernanza.
- `CR-HPT-0001`: onboarding del control-plane.
- `CR-HPT-0002`: adopcion de policies y owner baseline del repo hijo.
- `CR-HPT-0003`: reconciliación del boundary SST-HPT y del aislamiento
  multicuenta.
