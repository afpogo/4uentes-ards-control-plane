# CR-4UENTES-0023 - Implementation Summary

Fecha: 2026-07-05

## Objetivo

Migrar el copy visible de iniciativas/logros del detalle de experiencia al
namespace I18N `experience`, manteniendo el alcance limitado al detalle de
empresas.

## Implementacion

- Se agregaron claves I18N para titulo, resumen funcional y logros por
  iniciativa.
- Se agregaron claves I18N para etiquetas de la card de detalle:
  `Logros`, `Tecnologias`, `ver mas ...` y `ver menos`.
- `ExperienceCompany/constants.tsx` conserva textos previos como fallback y
  agrega claves I18N por campo visible.
- `FrontCardExperience` y `BackCardExperience` resuelven copy visible desde
  `useTranslation('experience')`.
- El header del detalle reutiliza las claves I18N de company cards agregadas en
  `CR-4UENTES-0022`.
- Fotos y tecnologias quedan como evidencia/datos estructurales, no traducidos
  en este corte.

## Limites

- No se agregan claims, metricas ni impacto nuevo.
- No se altera contacto.
- No se reactiva descarga de CV.
- No se modifica el layout mobile.
- No se ejecuta QA bilingue completa; queda para `CR-4UENTES-0024`.

## Politicas Aplicadas

- Request-driven child repo mutation.
- Owner documentation authority/enforcement.
- Human-facing documentation policy: evidencia operativa en espanol.
- Atomizacion: iniciativas/logros se migran despues de company cards y antes
  de QA bilingue.
