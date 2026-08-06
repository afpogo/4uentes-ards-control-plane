# CR-4UENTES-0022 - Implementation Summary

Fecha: 2026-07-05

## Objetivo

Migrar el copy visible de las cards de empresas de experiencia al namespace
I18N `experience`, manteniendo el alcance limitado a la lista de empresas.

## Implementacion

- Se agregaron claves I18N para company, address, jobtitle y workday por
  empresa.
- Se agrego clave I18N para el texto de accion de la card.
- `Experience/constants.ts` conserva datos estructurales y fallbacks legacy,
  pero agrega claves I18N por campo visible.
- `ExpBox` resuelve el texto visible desde `useTranslation('experience')` con
  fallback al valor previo.
- Fechas, imagenes y slugs quedan como datos estructurales fuera de I18N.

## Limites

- No se migran iniciativas ni detalle profundo de experiencia.
- No se altera contacto.
- No se reactiva descarga de CV.
- No se modifica el layout mobile de `CR-4UENTES-0027`.

## Politicas Aplicadas

- Request-driven child repo mutation.
- Owner documentation authority/enforcement.
- Human-facing documentation policy: evidencia operativa en espanol.
- Atomizacion: corte chico sobre company cards antes de iniciativas/logros.

Pendiente.
