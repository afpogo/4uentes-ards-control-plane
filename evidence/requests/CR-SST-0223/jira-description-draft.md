# CR-SST-0223 — Persistencia gobernada de procesamiento de artículos

## Objetivo

Adoptar en `sst-bend` la persistencia y autorización de `sst-article-agent-processing-v1@1.0.0` sin mover la ejecución del modelo fuera de `sst-chatbot` ni aceptar memoria automáticamente.

## Alcance owner

- evolucionar el job existente como run compatible, sin crear un agregado paralelo;
- materializar snapshots inmutables de fuente y prompt;
- persistir una cadena de contexto versionada y derivaciones ordenadas por párrafo;
- separar derivación final, resultado técnico, resumen revisable y propuesta de memoria;
- aplicar scope reconstruido por Bend, idempotencia, procedencia y fallos cerrados;
- mantener endpoints legacy mediante adaptación explícita;
- publicar ARDS/SDD owner, capability y mapas aplicables.

## Fuera de alcance

No incluye ejecución real del modelo, integración durable Bend–chatbot, UX Fend, aceptación automática de memoria, despliegue ni QA E2E. Esos trabajos pertenecen a `CR-SST-0224` a `CR-SST-0227`.

## Validación

El owner deberá pasar `npm run check`, pruebas de migración/modelo, scope e idempotencia. El control plane deberá pasar su check completo. La autorización no permite usar el checkout dirty existente ni ejecutar migraciones contra datos compartidos o productivos.
