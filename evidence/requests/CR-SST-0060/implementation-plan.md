# Plan De Implementacion CR-SST-0060

## Objetivo

Cerrar el primer gap real de `sst-tags-governance`: convertir `article-tags`
en una capacidad SST gobernada y usable en el flujo de Articulos.

## Secuencia Recomendada

1. `sst-bend`

   Revisar la capability outbound `article-tags`, endpoints de Articulos y
   cobertura existente. Promover el contrato si las reglas locales lo permiten
   y agregar validaciones para:

   - `POST /articulos` con tags;
   - `PATCH /articulos/:id` con tags;
   - `GET /articulos?includeTags=true`;
   - `GET /articulos/:id?includeTags=true`.

2. `4uentes-auth`

   Revisar si el BFF/auth boundary hace pass-through, transforma o filtra el
   payload de Articulos. La meta es que los tags estructurados no se degraden a
   `string[]` cuando el backend espera o devuelve estructura `TagValue` /
   `TagOccurrence`.

3. `sst-fend`

   Revisar el editor de Articulos. Incorporar create/update con tags
   estructurados y rendering consistente de tags retornados con
   `includeTags=true`.

4. `sst-extension`

   Mantener fuera del primer corte salvo que Quick Save sea productor directo
   de Articulos con tags. Si queda fuera, documentarlo como gap aceptado.

## Criterio De Cierre

- Cada repo tocado tiene evidencia local.
- El control-plane recibe evidencia suficiente para actualizar
  `state/features/sst-tags-governance.current.yaml`.
- `SST-4` puede pasar a `In Review` o equivalente solo despues de validar el
  slice funcional, no solo por planificacion.

## Riesgos

- Contrato de datos inconsistente entre backend, BFF y frontend.
- Confusion entre tags simples de UI y entidades `TagValue` /
  `TagOccurrence`.
- Incluir `learning-content` o transcripcion antes de cerrar el slice de
  Articulos.
- Cambios en `4uentes-auth` sin validar impacto de autenticacion.

## Boundary

- Este plan no modifica repos funcionales.
- Este plan no escribe en Jira.
- Este plan no cambia `status: runtime-partial`.
