# Gate de custodia de la clave histórica de n8n

Fecha: 2026-09-05. Request: `CR-CP-0021`. Rol primario: playbook decisional
compuesto con runbook operativo de alto riesgo. Owner:
`4uentes-ards-control-plane`. Autoridad técnica:
`afpogo/4uentes-automation@5c2a24eeaaf957de1728ea601da668f78d19f63f`,
`docker-compose.yml`, `scripts/n8n-secret-entrypoint.sh`,
`specs/system/local-stack.yaml` y `docs/operations/local-stack.md`.

Aprobación: «ok avancemos».

## Decisión

Preservar el estado histórico de n8n. Se migrará únicamente el campo
`encryptionKey` de `n8n_data/config` hacia `.secrets/n8n_encryption_key`, sin
mostrar el valor. No se reinicializa ni modifica `n8n_data`.

La clave generada que no coincide se moverá, sin leerla ni imprimirla, a
`.secrets/.rollback/n8n_encryption_key.generated-unused-2026-09-05`. Quedará
bajo ACL privada para permitir compensación; su eliminación no está autorizada
en este gate.

## Runbook

1. Confirmar que Automation no tenga servicios activos y que el owner esté
   limpio en `main`.
2. Validar internamente que `n8n_data/config` sea JSON y contenga un único
   `encryptionKey` string no vacío. No imprimir el objeto ni el valor.
3. Validar el secreto target, la ausencia del path de rollback y la capacidad
   de aplicar ACL privada.
4. Comparar fuente y target mediante huellas internas no publicadas. Detener si
   ya coinciden.
5. Mover el target generado a custodia rollback, escribir un candidato privado
   y promoverlo atómicamente al target.
6. Confirmar internamente que target y fuente coinciden y que rollback conserva
   el target anterior; publicar sólo booleanos.
7. Ejecutar `scripts/check.ps1 -LocalStackOnly`, iniciar el Compose base sin
   túnel y ejecutar `scripts/check.ps1 -Runtime`.

Antes de verificar la promoción, cualquier error restaura el target generado.
Después de verificar que el target coincide con la configuración histórica, esa
clave queda como autoridad para el estado existente y no se revierte por un
fallo runtime no relacionado. En ese caso se detiene Compose sin `-v` y se
preservan ambos secretos para diagnóstico.

## Límites y evidencia

No leer ni modificar workflows, credenciales, ejecuciones, filas de bases ni
otros campos de configuración. No imprimir valores ni huellas. Registrar sólo
estados, paths declarados, checks, SHAs y disposición de rollback.
