# Reconciliación De Read Models De Phinance

Fecha: 2026-08-25.

## Resultado

Los read models estables del control plane ahora reflejan la cadena de
confianza publicada y validada por los owners. La reconciliación no modifica
runtime ni interpreta la QA local integrada como activación de un ambiente.

## Claims Reconciliados

- `finanzas-personales-backend` conserva su identidad canónica y pasa de draft
  histórico a servicio activo con baseline ARDS/SDD ready.
- El consumidor técnico del API es `sst-bend`; el navegador usa la fachada
  protegida de SST y no llama directamente a Phinance.
- `4uentes-auth` emite el grant exacto `sst-bend -> phinance-api /
  finance:invoke` y Phinance verifica RS256/JWKS antes de aceptar el principal.
- El proxy continúa detrás de `PHINANCE_PROXY_ENABLED=false` por defecto.
- La única observación de ejecución declarada es QA integrada local y efímera;
  no se declara deployment persistente ni producción.

## Superficies

- catálogo: `catalog/services/finanzas-personales-backend.yaml`;
- solución: `solutions/finanzas-personales.yaml`;
- Initiative: `initiatives/INIT-HPT-0002-personal-finance-instrument-operations-api.yaml`;
- state: `state/features/phinance-sst-trust-chain.current.yaml`;
- linkage: `state/00-index.yaml` y `state/capability-links.yaml`.

## Autoridad Owner

El control plane deriva estos claims de los merges y readbacks ya publicados
por `CR-SST-0216`, `CR-HPT-0017` y `CR-HPT-0018`. Las specs de `sst-bend`,
`finanzas-personales` y `4uentes-auth` siguen siendo autoridad del runtime y
sus contratos. Ningún repo hijo fue modificado por `CR-HPT-0020`.

## Trabajo Posterior

La activación de development requiere otro lifecycle que enumere ambiente,
owners, referencias de secretos, rollback y validación del runtime desplegado.
Jira `HPT-5` ya refleja la cadena publicada, por lo que este CR no requiere
escritura en el tracker.
