# CR-SST-0030 - Resumen De Implementacion

Observado el: 2026-06-05

## Resumen

Se creo una correccion conceptual en el orquestador para separar el ARDS/SDD del
proyecto de la memoria interna de usuario de SST.

El resultado establece que SST no implementara un ARDS/SDD por usuario como
estructura principal. Implementara una memoria interna de usuario con eventos,
hechos, intenciones, threads y recalls asistidos por chatbot.

## Superficies Implementadas

- Request `CR-SST-0030` en `inbox`, `planned` y `done`.
- Boundary conceptual `project_ards_sdd` vs `sst_user_internal_memory`.
- Modelo inicial de memoria interna de usuario.
- Impacto correctivo sobre CR-SST-0026, CR-SST-0027 y CR-SST-0028.
- Notas de correccion en evidence previa.
- Evidencia de fallback de subagentes.

## Boundary

No se implemento codigo runtime.

No se modificaron repos funcionales ni `4uentes-ards-core`.

La proxima implementacion debe empezar por el primer slice de memoria interna:
captura de eventos, propuesta de hechos/intenciones por chatbot, validacion
backend y recall basico.
