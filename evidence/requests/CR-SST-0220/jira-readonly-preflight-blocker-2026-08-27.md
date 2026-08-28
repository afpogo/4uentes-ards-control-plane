# Preflight Jira de sólo lectura — bloqueado

Fecha: `2026-08-27`.

## Operación intentada

Se intentó iniciar el preflight de sólo lectura mediante el conector Atlassian para verificar:

- duplicados de `CR-SST-0220` en summary y description;
- existencia, tipo y estado de `SST-105`;
- tipos de issue disponibles en el proyecto `SST`;
- campos obligatorios para crear la futura tarea espejo.

## Resultado

Estado: `BLOCKED-OAUTH`.

El conector falló antes de recuperar información de usuario o Jira:

```text
unauthorized_client: refresh_token is invalid
```

No se leyó ni escribió ningún issue. No se asume que la jerarquía, el tipo `Tarea`, los campos ni la ausencia de duplicados observados en preflights históricos continúen vigentes.

## Condición para reintentar

Reconectar Atlassian y repetir las cuatro consultas de sólo lectura. Sólo después se podrá preparar un lote exacto con issue type, campos y parent confirmados. Cualquier escritura requerirá además una autorización explícita, enumerada y de un solo uso.
