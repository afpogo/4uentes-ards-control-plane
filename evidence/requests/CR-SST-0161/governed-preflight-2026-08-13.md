# Preflight gobernado de SST-94

Fecha: 2026-08-13

## Resultado

SST-94 / CR-SST-0161 queda listo para una decision humana acotada, pero no
para ejecutar rotaciones reales. El primer slice recomendado implementa un
keyring versionado para desarrollo, conserva compatibilidad con la clave actual
y prueba recuperacion con claves sinteticas y fixtures en memoria.

No se modificaron repositorios funcionales, no se aplicaron manifiestos, no se
consulto una base de datos y no se manipulo material criptografico real.

## Evidencia observada

- `ProtectedSecretValue.keyRef` ya existe y forma parte del AAD v1.
- El servicio de cifrado persiste `keyRef`, pero el descifrado resuelve siempre
  `SST_DICTIONARY_SECRETS_MASTER_KEY`; el selector persistido no elige clave.
- Los registros existentes usan por defecto
  `env:SST_DICTIONARY_SECRETS_MASTER_KEY`.
- La rotacion historica de esa unica variable dejo registros anteriores
  ilegibles cuando la clave previa ya no estaba disponible.
- Infraestructura ya aprueba `manual-local-k8s-secrets` para desarrollo y monta
  `sst-bend-dictionary-secrets-secret` fuera de Git.
- `sst-4uentes-infra` dispone de `npm run check`, que renderiza kustomize y
  ejecuta `kubectl apply --dry-run=client` para bootstrap y development.
- Ambos repositorios hijos tienen cambios locales. El trabajo posterior debe
  aislarse en branches/worktrees y no mezclar esos cambios.

## Diseno propuesto

El contrato conserva `SST_DICTIONARY_SECRETS_KEY_REF` como selector activo y
agrega una lista explicita `SST_DICTIONARY_SECRETS_KEY_REFS`. Cada referencia
permitida usa el formato `env:NOMBRE_DE_VARIABLE` y resuelve material desde una
variable individual suministrada por el Kubernetes Secret.

Reglas:

- cifrar solo con el `keyRef` activo;
- descifrar con el `keyRef` persistido en cada registro;
- rechazar referencias no declaradas, faltantes o mal formadas;
- conservar el valor historico
  `env:SST_DICTIONARY_SECRETS_MASTER_KEY` durante adopcion;
- no imprimir claves, plaintext, ciphertext, nonce ni auth tag;
- mantener la compatibilidad single-key mientras el nuevo listado no este
  configurado;
- no agregar una migracion de tabla en el primer slice: `key_ref` ya modela la
  version de clave.

## Recuperacion y rollback

La recuperacion inicial no reescribe ciphertext. Consiste en conservar la clave
anterior en el keyring para leer registros previos mientras una nueva clave
activa protege escrituras nuevas. El rollback del selector activo vuelve a la
referencia anterior sin modificar filas.

Una futura re-encryption debe tener su propio gate operacional con backup
verificado, inventario dry-run, idempotencia, auditabilidad y restauracion. No
forma parte de los PRs iniciales ni puede ejecutarse con la aprobacion de este
preflight.

Si el material de una clave historica ya se perdio, el keyring no puede
reconstruirlo. Esos registros siguen el procedimiento de reparacion manual desde
una fuente runtime autoritativa documentado por CR-SST-0086.

## Criterios de adopcion

- pruebas sin base de datos con claves sinteticas cubren lectura old/new,
  cambio de activa, rollback y fallas sanitizadas;
- startup valida la activa y las referencias declaradas;
- los owner specs/docs de backend e infraestructura coinciden;
- `npm run check` pasa en ambos repos owner;
- `npm.cmd run check` pasa en el control-plane;
- ningun PR aplica Kubernetes, rota una clave real ni declara readiness de
  produccion.

## Gate pendiente

Se requiere aprobar expresamente esta decision:

> Adoptar para desarrollo un keyring versionado respaldado por el modelo ya
> aprobado `manual-local-k8s-secrets`, excluyendo produccion, KMS, TLS,
> rotacion real y re-encryption real de los PRs de implementacion.

La transicion o comentario de Jira SST-94 requiere un lote Jira separado. El
readback intentado en este preflight no estuvo disponible porque el refresh
token OAuth del conector expiro; no se realizo ninguna escritura.
