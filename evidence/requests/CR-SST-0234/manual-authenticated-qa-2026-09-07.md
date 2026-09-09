# QA manual autenticada de Learning

## Alcance y método

Continuación del [QA inicial](manual-chrome-devtools-qa-2026-09-07.md),
autorizada por el usuario después de iniciar sesión manualmente en la página
independiente de Chrome DevTools. Se conservó el contexto aislado de esta prueba.
No se usaron seeders ni se invocaron preview, accept, reject o escrituras de
contenido. La autenticación humana y el transporte Socket.IO produjeron POST
de sesión; no deben confundirse con mutaciones de Learning.

## Casos observados

| Caso | Resultado |
|---|---|
| Acceso desde Home mediante Learning Sheet | Abre `/learning` con sesión autenticada |
| Hoja inicial | 5 líneas, 3 párrafos, 21 palabras; 3 fragmentos detectados |
| Relevancia sin selección | Etiquetas y Generar preview deshabilitados con instrucción visible |
| Selección por teclado de líneas 1–5 | Habilita selector y Generar preview |
| Cambio local de etiqueta | Recordar se selecciona y conserva el rango; no se genera preview |
| Origen y referencia | Muestra referencia interna local y aclara que no es URL del artículo |
| Actualizar contexto | `GET /api/learning-workspaces/context` devuelve 200 |
| Contexto devuelto | Sin documentos ni anotaciones; sin warnings |
| Consola | Sin mensajes al terminar el recorrido |

Los identificadores de usuario, cuenta y workspace del JSON técnico se omiten
de esta evidencia. El workspace devuelto tiene fechas anteriores a la prueba.
No se inspeccionó la base de datos para afirmar ausencia absoluta de efectos
internos; no se ejecutó ninguna acción de escritura de contenido.

## Hallazgos de experiencia

1. La pantalla inspeccionada no ofrece importación de artículos ni resultados
   de agente. Es consistente con las adopciones pendientes `CR-SST-0235` y
   `CR-SST-0236`; el backend publicado no demuestra adopción frontend.
2. Con documentos y anotaciones vacíos, el contexto presenta únicamente
   `# Hoja de aprendizaje`. Falta una indicación explícita de contexto vacío
   después de cargarlo: el mensaje inicial solo describe que aún no se cargó.
3. La opción Recordar aparece junto a tipos de contenido, sin explicar allí su
   relación con memoria duradera. Seleccionarla no demuestra escritura a
   UserMemory ni debe presentarse como tal.
4. La vista dice que publicar un artículo es una acción separada en Artículos,
   pero en la superficie inspeccionada no ofrece una acción directa para ese
   traspaso. La claridad del flujo original sigue siendo una brecha.

## Dictamen y siguiente paso

Pasan acceso autenticado, selección, selector local de etiquetas, lectura de
contexto y despliegue de estructura. No se probó edición/persistencia del
borrador, resolución autoritativa, preview, aceptación, rechazo ni importación.
El gate completo sigue parcial; esta evidencia no habilita cierre E2E.

La página autenticada queda abierta para continuar el QA. La evidencia anterior
de acceso no autenticado sigue siendo válida históricamente, pero autenticación
ya no es el bloqueo actual. El límite vigente sobre escrituras persiste.
