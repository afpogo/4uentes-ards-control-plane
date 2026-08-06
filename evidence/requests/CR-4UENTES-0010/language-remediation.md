# Remediacion De Idioma - CR-4UENTES-0010

## Problema

La policy `human-doc-language` esta activa, pero parte de la documentacion
humana reciente quedo escrita en ingles.

## Causa

La policy estaba registrada y documentada, pero su cumplimiento era operativo:
los validadores actuales no detectan prosa en ingles dentro de Markdown humano.

## Decision

- Traducir prosa humana reciente a espanol.
- Conservar identificadores estables, comandos, rutas, nombres de archivos,
  IDs de requests, IDs de servicios y estados tecnicos en su forma original.
- No mover la policy al catalogo de servicios.
- Hacer la policy visible desde las vistas de proyecto y control-plane.

## Seguimiento Recomendado

Agregar un validador liviano de idioma para Markdown humano, con lista de
excepciones para `AGENTS.md`, `docs/ai/`, comandos, IDs y paths.
