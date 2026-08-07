# Gap Del Allowlist Del Tren Estable

## Resultado

La revalidacion posterior al PR #4 confirmo que las bases remotas no cambiaron,
pero el allowlist reducido contiene patrones que expanden a cero rutas y omite
wiring obligatorio ya atribuido a los CRs estables. Preparar un candidato con
ese manifest produciria codigo incompleto o owner docs no descubribles.

No se modifico ningun repo hijo a partir de este hallazgo. Los tres worktrees
aislados permanecen sobre sus bases gobernadas; el unico delta preexistente es
el commit seguro de body limits de `4uentes-auth` ya registrado por el manifest.

## Correcciones Necesarias

### sst-bend

- Reemplazar el patron inexistente de migracion Learning por la migracion y los
  modelos reales de annotation refs.
- Incluir use cases, factory, controller y repositorios necesarios para article
  semantics, retiro de filtros y convergencia Plaud.
- Restaurar indices y owner docs requeridos por el baseline ARDS/SDD.
- Mantener seleccion por hunk para retirar toda referencia preview.

### 4uentes-auth

- Corregir el ref fuente observado.
- Incluir DTOs, entity barrel, `routes.ts` e indices de capabilities.
- Corregir nombres reales de scripts de validacion.
- Permitir `.env.example` y `src/configs/env.ts` para el commit gobernado de
  body limits, manteniendo `.env` y secretos excluidos.

### sst-fend

- Reemplazar rutas inexistentes de Home, services y routes por las rutas reales.
- Incluir indices ARDS/SDD, shared sheet, action wiring y capabilities inbound.
- Convertir el report source-type con `request_id: TODO` al artefacto gobernado
  por `CR-SST-0154` y conservar `CR-SST-0153` como unidad separada.
- Mantener preview, `SstInfoPill`, CR-SST-0149 y hunks de formato fuera del tren.

## Gate

El PR #5 del control plane debe recibir merge humano con este allowlist antes de
mutar repos hijos. Luego se revalidan otra vez los SHAs y se reanuda la
recomposicion serial.
