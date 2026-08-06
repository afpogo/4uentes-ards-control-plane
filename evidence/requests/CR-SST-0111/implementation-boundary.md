# CR-SST-0111 - Borde De Implementacion Siguiente

## Proposito

Este documento convierte el contrato de intencion en un borde ejecutable para
el proximo CR. CR-SST-0111 no debe mutar runtime; deja preparado el corte que si
podra modificar repos hijos.

## Clasificacion De Tarea

- Peso: medio/alto.
- Riesgo: medio, porque toca UX, contrato BFF/API y potencial persistencia.
- Subagentes: utiles para discovery acotado o comparacion documental, pero no
  para decidir el contrato final.
- Owner enforcement: obligatorio cuando el siguiente CR mute repos hijos.

## Repos Probablemente Afectados

| Repo | Rol esperado | Condicion |
| --- | --- | --- |
| `sst-fend` | Superficie de hoja de texto y tagging visual | Si se implementa UX |
| `node-auth` | BFF para preview/accept/reject extendidos | Si cambia payload o endpoint |
| `sst-bend` | Persistencia/parser/query de selecciones | Si se requiere modelo runtime |
| `4uentes-orchestor` | Request lifecycle, evidencia y Jira mirror | Siempre |

## Corte Recomendado

El siguiente CR deberia enfocarse en una primera experiencia completa pero
acotada:

1. Hoja de texto en la tab `Texto`.
2. Separacion visible entre `ArticleTag` y tags de contenido.
3. Seleccion granular inicial por parrafo y seleccion manual.
4. Relevancia por seleccion.
5. Preview de contexto derivado.
6. Accept/reject usando BFF.
7. Evidencia de que el articulo se crea sin confundir tags generales con tags
   de contenido.

## Deuda Separada

El parser/import avanzado en `sst-bend` queda como "tomar de inmediato despues"
si el primer CR necesita concentrarse en frontend/BFF. Esa deuda no debe
bloquear la hoja inicial si el contrato conserva compatibilidad con parser
posterior.

## Preguntas Que Debe Resolver El Proximo CR

- Se extienden los endpoints actuales o se agregan DTOs versionados?
- El contenido granular se persiste en `sst-bend` en el mismo corte o queda
  inicialmente en preview aceptado por workspace?
- Que selector minimo se implementa primero: parrafo, rango, seleccion manual o
  documento entero?
- Como se lee despues el contenido aceptado por tag/relevancia?

## Definition Of Done Del Proximo CR

- Request aprobado con `child_repo_mutation_allowed: true`.
- Plan de archivos por repo hijo.
- Documentacion owner actualizada o excepcion explicita.
- Checks de cada repo afectado.
- `npm.cmd run check` del control-plane.
- Evidencia manual o automatizada de flujo crear articulo + marcar contenido +
  preview + accept/reject.
