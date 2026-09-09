# Merge autorizado y continuación de development

El usuario respondió «autorizo fusionar y continuar» a la solicitud explícita
de fusionar SST PR #34 incluyendo su publicación automática de imagen y
actualización del pin Infra. Se consume esta autorización sobre el HEAD
`bc97a409ce171b9af30f5eece14495ed87487478`, base `develop`, con los tres checks
GitHub SUCCESS y estado OPEN/CLEAN comprobados nuevamente.

Coordinador: CR-CP-0024. Corrección SST: CR-HPT-0023. Continuación scanner:
CR-HPT-0024. Se reutilizan los worktrees existentes. No se autoriza promoción
stable, transición terminal Jira, borrado de worktrees ni activación de
Telegram/Phinance. El lote Jira previo continúa preparado, sin aplicar.

Ventana actual: merge exacto, workflow de push, lectura del pin Infra,
convergencia GitOps y salud del pod nuevo. El reemplazo del pod permitirá
observar el arranque del scanner desde cero sin forzar reinicios adicionales.
Después se verifican firmas, archivo limpio, EICAR e indisponibilidad mediante
fixtures efímeros, respetando los contratos del owner y sin documentos reales.

Se conserva la clasificación complex-high-risk-task, recursos normal/default,
ejecución secuencial en el modelo principal configurado por la sesión y checks
completos CP antes de cierre. La cobertura general omitida por el smoke SST
continúa explícita; no se confunde con la matriz sintética acotada de custodia.

## Readback de SST

- Merge PR #34: `e425355f65cfd1b70abbe6e38df579d905252459`,
  2026-09-09 04:34:58 UTC.
- CI Node.js `34311527346`: SUCCESS. Publicación `34311527399`: SUCCESS.
- Imagen: `ghcr.io/afpogo/sst-bend:develop-e425355f65cf`.
- Pin Infra: `35891be72a37bbfdf7615f9632289df3161f0f77`; el commit cambia
  exclusivamente esa línea de tag. El hook de migraciones y autosync finalizaron
  con `Succeeded`; Argo CD quedó Synced/Healthy.
- Pod nuevo: `sst-bend-59f4b47f69-qgxm4`, 2/2, cero reinicios. Se comprobó
  dentro de su imagen la condición `expiresAt: { [Op.gt]: now }`.
- El árbol del merge SST coincide con el HEAD validado del PR. No fue necesario
  repetir las 30 aserciones sintéticas ni las migraciones sobre un árbol idéntico.

Cambio concurrente observado, ajeno a esta ejecución: Infra `aff832f` actualizó
Auth a `develop-d9263d180196`, procedente de Auth PR #16 / CR-SST-0235.
El diff desde ff5605c se limita al relay Learning, sus contratos/docs y prueba;
los grants M2M validados no cambiaron. Esta ejecución no fusionó ni publicó
Auth y no atribuye esa mutación a la autorización de SST.

## Corrección de arranque activada en CR-HPT-0024

SST PR #34 está integrado en e425355; CI publicó el pin Infra 35891be y
GitOps convergió. El pod nuevo `sst-bend-59f4b47f69-qgxm4` reprodujo el gate
pendiente: FreshClam actualizó disco a 28117 antes de que existiera el socket,
falló NotifyClamd y el daemon respondió VERSION 28102 estando Ready.
Los streams limpio/EICAR pasaron, pero no acreditan vigencia de firmas.

La continuación autorizada y el plan de correcciones mínimas se aplican ahora
a CR-HPT-0024: preparar un arranque secuencial que ejecute FreshClam una vez
antes de delegar al entrypoint oficial no privilegiado. Un error de actualización
debe impedir iniciar clamd. Se preservan imagen fijada, UID/GID, recursos,
capabilities, socket, staging y todos los componentes AIStor/KMS sin activar.

Allowlist owner: wrapper de arranque, su montaje ConfigMap y wiring, contrato
de despliegue, validación y documentación específica de scanner. Validar en
contenedor efímero, incluidos actualización fallida y arranque real; ejecutar
full checks Infra y CP antes de publicar el PR. No efectuar recarga manual
en el pod observado para ocultar el defecto.

## Validación e integración de la corrección Infra

Infra PR #31, HEAD `f86ad47bbcd7803e2df8338b2f06cb6e9555e877`, pasó los cuatro
checks GitHub y se integró en `322487cf65b18d63a3ec4bb3e956ebe276a357d2` a las
04:45:40 UTC, dentro de la continuación acotada del gate scanner.

Prueba en contenedor efímero con el digest fijado y las restricciones del pod:

| Prueba | Resultado |
| --- | --- |
| Arranque con update síncrono | VERSION 28117; sin recarga manual |
| Stream limpio | OK, exit 0 |
| EICAR | Eicar-Test-Signature FOUND, exit 1 |
| Fallo inicial de FreshClam sin red | exit 23 propagado; daemon no iniciado |
| Pico de memoria observado | 1276223488 bytes frente al límite 4294967296 |
| Recursos de QA | Contenedores desechables retirados; sin volumen persistente |

Las pruebas de protocolo desde SST usan el script reproducible
`inventory/scanner-protocol-qa-2026-09-09.js`. EICAR tiene SHA-256
`275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f`.
El socket inexistente devuelve ENOENT sin veredicto. Esa prueba acredita
transporte, no la aceptación/rechazo de objetos por el futuro upload/S3/KMS.

Full checks Infra y CP PASS; diff check PASS.

## Readback final de scanner y siguiente gate

El 2026-09-09 a las 04:50 UTC, Argo CD estaba Synced/Healthy sobre
`322487cf65b18d63a3ec4bb3e956ebe276a357d2`. El pod
`sst-bend-855fb9b9db-84697` quedó 2/2 Running, cero reinicios. FreshClam inició
la actualización a las 04:48:21, verificó y guardó 28117 antes de iniciar
clamd; el daemon terminó de inicializar a las 04:48:39. Sin recarga manual,
VERSION devolvió `ClamAV 1.5.4/28117/Tue Sep 8 06:26:31 2026`.

Desde SST, el harness de protocolo obtuvo PONG, `stream: OK` para el fixture
limpio y `Eicar-Test-Signature FOUND` para EICAR. El socket inexistente produjo
ENOENT sin veredicto. No se escribieron archivos ni se usaron documentos reales.
Pico observado: 1137446912 bytes; límite: 4294967296. Es una observación acotada,
no una garantía de estabilidad bajo cualquier carga futura.

Queda validado el subgate scanner de arranque, firmas y protocolo. La recarga
continua ya estaba acreditada por la evidencia anterior; se conserva separada.
El rechazo funcional de objetos ante fallas de scanner/S3/KMS pertenece al
upload futuro y no se declara probado.

Gate C pendiente de confirmación humana: licencia AIStor aceptada y archivada,
respaldo cifrado HSM/KMS y contratos de Secrets preparados. La consulta de
existencia devuelve NotFound para namespaces `aistor-system`, `receipt-custody`
y Secret `sst-receipt-object-store`; no se leyeron valores ni se creó plataforma.
HPT-16 permanece En curso. El lote Jira se actualiza como propuesta, sin enviar
comentarios ni aplicar transiciones. No se retiran worktrees ni ramas.
