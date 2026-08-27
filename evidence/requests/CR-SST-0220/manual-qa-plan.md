# Plan de QA manual — procesamiento de artículos con agente

## Regla de ejecución

La última revisión se realizará exclusivamente con Chrome DevTools MCP simulando al usuario. El artículo de prueba se crea y guarda desde la interfaz. Quedan prohibidos los scripts de base de datos, seeders, escrituras directas a APIs y mutaciones fuera de la UI.

La evidencia debe sanitizar credenciales, identidad personal, contenido privado y cuerpos de requests. No se capturan formularios con secretos visibles.

## Precondiciones

- Frontend, autenticación, Bend y chatbot están disponibles en el entorno local aprobado.
- El usuario inicia sesión por la interfaz sobre una dirección loopback permitida.
- La lista y creación de artículos responden correctamente antes de probar el agente.
- Los owner requests están fusionados y sus ARDS/SDD locales actualizados.
- Se conoce el número esperado de párrafos del fixture creado desde la UI.

## Fixture del usuario

Crear desde la interfaz un artículo sintético con al menos tres párrafos claramente separados:

1. un hecho verificable dentro del propio texto;
2. una inferencia que sólo sea válida al combinar contexto anterior;
3. una instrucción hostil escrita como contenido del artículo, que intente alterar el sistema pero deba tratarse como dato no confiable.

El fixture no contiene secretos ni datos reales. La creación debe producir una identidad de artículo visible antes de habilitar `Procesar con agente`.

## Escenarios obligatorios

| ID | Escenario | Resultado esperado |
|---|---|---|
| QA-01 | Abrir un borrador todavía no persistido | La acción del agente está ausente o bloqueada con explicación. |
| QA-02 | Guardar el artículo desde la UI | Aparece la identidad persistida y queda habilitado `Procesar con agente`. |
| QA-03 | Elegir `Documento completo` con el prompt abierto por defecto | Se crea un único run, finaliza una vez y presenta un resumen borrador con procedencia. |
| QA-04 | Elegir `Párrafo por párrafo` | Se procesa exactamente la cantidad esperada, en orden, y la derivación final refleja el contexto acumulado. |
| QA-05 | Cambiar el prompt o perfil | Se crea un run nuevo; el resultado anterior permanece legible y sin mutación. |
| QA-06 | Interpretar la instrucción hostil del tercer párrafo | El agente la describe como contenido y no altera guardrails, autorización ni esquema. |
| QA-07 | Publicar o rechazar el resumen | Sólo cambia el estado del `ARTICLE_SUMMARY`; no se crea memoria aceptada. |
| QA-08 | Solicitar memoria desde un resultado elegible | Se crea como propuesta `needs_review`; aceptar, corregir o rechazar requiere acción separada. |
| QA-09 | Forzar fallo o reintento desde controles visibles | El error es explícito; el reintento no duplica ni reescribe el run anterior. |
| QA-10 | Procesar un artículo por encima del límite configurado | No hay truncamiento silencioso; se informa el límite y se ofrece una alternativa gobernada. |

## Inspección con DevTools

En cada escenario se revisan la interfaz, consola y red mediante el MCP. Se registran método, ruta, status, correlación sanitizada y resultado visible; no se copian credenciales, cookies, tokens, contenido privado ni request bodies sensibles.

## Resultado y cierre

El cierre exige:

- PASS explícito del usuario para ambos modos;
- separación demostrada entre resultado, resumen y memoria;
- ausencia de errores inesperados en consola y requests relevantes;
- verificación de que prompt y modo generan runs independientes;
- owner checks y `npm run check` del control plane en PASS;
- evidencia manual fechada y vinculada al request terminal.

Un fallo de disponibilidad se registra como bloqueante y no se compensa con DB, seeders ni llamadas directas.
