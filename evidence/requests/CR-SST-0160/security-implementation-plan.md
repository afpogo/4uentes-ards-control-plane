# Plan de implementación de seguridad de CR-SST-0160

Fecha de planificación: `2026-08-11`

Jira mirror: `SST-93` bajo `SST-25`

Owner de runtime: `sst-bend`
Baseline inspeccionado: `b47ca013abea653d7651da5f71c537ea11f9ed64` con worktree limpio

Este documento cierra el plan técnico. No autoriza modificar `sst-bend`, iniciar
`SST-93`, desplegar ni tocar datos productivos.

## Intención confirmada

SST-93 contiene dos fallas de una misma frontera: un secreto puede escapar por
errores o metadata no clasificada, y el ciphertext AES-GCM actual autentica sus
bytes pero no su identidad lógica. El resultado buscado es que el plaintext
entre sólo por `value`, salga sólo por `reveal`/`copy`, y que un valor cifrado no
pueda trasladarse entre cuenta, entrada o versión sin que la autenticación
falle.

No pertenecen a SST-93 la selección de KMS/proveedor, rotación de master keys,
recuperación de claves anteriores ni re-encryption masivo. Esos temas siguen en
SST-94 / `CR-SST-0161`.

## Hallazgos de discovery

- `encryptSecretValue` y `decryptSecretValue` usan AES-256-GCM sin AAD.
- `ProtectedSecretValue` no persiste versión de contexto autenticado.
- create y rotate cifran sin `accountId`, `secretEntryId` ni versión lógica.
- `metadata` de la entrada y del perfil de conexión aceptan objetos arbitrarios
  y luego se devuelven en respuestas metadata-only.
- `validatorHandler` entrega el `ValidationError` de Joi completo a Boom y
  `logErrors` ejecuta `console.error(err)` sobre el objeto completo.
- los handlers ORM y 500 pueden devolver detalles, mensaje o stack no
  clasificados.
- reveal/copy registran auditoría antes de autenticar y descifrar el valor.
- la cobertura actual valida round-trip y masking, pero no prueba intercambio
  de contexto, downgrade legado ni ausencia del secreto en logs/errores.

## Decisiones de diseño

### AAD v1 canónico

El AAD será el UTF-8 del JSON siguiente, construido siempre con este orden fijo
de propiedades:

```json
{"schema":"sst.dictionary-secret.aad","aadVersion":1,"accountId":"<uuid>","secretEntryId":"<uuid>","secretVersion":1,"algorithm":"aes-256-gcm","keyRef":"<ref>"}
```

Se autentican sólo identificadores inmutables o criptográficos. No se incluyen
nombre, metadata, estado, instrucciones ni otros campos mutables. La
combinación `secret_entry_id + version` ya tiene unicidad en base de datos.

Una migración reversible agregará `aad_version INTEGER NULL` y el modelo
expondrá `aadVersion`. Toda escritura nueva y toda rotación creada por esta
versión debe guardar `aadVersion=1`; una versión desconocida falla cerrada.

### Compatibilidad legada sin downgrade

Los registros existentes quedan identificados únicamente por
`aad_version IS NULL`. Su lectura usa una función legacy explícita, nunca un
`try AAD -> retry sin AAD`. Los registros marcados v1 no pueden caer al camino
legacy aunque falle tag, ciphertext, nonce o contexto.

SST-93 no re-encripta registros históricos. Una rotación manual genera una
nueva versión AAD v1 y conserva la anterior según el lifecycle actual. La
migración masiva y la resolución de claves viejas quedan para SST-94.

### Metadata clasificada

Los objetos libres dejan de ser un canal alternativo para valores protegidos:

- `DictionarySecretEntry.metadata` tendrá allowlist inicial de `type` y
  `secretType`, ambos descriptores string acotados y nunca material secreto;
- `ConnectionProfile` ya posee campos tipados para plataforma, host, URL,
  puerto, protocolo, username y tipo de conexión, por lo que su `metadata`
  queda vacío hasta que exista un descriptor owner documentado;
