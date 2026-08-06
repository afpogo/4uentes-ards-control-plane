# CR-SST-0076 - Plan de implementacion

## Estado

- Fecha: 2026-06-24
- Request: `CR-SST-0076`
- Jira: `SST-24`
- Parent Jira: `SST-4`
- Estado Jira actual: `En curso`
- Politicas aplicadas:
  - `agent-model-selection-policy`
  - `agent-resource-degradation-policy`
  - `agent-task-atomization-policy`
  - `agent-delegation-policy`
  - `agent-context-management-policy`
  - `agent-architecture-boundary-policy`
  - `human-doc-language`

## Objetivo

Completar la adopcion de tags gobernados para Diccionario sin romper el estado
`validated-live` de `dictionary-tags`, dejando evidencia suficiente para cerrar
`SST-24` y reconciliar luego el cierre integral de `SST-4`.

## Estrategia

La estrategia de esta etapa es `compatibility-first`.

- Diccionario conserva sus readers legacy validados mientras se verifica la
  escritura y vinculacion global por `tag_occurrences`.
- El modelo global sigue siendo el modelo objetivo para `tag_definitions`,
  `tag_values` y `tag_occurrences`.
- No se eliminan superficies `dictionary_*` en este CR.
- `learning-content` y `bitacora` siguen reservados y no bloquean el cierre.

## Cambios por repositorio

### 4uentes-orchestor

- Registrar este plan como evidencia operativa del request.
- Mantener `requests/planned/CR-SST-0076-dictionary-adoption-and-governed-closure.yaml`
  como request activo hasta el cierre.
- Actualizar `state/features/sst-tags-governance.current.yaml` para reflejar:
  - `CR-SST-0075` cerrado;
  - `CR-SST-0076` activo;
  - `CR-SST-0076` como ultimo gap operativo para cierre de `SST-4`.
- Actualizar `state/features/dictionary-tags.current.yaml` para referenciar este
  plan y conservar explicitamente la frontera de compatibilidad.

### sst-bend

- Verificar que no existe drift de schema ni necesidad de migracion nueva.
- Validar que `resourceType=diccionario` funciona en el binding global.
- Confirmar que el flujo actual mantiene dual-write hacia legacy y global.
- Documentar el boundary: lectura legacy validada, modelo global como destino.

### 4uentes-auth

- Verificar que el BFF conserva pass-through para:
  - `GET /api/tags/definitions`
  - `GET /api/tags/values`
  - `POST /api/tags/values`
  - `PUT /api/tags/resources/diccionario/:entryId`
- Documentar ejemplos `diccionario` si la capacidad BFF no los incluye.

### sst-fend

- Incorporar o validar el uso de selector gobernado en Diccionario.
- Reusar el patron ya validado en Articulos.
- En creacion de entry, guardar primero Diccionario y luego bindear tags por
  `entryId`.
- En edicion, reemplazar tags globales despues de persistir la entry.
- En limpieza, enviar `tags: []`.
- Mantener intactos management, reveal, import/export y lecturas existentes.

## Interfaces esperadas

No se agregan rutas nuevas.

Superficie BFF esperada:

- `GET /api/tags/definitions`
- `GET /api/tags/values`
- `POST /api/tags/values`
- `PUT /api/tags/resources/diccionario/:entryId`

Payload minimo de bind:

```json
{
  "sourceType": "dictionary-tag",
  "producer": "frontend",
  "tags": [{ "id": "tag-value-id" }]
}
```

Payload minimo de limpieza:

```json
{
  "sourceType": "dictionary-tag",
  "producer": "frontend",
  "tags": []
}
```

## Validacion requerida

- `sst-bend: npm run test:diccionario:stage3`
- `sst-bend: npm run check`
- `4uentes-auth: npm run check`
- `sst-fend: npm run css:types`
- `sst-fend: npm run build`
- `sst-fend: npm run check`
- `4uentes-orchestor: npm run check`

Si algun repo no permite ejecutar el check completo localmente, se debe dejar
evidencia con el bloqueo real y ejecutar el smoke o prueba mas cercana.

## Criterio de cierre

- `CR-SST-0076` tiene evidencia de validacion en los tres repos afectados.
- Diccionario conserva `validated-live`.
- El modelo global queda validado para `resourceType=diccionario`.
- `SST-24` queda comentado y transicionado con evidencia.
- `SST-4` queda listo para reconciliacion final, sin tomar como bloqueantes
  `learning-content` ni `bitacora`.

## Riesgos

- Cambiar readers de Diccionario en esta etapa puede degradar un flujo ya
  validado. Por eso no se migran wholesale readers publicos en este CR.
- La creacion de entry requiere `entryId` antes del bind global; la UI debe
  tratar el bind como paso posterior a persistir la entry.
- Cualquier cambio cross-repo debe respetar el lifecycle del request y dejar
  evidencia local antes de cerrar Jira.
