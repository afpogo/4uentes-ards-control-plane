# Manejo UI De Secreto Revocado

## Contexto

Durante QA manual de `Dictionary > Secretos`, un secreto previamente revocado
respondio `409 Conflict` al intentar `reveal`:

```json
[
  {
    "statusCode": 409,
    "error": "Conflict",
    "message": "Dictionary secret is not active"
  }
]
```

No se registraron valores de secreto, JWTs, cookies ni master keys en esta
evidencia.

## Decision Funcional

- Crear un secreto lo deja en estado `active`.
- Revocar un secreto lo deja en estado `revoked`.
- En v1 no existe endpoint ni contrato runtime para reactivar un secreto
  revocado.
- Para volver a disponer de un valor usable, se debe crear un nuevo secreto o
  rotar un secreto que todavia este `active`.

## Correccion Aplicada En Frontend

- `DictionarySecretsPanel` detecta entradas no activas con `status !== active`
  o `protectedValue.available === false`.
- `Reveal`, `Copy`, `Revoke` y `Rotar` quedan deshabilitados para secretos no
  activos.
- Al seleccionar un secreto revocado, el panel muestra alerta visible:
  `Secreto no activo`.
- El parser de errores de UI ahora soporta respuestas API con forma de array,
  por ejemplo `[{"message":"Dictionary secret is not active"}]`, ademas de las
  formas objeto ya soportadas.
- Se agregaron `htmlFor` en `Form.Item` para continuar el hardening de labels;
  Chrome DevTools aun reporta issue residual de labels por la implementacion
  actual de Ant Design, por lo que queda como gap no bloqueante.

## QA Chrome DevTools MCP

- URL local verificada: `http://localhost:4090/dictionary?qaRefresh=cr-sst-0086`.
- Pestaña: `Dictionary > Secretos`.
- Resultado:
  - secreto revocado visible como metadata masked;
  - acciones `Reveal`, `Copy`, `Revoke` deshabilitadas;
  - accion `Rotar` deshabilitada al seleccionar el secreto;
  - alerta visible `Secreto no activo`;
  - no se genero un nuevo `409` al seleccionar el secreto revocado.
- Consola despues de la verificacion:
  - warning existente de React Router future flag;
  - issue residual `No label associated with a form field`;
  - sin nuevo error de secrets por la accion bloqueada.

## Evidencia Visual

- `evidence/requests/CR-SST-0086/qa-chrome-revoked-secret-disabled-2026-06-28.png`
