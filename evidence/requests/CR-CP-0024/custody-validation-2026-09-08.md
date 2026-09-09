# Evidencia de validación de custodia

Fecha local: 2026-09-08; ejecuciones posteriores a medianoche UTC del 9.
Coordinación: CR-CP-0024. Owner bindings/intake: CR-HPT-0023.

## Resultados

| Prueba | Revisión | Resultado y límite |
| --- | --- | --- |
| Auth `npm run check` | ff5605c | PASS; build y matrices HTTP de grants Automation, intake y objetos; RS256/JWKS, principal, audience, scopes, TTL e independencia de secretos |
| SST `npm run check` | fdc753f + corrección de expiración | exit 0; pruebas funcionales PASS. El smoke general informa cobertura protegida 50% frente a 80% y omite rutas; no acredita QA integral de todos los módulos |
| SST PostgreSQL `test-migration-chain-postgres.js` | fdc753f | PASS: fresh, upgrade, down/up, preservación de datos y paridad; sin modificar migraciones |
| SST `test-custody-http-postgres.js` | fdc753f + corrección | PASS: 30 aserciones HTTP con rutas reales, middleware real, JWKS efímero y PostgreSQL desechable |
| Infra `npm run check` | ba618db | PASS completo, incluidos renders y dry-runs; log en inventory |
| CP `npm run check` | recuperación local | PASS completo tras recuperar referencias históricas; repetir después del último cambio documental |

El primer intento del harness de migraciones dentro del sandbox falló al
ejecutar sequelize-cli sin salida de error; la repetición fuera del sandbox
pasó sin modificar el test. No se afirma EPERM porque ese harness no lo expuso.

## Falla reproducida y corrección

Un binding con `status=active` y `expires_at` pasado admitía un intake nuevo
con HTTP 202. La consulta SQL sólo filtraba el estado. El servicio ahora pasa
su instante de admisión y el repositorio exige `expires_at > now`; la misma
matriz devuelve HTTP 403. La repetición idempotente de una admisión anterior
conserva el contrato previo. No se agregaron endpoints ni migraciones.

La matriz adicional cubre las cuatro rutas de binding, rechazo de un member
que declara role owner en JWT, contexto de cuenta resuelto, reviewers inactivos
o de otra cuenta, duplicado 409, aislamiento, rotación y rollback real al fallar
el INSERT, revocación, TTL 90 días y expiración. Intake cubre servicio dedicado,
scopes compuestos/wildcard/objeto, audience/principal/TTL incorrectos,
REVIEW_PENDING, repetición idempotente, conflicto y binding vencido.

PostgreSQL se creó sin volumen, sólo en loopback, con nombre de contenedor
`cr-cp-0024-gates-pg-20260908`. Cada harness crea y elimina bases con prefijo
propio. Usuarios y memberships usan UUIDs aleatorios; claves RSA y JWT se
generan en memoria y nunca se imprimen. No se activan Telegram ni Phinance.

## Infra y tracker

PR documental Infra #30: guía original a01c28d más snapshots actualizados en
ba618db, integrado en `e050fd0d80cc6afc894d00cf6d024e2a4b41b654` el
2026-09-09 00:53:46 UTC. Readback GitHub MERGED y ascendencia de ba618db
en origin/develop confirmados. CI `validate-repository` SUCCESS. El scanner desplegado devolvió
`ClamAV 1.5.4/28117`; logs: activación el 2026-09-08 23:23:25 UTC. Cero
reinicios y Ready=true al leer el estado. El antecedente de recarga manual a
28116 se conserva con atribución a la guía original.

La continuidad de FreshClam/clamd no prueba arranque desde cero, EICAR,
archivo limpio ni indisponibilidad. Gate Infra sigue abierto; AIStor/KMS,
upload/retención y QA Automation siguen después.

Readback Jira de HPT-14, HPT-15 y HPT-16: las tres tareas están En curso.
Los comentarios y aclaraciones se preparan como lote, sin transición terminal.
Lote exacto: `jira-reconciliation-batch-2026-09-08.json`, tres comentarios y
tres anexos de procedencia a las descripciones observadas, con precondición de
versión `updated`. No se aplicó. El lote terminal está vacío: HPT-15 aún necesita
integración de la corrección y HPT-16 mantiene gates de runtime abiertos.

## Disposición y límites de cierre

El inventario registra 11 repos y 192 worktrees; 24 checkouts de custodia o
precursores. `inventory/custody-content-comparison-2026-09-08.json` compara
blobs de los 20 archivos Auth y 51 SST de la fuente promotion-ready. Auth:
10 idénticos y 10 modificados; SST: 34 idénticos y 17 modificados. Los cambios
adicionales de la integración, incluido el harness de migraciones, permanecen
en develop. No se fusionan las ramas históricas completas.

Los checkouts y ramas históricas conservan sus HEAD de procedencia. Los dos
preflight limpios se reutilizaron con nuevas ramas de validación, conservando
sus refs anteriores. Infra sigue activo por el scanner y la documentación.
Los roots sucios quedan intactos. Lista autorizada de retiro: vacía.
`inventory/custody-retirement-candidates-2026-09-08.json` enumera seis candidatos
limpios y alcanzables desde la ref canónica, sin referencias encontradas en
command lines ni mounts de contenedores. Es un filtro conservador: requiere
confirmación final de uso activo y autorización de retiro, no prueba que una
aplicación externa haya terminado de usar el directorio.

El contenedor PostgreSQL de QA fue detenido y eliminado por `--rm`; el readback
`docker ps -a` filtrado por su nombre quedó vacío. Los servidores HTTP/JWKS se
cerraron y cada base desechable fue eliminada por su harness.

La corrección SST está publicada en PR #34, HEAD
`bc97a409ce171b9af30f5eece14495ed87487478` (fix a38b484 y corrección documental
UTF-8). Necesita integración antes de declarar validado
el código canónico. Su workflow de push a develop construye imagen y cambia
el pin Infra: el merge necesita un gate que abarque ese efecto de despliegue.
La cobertura general omitida por el smoke owner queda explícita; las 30
aserciones sintéticas acreditan exclusivamente custodia/intake.
