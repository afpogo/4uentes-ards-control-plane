# Descubrimiento owner en modo solo lectura — CR-SST-0232

## Alcance

Se contrastó el contrato planificado con las referencias locales disponibles de `sst-bend` y `sst-fend`. No se ejecutó `fetch`, no se modificaron sus checkouts y no se accedió a bases, secretos, runtime ni datos de producto.

Los checkouts de trabajo existentes tenían cambios ajenos, por lo que la lectura se realizó con `git show` sobre referencias remotas ya disponibles:

- `sst-bend/origin/develop@dc67203c77bb91804db888ad57c4f2a174b3d6b8`;
- `sst-fend/origin/develop@bd9b8d2aa52aab2346b7bf94b0db05ed188c09a3`.

## Hallazgos en Bend

La spec `specs/api/learning-workspaces.yaml` y el DTO `learning-workspace.dto.js` aceptan `sourceType`, `sourceRef`, `originArticleId` y contenido aportado por el caller mediante `sourceText`, `rawText`, `html` o `documents`. El caso actual exige que exista contenido en el request.

`normalize-learning-source.service.js` normaliza únicamente ese contenido acotado. No busca artículos, documentos o resultados por una referencia persistida, no autoriza la cadena de ownership de esas entidades y no crea un snapshot inmutable de fuente antes del preview.

La aceptación actual puede consolidar un preview enviado por el caller por compatibilidad. Por lo tanto, `previewId` prueba una normalización determinista del payload, pero no prueba por sí solo que el cuerpo provenga de una versión owner autorizada.

Bend sí dispone, desde `CR-SST-0223`, de persistencia para snapshots de artículo, runs, derivaciones y `article_processing_results`. Ese agregado es la autoridad que debe reutilizar `agent_output`; Learning Workspace no debe ejecutar de nuevo al agente ni crear un segundo modelo de jobs.

## Hallazgos en Fend

`src/services/types/learningWorkspace.ts` exige `sourceText` en `LearningWorkspacePreviewRequest`. `LearningWorkspaceSheet.tsx` selecciona `sourceType` con una heurística:

- `article` si existe `originArticleId`;
- `article_draft` si la hoja está embebida;
- `manual_text` para `/learning` standalone.

En los tres casos envía el texto completo desde el navegador. No existe un selector de artículos, documentos o resultados procesados, ni una identidad visible de snapshot. La UI sí conserva dos separaciones valiosas que el contrato debe mantener: preview antes de accept/reject y `ArticleTag` separado de las anotaciones locales `LearningContentTag`.

## Decisión derivada

La evolución compatible necesita una unión discriminada `SOURCE_DESCRIPTOR`. Para fuentes persistidas, el navegador envía identificadores estables y Bend reconstruye scope, autoriza, resuelve y congela `LEARNING_SOURCE_SNAPSHOT`. Sólo `manual_text` transporta cuerpo explícito.

El flujo vigente queda como adaptador transicional: `manual_text` continúa; `article_draft` sigue siendo texto manual hasta persistirse; `article + originArticleId + sourceText` debe migrar a referencia owner y dejar de confiar en el cuerpo caller.

## Límites observados

- Esta evidencia no afirma el estado de refs remotos no descargados después de los hashes indicados.
- No se validó runtime ni conectividad BFF.
- No se autoriza implementación en Bend o Fend.
- No se inspeccionaron valores de secretos ni contenido privado de usuario.
