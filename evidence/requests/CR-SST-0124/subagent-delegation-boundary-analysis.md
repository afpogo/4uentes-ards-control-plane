# CR-SST-0124 - Subagent Delegation Boundary Analysis

## Politicas Aplicadas

- `agent-delegation-policy`
- `agent-task-atomization-policy`
- `agent-architecture-boundary-policy`
- `owner-documentation-authority-policy`

## Delegacion

Se desplegaron dos subagentes read-only para acelerar discovery documental:

- `Kant` (`019f3d8d-e9e7-7753-9570-b09774479fff`): ubicar el analisis en
  ARDS/SDD sin tocar child repos ni SST-50.
- `Dewey` (`019f3d8d-fb2a-77f0-bbb6-8686253b19b1`): revisar referencias
  existentes sobre articulos, LearningWorkspace, documentos, extension session
  y CR-SST-0120/SST-50.

## Resultado Operativo

El agente principal avanzo con discovery local mientras los subagentes
ejecutaban tareas read-only. Los hallazgos recibidos fueron verificados contra
los archivos del control-plane:

- `CR-SST-0111` ya define la separacion `ArticleTag` vs `LearningContentTag`.
- `CR-SST-0124` ya existe como CR correcto para articulo nativo sin URL externa
  inventada.
- `SST-50 / CR-SST-0120` esta en otro ownership activo y no debe absorber este
  analisis.
- `CR-SST-0123` ya registra que `POST /articulos` no debe devolver contexto de
  learning antes de `preview -> accept`.
- `CR-SST-0109`, `CR-SST-0110`, `CR-SST-0115` y `CR-SST-0116` sostienen la
  separacion BFF/API entre preview, accept/reject y contexto aceptado.
- El riesgo principal sigue siendo la conflacion semantica entre `ArticleTag`,
  `LearningContentTag`, URL externa, runtime URL interna y preview de sesion.

## Recomendaciones Incorporadas

- Mantener la creacion de Articulo como persistencia base independiente.
- Usar `LearningWorkspace` solo para procesamiento y materializacion posterior
  de contexto aceptado.
- No mezclar este boundary con `SST-50 / CR-SST-0120`, que pertenece al contrato
  de preview image para articulos derivados de sesion.
- Cuando se implemente el siguiente corte, exigir metadata comun de origen:
  `sourceRef`, `captureMode`, `warnings`, `provenance` y razon de degradacion
  cuando aplique.
- No persistir ni exponer contenido privado, secretos, JWTs o raw PDFs en
  evidencia/Jira.

## Boundary

Los subagentes no recibieron autoridad para decidir arquitectura ni modificar
archivos. La decision integrada queda en este request y en el agente principal.
