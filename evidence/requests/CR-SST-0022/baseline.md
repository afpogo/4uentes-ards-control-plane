# CR-SST-0022 - Baseline

Observado el: 2026-05-31

## Control Plane

`4uentes-orchestor` ya tenia un working tree dirty antes de este request. Este
request agrega artefactos nuevos de lifecycle/evidencia y no revierte cambios
existentes.

## Repo Hijo

`sst-chatbot` ya tenia cambios dirty antes de CR-SST-0022. Parte de esos
cambios pertenecen a CR-SST-0021 y parte son preexistentes fuera de este scope.

## Boundary

No existe `4uentes-ards-core` como repo aplicable para este flujo. Por eso esta
Ruta B mantiene contratos locales en `sst-chatbot`, gobernados por evidencia y
request lifecycle en `4uentes-orchestor`.
