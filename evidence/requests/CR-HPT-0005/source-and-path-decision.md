# Decisión De Fuente, Identidad Y Paths

Fecha de observación: 2026-08-21

## Decisión

Se conserva una sola identidad productora y un solo binding runtime:

- identidad canónica: `finanzas-personales-backend`;
- repo owner: `finanzas-personales`;
- service root: `backend/`;
- binding local vigente: el checkout del monorepo registrado en
  `environments/local/bindings.local.yaml`.

El directorio de Alphinance se registra solamente como fuente observada en esta
evidencia. No se agrega al catálogo, a la solución ni como segundo binding de
`finanzas-personales-backend`.

## Fuentes Locales Observadas

- Snapshot Alphinance:
  `F:\SST\cursos\Alph-ards-sdd`.
- Backend owner de finanzas personales:
  `C:\Users\andre\Desktop\4uentes\apps\Finanzas-personales\finanzas-personales\backend`.

Los paths absolutos aparecen aquí porque `evidence/` admite observación local.
No se copiaron a `catalog/`, `solutions/`, Initiatives ni requests.

## Hechos Sobre Alphinance

- No es un checkout Git observable y no contiene runtime verificable.
- Es un snapshot documental con `backend/`, `frontend/`, specs y docs.
- Sus índices conservan referencias a `src/backend` y `src/frontend` que no
  existen dentro del snapshot.
- `docs/ards-stash-archive/` contiene material histórico duplicado y queda fuera
  del baseline comparativo.
- Sus contratos no se promueven a canon ni se copian al control plane.

## Regla De Importación

Un aprendizaje de Alphinance sólo puede llegar al producto mediante una nueva
decisión owned por `finanzas-personales-backend`, con contrato, validación y
trazabilidad propios. La procedencia se referencia; el archivo fuente no se
duplica.
