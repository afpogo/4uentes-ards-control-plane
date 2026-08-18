## Que cambia

- agrega un keyring versionado allowlisted mediante referencias `env:`;
- usa el `keyRef` persistido para descifrar y una referencia activa separada
  para escrituras nuevas;
- valida startup y falla cerrado con errores sanitizados;
- conserva compatibilidad single-key;
- alinea API spec, capability, docs owner, pruebas sinteticas y QA manual.

## Por que

El descifrado resolvia siempre una unica master key e ignoraba el selector
persistido. Cambiar esa variable podia volver ilegibles registros anteriores.
El keyring conserva cada version requerida y permite cambiar o revertir la
referencia activa sin reescribir filas.

## Impacto y limites

- alcance exclusivo de desarrollo para SST-94 / CR-SST-0161;
- sin cambios de endpoints ni schema de base de datos;
- sin DB, migraciones, seeders, rotacion o re-encryption real;
- sin Kubernetes apply, produccion, KMS o TLS;
- no se publican valores, claves ni artefactos criptograficos.

## Validacion

- `npm run qa:diccionario:keyring` — PASS 8/8, salida sanitizada;
- `npm run test:diccionario:keyring` — PASS;
- `npm run test:diccionario:secrets` — PASS;
- `npm run test:diccionario:stage3` — PASS 11/11;
- `npm run build` — PASS;
- `npm run check` — PASS, con cobertura HTTP protegida parcial esperada por
  ausencia de JWT y runtime autorizado;
- `git diff --check` y revision secret-safe — PASS.

La evidencia gobernada vive en
`4uentes-orchestor/evidence/requests/CR-SST-0161/`.
