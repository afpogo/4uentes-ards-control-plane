# CR-SST-0193 - QA HTTP Autenticado En Local/Dev

Fecha: 2026-08-21.

## Resultado Ejecutivo

El runtime de memoria de `sst-bend` quedÃ³ desplegado, migrado, habilitado y
validado en el cluster local/dev. El smoke autenticado especÃ­fico de
`sst-bend` pasÃ³ 27 aserciones. La integraciÃ³n completa con un access token
emitido por el `node-auth` desplegado no estÃ¡ operativa: el token real incluye
`token_use=access`, `sid` y audience `sst-api`, pero no incluye `tenant_id` ni
una identidad de aplicaciÃ³n (`azp`, `application_id` o `client_id`). El
middleware de memoria falla cerrado y responde HTTP 403, como fue diseÃ±ado.

CR-SST-0193 no debe cerrarse todavÃ­a. Quedan dos blockers explÃ­citos:

1. alinear el contrato de claims entre `node-auth` y `sst-bend` para que el
   navegador obtenga un scope completo y confiable;
2. recuperar el gate obligatorio `npm run check` del control plane, que sigue
   fallando en el test ajeno `scripts/test-verify-local-bindings.js:17`.

No se escribiÃ³ Jira durante este QA.

## Runtime Verificado

- cluster: `kind-sst-cluster-dev`;
- namespace: `4uentes-sst`;
- imagen: `ghcr.io/afpogo/sst-bend:develop-6ee18b378fa9`;
- PR de trazabilidad neutral adoptado: `sst-bend#20`;
- rÃ©plicas ready/available: `1/1`;
- Argo CD: `sst-app` `Synced` y `Healthy`;
- `USER_MEMORY_ENABLED=true` en el deployment local/dev;
- ingress sin bearer: `GET /4uentes/v1/user-memory/space` -> HTTP 401.

La habilitaciÃ³n se realizÃ³ directamente sobre el deployment local/dev para el
QA. No se modificÃ³ el repositorio de infraestructura, que estÃ¡ fuera del scope
autorizado de CR-SST-0193.

## Migraciones Observadas

PostgreSQL contiene las cinco tablas canÃ³nicas:

- `user_memory_spaces`;
- `user_memory_events`;
- `user_memory_proposals`;
- `user_memory_records`;
- `user_memory_recalls`.

La inspecciÃ³n de `information_schema.columns` confirmÃ³ ademÃ¡s la trazabilidad
neutral desplegada:

- propuestas: `producer_service`, `source_event_ids`, `confidence`,
  `validation_summary`, `correlation_id`, `reviewed_by`;
- records: `source_event_ids`, `confidence`, `created_by`;
- recalls: `requester_type`, `requester_id`, `policy_version`, `decision_code`,
  `retrieved_memory_ids`, `citation_refs`;
- events: tipo, superficie, referencia opaca, correlaciÃ³n y tiempo de origen.

## Contraste Con Token Real De Node-Auth

Se creÃ³ un usuario tÃ©cnico no personal identificado con `qa-cr-sst-0193` en la
base local/dev. Sus credenciales aleatorias existieron sÃ³lo en memoria durante
la prueba y no fueron registradas en archivos ni evidencia.

Resultado observado:

- register: PASS;
- login: PASS;
- `token_use=access`: presente;
- `sid`: presente;
- audience: `sst-api,scrapper-api`;
- tenant confiable: ausente;
- identidad de aplicaciÃ³n confiable: ausente;
- `GET /user-memory/space` con ese token: HTTP 403.

Este 403 no es un defecto del fail-closed de memoria. Es evidencia de que el
contrato de identidad desplegado todavÃ­a no entrega los claims requeridos por
la nueva superficie. No se fabricÃ³ una aprobaciÃ³n ni se degradÃ³ el middleware.

## Smoke Aislado De SST-Bend

