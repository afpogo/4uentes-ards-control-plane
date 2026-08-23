# CR-HPT-0015 - Manifiesto de port selectivo

Fecha: 2026-08-22.

## Resultado

Los ocho commits fuente modificaban 80 paths. La recuperación sobre el canon
actual queda clasificada así:

- 69 paths conservan contenido idéntico al snapshot HPT validado;
- 4 paths fueron reconciliados contra el canon actual;
- 7 paths fueron excluidos deliberadamente.

No se ejecutó cherry-pick, merge ni reemplazo completo desde la branch
histórica.

## Lifecycle recuperado

Se publican como cierres históricos, sin recrear sus archivos `running`:

- `CR-HPT-0002`: adopción de gobernanza owner;
- `CR-HPT-0003`: boundary SST-HPT y account scope;
- `CR-HPT-0005`: contrato de recursos económicos cotidianos;
- `CR-HPT-0008`: slice de API de recursos cotidianos;
- `CR-HPT-0011`: baseline owner de Phinance-API;
- `CR-HPT-0012`: scaffold FastAPI.

Permanecen planificados, no ejecutados por este request:

- `CR-HPT-0006`: intake gobernado de documentos financieros;
- `CR-HPT-0013`: trusted principal context v1.

También se incorporan `INIT-HPT-0002` y `INIT-HPT-0003`, su evidencia fuente
y la actualización de `INIT-HPT-0001`.

## Superficies reconciliadas

Se actualizaron sobre sus versiones actuales:

- catálogo backend y frontend: Phinance-API pasa a baseline FastAPI y la
  identidad frontend standalone queda deprecada;
- solution map: `sst-fend` queda como consumidor externo mediante boundary
  autenticado todavía pendiente;
- feature state: refleja adopción local implementada y conserva gaps de
  PrincipalContext y ownership de release;
- documentación de aplicación, ejemplo de bindings e intake histórico;
- `CR-HPT-0004`: reduce su scope al backend activo y registra sus predecesores
  como cerrados;
- índice de iniciativas: agrega HPT 0002/0003 sin retirar las iniciativas SST
  publicadas después de la branch fuente.

## Exclusiones deliberadas

Se excluyen los seis archivos `requests/running/CR-HPT-*` que coexistían con
sus respectivos cierres. El modelo actual exige retirar el lifecycle vivo al
publicar `done`.

También se excluye `scripts/test-verify-local-bindings.js` de la branch antigua.
No se adopta su cambio asociado en `scripts/verify-local-bindings.js` ni el
texto derivado de `docs/apps/service-catalog.md`: la raíz dirty falla ese
self-test bajo el entorno observado y el canon actual no debe retroceder a un
validador no demostrado.

El cambio sin commit que asigna la fachada SST-Phinance a `CR-SST-0207` queda
fuera de este port porque colisiona con la identidad SST canónica. Tampoco se
copian directorios generados o locales.

## Boundary

Los cierres owner se recuperan como evidencia histórica. `CR-HPT-0015` no
autoriza nuevas mutaciones owner, despliegues, acceso a datos financieros ni
escrituras Jira.
