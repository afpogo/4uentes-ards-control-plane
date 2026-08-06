# CR-CP-0017 — Intake De Conformidad ARDS/SDD v1

Fecha: 2026-07-19

## Decisión De Autoridad

- `ARDS-SDD/standar` es corpus de intención que alimenta al Core.
- La arquitectura v1 es el objetivo actual de validación y enforcement.
- La v2 representa la dirección futura y definitiva, pero queda fuera de este CR.
- `4uentes-ards-core` conserva la autoridad canónica operativa.
- El Control Plane conserva lifecycle, análisis, evidencia y handoff.

## Baseline Observado

- Core `npm.cmd run check`: PASS, 0 errores y 0 warnings del validador.
- Control Plane `npm.cmd run check`: PASS, 0 WARN y 0 FAIL.
- Los checks actuales prueban principalmente estructura, links, YAML, living
  resources y reglas operativas acotadas.
- La conformidad semántica completa de policies, CR lifecycle, Evidence,
  Capabilities y drift todavía no está cubierta de punta a punta.
- El documento v1 aún debe convertirse en reglas normativas identificables y
  trazables antes de alimentar enforcement de runtime.

## Alcance Del CR

Este CR producirá una matriz `regla v1 -> artefacto -> adopción -> check ->
resultado`, clasificando cada obligación como cumplida, implementada sin prueba,
gap o futura v2.

No modifica Core, el corpus de intención, GitHub, runtime ni repos hijos.
