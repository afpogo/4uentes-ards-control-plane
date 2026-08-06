# INIT-CP-0002 - Cierre del mirror temporal PORT

Fecha: 2026-07-10

## Contexto

Durante la reconciliación del control plane se detectó que la iniciativa de
promoción de recursos vivos a core había tenido un primer mirror temporal en el
proyecto Jira `PORT`. Ese mirror fue reemplazado por el proyecto Jira `ARDS`,
que es el espacio correcto para los CR del control plane y del core ARDS/SDD.

La fuente de verdad sigue siendo el repositorio `4uentes-orchestor`; Jira opera
como mirror operativo.

## Decisión

No se eliminaron tickets. Se cerraron como `Listo` para preservar auditoría,
dejando comentarios de reemplazo hacia los issues correctos en `ARDS`.

## Mapeo reconciliado

- `PORT-12` fue reemplazado por `ARDS-1` para `INIT-CP-0002`.
- `PORT-13` fue reemplazado por `ARDS-2` para `CR-CP-0001`.
- `PORT-14` fue reemplazado por `ARDS-3` para `CR-CP-0002`.
- `PORT-15` fue reemplazado por `ARDS-4` para `CR-CP-0003`.
- `PORT-16` fue reemplazado por `ARDS-5` para `CR-CP-0004`.
- `PORT-17` fue reemplazado por `ARDS-6` para `CR-CP-0005`.

## Estado observado después de la reconciliación

- `PORT-12`, `PORT-13`, `PORT-14`, `PORT-15`, `PORT-16` y `PORT-17`: `Listo`.
- `ARDS-2` y `ARDS-3`: `Listo`.
- `ARDS-4`: `En curso`.
- `ARDS-5` y `ARDS-6`: `Por hacer`.
- `ARDS-1`: `Por hacer` como Epic contenedor.

## Notas de evidencia

La validación se realizó con MCP Jira. No se persisten respuestas crudas del
conector porque pueden contener datos sensibles de Atlassian como URL del sitio,
identificadores de cuenta, cloud id o correos.
