# CR-SST-0194 - Inicio Del Gate De QA Integrado

Fecha: 2026-08-23.

## Autorización

Después de recibir la explicación de que el próximo gate requiere un entorno
local/dev temporal, el usuario respondió: `Ok avancemos con el proximo gate`.

La autorización permite levantar, reconstruir, reiniciar y detener servicios
locales/dev; aplicar flags sólo al proceso o contenedor temporal; y crear
fixtures sintéticos que serán limpiados al finalizar.

Permanecen prohibidos producción, datos reales, Jira, GitOps, cambios en
manifiestos o repositorios de infraestructura, despliegues persistentes y flags
permanentes.

## Objetivo Del Gate

Una corrida reproducible debe demostrar:

1. usuario y sesión sintéticos emitidos por Auth;
2. conversación durable y scope reconstruido por Bend;
3. tokens M2M firmados con grants exactos de recall y proposal;
4. record aceptado que llega al chatbot como contexto gobernado;
5. audit de recall con cita opaca;
6. desarrollo final entregado como propuesta `needs_user_review`;
7. rechazo de grant incorrecto, scope cruzado y sesión revocada;
8. limpieza verificable de todos los fixtures y servicios temporales.

El gate no puede cerrarse sólo con fakes ni con checks owner aislados.
