# Autorización del batch Jira de creación e inicio

## Decisión humana

El 2026-08-28, 4uentes respondió `autorizo ambos` a los dos gates presentados: reservar `CR-SST-0223` a `CR-SST-0227` en el control plane y ejecutar el batch exacto de Jira para `CR-SST-0220`.

Esta autorización es de un solo uso y sólo habilita:

1. repetir la búsqueda de duplicados de `CR-SST-0220` en el proyecto `SST`;
2. abortar sin escribir si existe una coincidencia;
3. crear exactamente una `Tarea` bajo `SST-105` con el resumen aprobado y la descripción versionada en `jira-description-draft.md`;
4. leer el issue creado y validar key, resumen, descripción, tipo, parent, estado y resolución;
5. aplicar exclusivamente la transición `21` si el estado inicial es `Tareas por hacer` y el readback coincide;
6. confirmar que el estado final es `En curso` y la resolución permanece vacía.

## Exclusiones

No se autorizan comentarios, links, labels, assignee, adjuntos, worklogs, cambios a otros issues, una segunda transición ni la creación de tickets Jira para los lifecycles owner. Jira continúa siendo espejo; el control plane conserva autoridad.

## Privacidad

La evidencia persistida no debe incluir identificadores de cuenta, correo, credenciales ni el identificador interno del sitio Atlassian.
