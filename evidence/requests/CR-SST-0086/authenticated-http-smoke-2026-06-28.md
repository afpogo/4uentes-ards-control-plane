# Smoke HTTP Autenticado

## Alcance

- Request: `CR-SST-0086`
- Jira: `SST-26`
- Fecha: `2026-06-28`
- BF: `http://localhost:4000`
- SST API via BF: `/api/diccionario/secrets/*`

## Preparacion

- `sst` se levanto localmente con `SST_DICTIONARY_SECRETS_MASTER_KEY` ficticia y
  efimera desde variable de entorno.
- La master key no se escribio en archivos ni evidencia.
- Se creo un usuario QA local ficticio para obtener un token efimero.
- No se imprimieron JWTs, cookies, master keys ni plaintext de secretos.

## Resultado

```json
{
  "register": "PASS",
  "create": "PASS",
  "listMetadataOnly": "PASS",
  "listMaskedSignal": "PASS",
  "reveal": "PASS",
  "copy": "PASS",
  "rotate": "PASS",
  "revoke": "PASS",
  "plaintextPrinted": false
}
```

## Decisiones

- El smoke cubre el gap de validacion autenticada local para
  `create/list/reveal/copy/rotate/revoke`.
- La lista se mantuvo metadata-only: no incluyo el valor ficticio.
- Reveal y copy devolvieron el valor ficticio solo al cliente autenticado; el
  valor no fue registrado en evidencia.
- Rotate y revoke completaron sin persistir plaintext en logs/evidencia.

## Gap Restante

La promocion a `validated-live` todavia requiere confirmar que el ambiente
objetivo configure `SST_DICTIONARY_SECRETS_MASTER_KEY` mediante su mecanismo
seguro real.
