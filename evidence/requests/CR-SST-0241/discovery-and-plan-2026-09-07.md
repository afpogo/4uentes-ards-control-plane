# Descubrimiento y plan de paridad Compose raw-v2

## Resultado

El contrato owner declara que el release de desarrollo usa `raw-v2` y permite HTTP solamente en loopback. El workflow de desarrollo aplica explicitamente:

```text
VITE_AUTH_CREDENTIAL_PROTOCOL=raw-v2
VITE_ALLOW_INSECURE_LOOPBACK_CREDENTIALS=true
```

Sin embargo, `docker-compose.yml` no transmite esas variables ni como argumentos de build ni como ambiente runtime. Por eso el frontend empaquetado puede heredar `legacy/false` desde el Dockerfile. `.env.example` tambien publicita `legacy/false` y refuerza la deriva.

## Decision

El lote futuro hara explicito `raw-v2/true` en el perfil local Compose, tanto en build como runtime, y alineara `.env.example`. Los defaults `legacy/false` del Dockerfile se conservan como fallback seguro cuando ningun perfil de release fue seleccionado.

No se almacenaran valores reales de KDF, passwords, cookies ni claves. La validacion de `docker compose config` usara placeholders no sensibles y revisara nombres y modos, no secretos.

## Orden de validacion

1. Parsear specs y resolver la matriz de Compose con placeholders.
2. Ejecutar el check owner completo.
3. Con autorizacion runtime separada, recrear solamente el frontend local.
4. Verificar identidad de fuente/contenedor y semantica raw-v2 en `localhost:4090`.

Un proceso Webpack previo con variables correctas no prueba Compose; una variable runtime tampoco prueba el bundle compilado; y un HTTP 200 no prueba la semantica del request de login.

## Autoridad y limites

La fuente tecnica observada y leida de vuelta fue `sst-fend@develop@bd9b8d2aa52aab2346b7bf94b0db05ed188c09a3`, junto con el workflow owner de desarrollo; el SHA remoto coincide con `origin/develop` local. Esta evidencia no autoriza mutacion owner, recreacion de contenedores, Jira ni publicacion Git.