- claves desconocidas o anidadas se rechazan con `400` seguro;
- no se eliminan ni reescriben objetos históricos durante SST-93.

Antes de desplegar se requiere inventario de sólo nombres de clave y conteos,
sin valores. Si aparecen usos legítimos, el owner debe clasificarlos y ampliar
la allowlist en spec antes del enforcement. El despliegue se bloquea ante una
clave desconocida; no se copia su valor a evidence.

### Error, log y auditoría

El middleware global no serializará objetos `Error`, Joi, Sequelize ni crypto.
Logs operativos usarán una proyección cerrada (`name`, status, código estable y
correlation id cuando exista). Las respuestas 500 e integridad serán genéricas;
no incluirán mensaje interno, stack, `value`, instancia ORM, ciphertext, nonce,
tag, AAD ni contexto de cuenta/entrada.

Reveal/copy seguirá siendo auditado, pero el orden será: autenticar/descifrar,
persistir evento exitoso y recién entonces devolver plaintext. Si falla la
integridad se registra sólo un outcome seguro y no se retorna valor. Un fallo
de auditoría también impide entregar plaintext.

## Unidades de ejecución

1. Actualizar primero o junto al código el spec API, la guía humana y el
   capability handoff de `dictionary-secret-management-v1`.
2. Sustituir el logging/error payload abierto por proyecciones seguras y agregar
   cobertura del flujo Joi, ORM y 500.
3. Implementar los schemas de metadata allowlisted y el preflight de nombres de
   clave sin valores.
4. Agregar migración/modelo `aadVersion`, builder canónico y uso de `setAAD` en
   encrypt/decrypt.
5. Pasar contexto inmutable desde create, rotate, reveal y copy; separar lectura
   legacy y error de integridad v1.
6. Corregir el orden de auditoría y agregar outcome seguro para fallas.
7. Ejecutar pruebas, revisión secret-safe y reconciliar evidence.

## Criterios de aceptación

- Un secreto sintético centinela no aparece en console, logs capturados,
  respuestas de error, metadata visible, auditoría ni evidence.
- Cambiar cualquiera de `accountId`, `secretEntryId`, `secretVersion`,
  `algorithm`, `keyRef` o `aadVersion` hace fallar decrypt.
- También fallan cambios en ciphertext, nonce o auth tag.
- Una falla AAD v1 jamás activa decrypt legacy.
- Un registro `aad_version NULL` conserva reveal/copy por el camino legacy
  explícito; una rotación posterior crea v1.
- Create, list, detail, update, reveal, copy, rotate y revoke conservan paths,
  autenticación, status de éxito y shapes públicos v1.
- Metadata desconocida/anidada falla con `400` sin reflejar valor ni estructura
  sensible.
- Reveal/copy sólo entrega plaintext si decrypt y auditoría tuvieron éxito.
- La migración sube y revierte sin transformar ciphertext existente.
- Specs API y capability declaran compatibilidad y límites con el código.

Pruebas negativas mínimas: validación create/rotate con centinela, errores ORM y
500, modificación de cada componente AAD, intercambio entre dos cuentas, dos
entradas y dos versiones, versión AAD desconocida, legacy explícito, metadata
rechazada y fallo de auditoría.

## Gates y rollback

Comandos owner previstos:

```text
npm run test:diccionario:secrets
npm run test:diccionario:stage3
npm run build
npm run check
```

Después debe pasar `npm.cmd run check` en `4uentes-orchestor`. Todo dato de
prueba será sintético.

El rollout es aditivo: migración nullable primero, luego aplicación dual-reader
que escribe v1. El rollback permitido vuelve a una release que tolere la nueva
columna; no borra `aad_version` mientras existan filas v1 y no restaura un
binario que intente descifrarlas sin AAD. La migración down sólo se prueba en un
entorno aislado sin ciphertext v1 durable.

## Gate de inicio

El plan queda listo para revisión humana. Empezar implementación requiere una
autorización explícita para mutar `sst-bend`. Mover o comentar `SST-93` requiere
además un lote Jira enumerado y autorizado por separado.
