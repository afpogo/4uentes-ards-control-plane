# CR-SST-0124 - Authenticated Chrome DevTools QA Blocker

## Estado

- Fecha: 2026-07-07
- Request: `CR-SST-0124`
- Jira mirror: `SST-53`
- Herramienta: Chrome DevTools MCP
- Resultado: bloqueado por contrato runtime `POST /api/articulos`

## QA Ejecutado

Se libero el perfil de Chrome DevTools MCP cerrando solo la instancia Chrome
asociada al perfil MCP y se reabrio el navegador controlado.

La navegacion autenticada a:

```text
http://localhost:4090/artsst
```

abrio correctamente la vista interna:

```text
http://localhost:4090/artsst?page=1&mode=list
```

El usuario autenticado visible fue el usuario local de QA. No se persistieron
credenciales, cookies, JWTs ni material de sesion.

## Flujo Validado

1. Se abrio `New`.
2. Se selecciono tipo `Text`.
3. La UI mostro `Source reference (optional)`.
4. Se dejo la fuente vacia.
5. Se completo:
   - titulo: `QA SST-53 texto nativo MCP`;
   - descripcion: texto de prueba nativo sin URL externa.
6. Se avanzo a `Preview`.

## Resultado Observado

La UI preparo correctamente el payload esperado para articulo nativo:

```json
{
  "titulo": "QA SST-53 texto nativo MCP",
  "desc": "Articulo de prueba para cerrar CR-SST-0124...",
  "payload": {
    "kind": "text",
    "data": {}
  },
  "tags": []
}
```

No se envio URL falsa ni `payload.data.sourceUrl` artificial.

El runtime respondio:

```json
{
  "error": "Missing url"
}
```

Estado HTTP observado: `400`.

## Analisis

El frontend cumple la intencion de `CR-SST-0124`: no inventa URL externa para
articulos `text` nativos y mantiene `sourceUrl` vacio.

El cierre final queda bloqueado porque el runtime servido por
`localhost:4090/api/articulos` todavia rechaza el contrato de texto nativo sin
URL. Esto contradice la validacion local documentada previamente para
`sst-bend`, donde `payload.kind=text` con `data: {}` y sin `url/sourceUrl`
pasaba validacion minima.

La causa probable es una de estas dos:

- el BFF/backend desplegado localmente esta desactualizado respecto de la
  validacion de `CR-SST-0123`;
- existe una validacion adicional en el BFF o ruta runtime que sigue exigiendo
  `url` antes de llegar al factory/schema alineado.

## Decision

No cerrar `SST-53` como `Listo`.

`SST-53` fue comentado en Jira por Atlassian MCP y devuelto de `En revision` a
`En curso`.

El siguiente paso tecnico es alinear o redeployar el runtime detras de
`/api/articulos` para que acepte:

```json
{
  "payload": {
    "kind": "text",
    "data": {}
  }
}
```

sin `url` ni `payload.data.sourceUrl`.

## Seguridad

La evidencia esta sanitizada. No se incluyen tokens, cookies, JWTs, secretos,
IDs privados de sesion, raw headers completos ni datos privados fuera del texto
de prueba generado para QA.