Para separar el runtime de SST del blocker de emisiÃ³n, el harness
`runtime-http-smoke.js` se ejecutÃ³ dentro de `node-auth`, donde firmÃ³ en memoria
un access token QA con la misma clave RS256 y claims explÃ­citos de tenant y
aplicaciÃ³n. El token no se imprimiÃ³ ni persistiÃ³.

Resultado:

```text
PASS - runId qa-1787353980677 - 27 assertions
```

Cobertura del smoke:

- rechazo 401 sin autenticaciÃ³n;
- resoluciÃ³n de espacio por tenant/account/user/application;
- persistencia e idempotencia de evento;
- propuesta siempre en `needs_user_review`;
- rechazo de bypass de consentimiento;
- rechazo de `renderedPrompt` en trazabilidad;
- `producerService`, eventos fuente, confianza y validaciÃ³n neutral;
- aceptaciÃ³n e idempotencia de review;
- listado de records activos;
- recall con decision code y sin persistir prompt/query;
- aislamiento entre dos tenants;
- correcciÃ³n con revisiÃ³n 2 y vÃ­nculo de supersession;
- archivado;
- borrado con tombstone.

El script temporal copiado al pod fue eliminado al terminar. El control plane
no conserva una segunda implementaciÃ³n ejecutable del harness: la colecciÃ³n
HTTP mantenible pertenece al repo owner `sst-bend`, en
`httpPruebas/sst.user-memory.http`. El smoke firmado se considera diagnÃ³stico
de aislamiento, no prueba de aceptaciÃ³n del flujo normal de emisiÃ³n.

## Suites Repetidas

En el worktree limpio basado en `develop@6ee18b3`:

- `npm.cmd run test:user-memory`: PASS;
  - lifecycle y trazabilidad neutral;
  - seguridad y fail-closed;
  - frontera de consentimiento;
  - migraciones reversibles;
  - seis mapas de arquitectura;
- `npm.cmd run build`: PASS (`tsc --noEmit`);
- GitHub CI ya observado: Node.js 18 PASS, Node.js 20 PASS e imagen PASS.

La base de validaciÃ³n es aceptable para el runtime de `sst-bend`: cinco suites
enfocadas, compilaciÃ³n, CI multi-versiÃ³n, migraciÃ³n desplegada y 27 aserciones
HTTP reales. No existe instrumentaciÃ³n de cobertura porcentual en este repo;
por eso no se inventa un porcentaje.

## Gate Del Control Plane

`npm.cmd run check`: FAIL en el mismo blocker previo y ajeno a SST memory:

```text
scripts/test-verify-local-bindings.js:17
AssertionError: null !== 1
```

No se modificaron bindings ni trabajo HPT, y no se aplicÃ³ bypass. Este gate es
obligatorio segÃºn `AGENTS.md`, por lo que impide el cierre local del request.

## QA Visual

Se intentÃ³ abrir el endpoint local mediante el navegador integrado despuÃ©s de
establecer un port-forward temporal. La conexiÃ³n del navegador fue rechazada
por falta de metadatos de sandbox de la herramienta, antes de navegar. El
port-forward se cerrÃ³. No se adjunta una captura inexistente ni se atribuye esa
limitaciÃ³n al servicio; el mismo endpoint quedÃ³ comprobado por HTTP con 401.

## DecisiÃ³n De Cierre

Estado recomendado: mantener CR-SST-0193 en `running`.

El runtime canÃ³nico de `sst-bend` estÃ¡ implementado y validado. El siguiente
paso correcto es resolver la emisiÃ³n de `tenant_id` e identidad de aplicaciÃ³n
en el access token/identity context de la sesiÃ³n SST y repetir el tramo con un
token emitido normalmente por `node-auth`. DespuÃ©s debe repetirse el gate
completo del control plane. SÃ³lo con ambos PASS corresponde cerrar y publicar
Jira como Done segÃºn polÃ­tica.
