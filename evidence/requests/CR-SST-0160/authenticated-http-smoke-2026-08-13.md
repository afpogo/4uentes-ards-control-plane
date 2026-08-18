# Smoke HTTP autenticado de CR-SST-0160

Fecha: `2026-08-13`

Entorno: runtime y PostgreSQL locales; no produccion
Resultado: `pass`

## Credencial y manejo seguro

El JWT local existente estaba vencido. Para completar el gate se emitio en
memoria un JWT RS256 de quince minutos con el mismo sujeto local y la clave de
firma del runtime `node-auth`. El token no se escribio en archivos, no se
imprimio y no se incorporo a evidence.

## Flujo autenticado

El harness `npm run smoke:diccionario:secrets-security` creo una unica entrada
sintetica y valido:

- create, detail enmascarado, reveal y copy;
- persistencia de `aad_version=1`;
- rotate y reveal de la version nueva;
- rechazo secret-safe de metadata de entrada y de perfil;
- aislamiento de cuenta con respuesta `403` generica;
- manipulacion del auth tag de la fila sintetica activa con respuesta `500`
  generica y sin downgrade legacy;
- revoke seguido de rechazo `409` para reveal.

Los logs posteriores contienen solamente eventos estructurados de validacion,
aislamiento, integridad y revocacion. No contienen JWT, plaintext, valores
centinela, UUID de la cuenta probada, ciphertext, nonce, auth tag ni contexto
AAD completo.

## Limpieza y residuos

La limpieza fisica se limito a `dictionary_secret_entries` usando
simultaneamente el UUID creado por el harness y su nombre sintetico exacto. No
se eliminaron usuarios, cuentas ni otros datos. El conteo residual posterior
fue cero tanto para la entrada sintetica como para los payloads rechazados; la
consulta no selecciono valores.

## Gate integral

`npm run check` se ejecuto con `SMOKE_REQUIRE_AUTH=true` y la credencial efimera:

- endpoints protegidos: `56/56` (`100%`);
- minimo `80%`: pass;
- objetivo `100%`: pass;
- resultado final: exit code `0` y `[ARDS CHECK] OK`.

Los negativos de rol member quedaron omitidos por no existir
`SMOKE_JWT_MEMBER`; no pertenecen al alcance SST-93. El smoke dedicado si
ejercito aislamiento de cuenta y todas las mutaciones owner de Dictionary
Secrets requeridas para este cierre.

No se realizo escritura, comentario ni transicion en Jira.
