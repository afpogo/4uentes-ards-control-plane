# CR-SST-0178 - Plan Para Desplegar `sst-chatbot` En Development

## Resultado Buscado

`sst-chatbot` debe formar parte real del cluster `kind-sst-cluster-dev` como
servicio interno del namespace `4uentes-sst`. El chat se considera conectado
solamente cuando se prueban por separado y en conjunto estos dos saltos:

1. navegador -> Socket.IO -> `sst-bend`;
2. `sst-bend` -> HTTP streaming NDJSON -> `sst-chatbot`.

`sst-chatbot` no implementara Socket.IO ni tendra un Ingress publico. Esta
separacion conserva la decision cerrada por `CR-SST-0083`.

## Baseline Observado

El 13 de agosto de 2026 se observo:

- contexto Kubernetes `kind-sst-cluster-dev`;
- namespace `4uentes-sst` activo;
- pods de `node-auth`, `sst-bend`, `sst-fend`, `scrapper`, Mongo y Postgres;
- ausencia de Deployment, pod y Service de `sst-chatbot`;
- `sst-chatbot` posee runtime HTTP NDJSON validado por `CR-SST-0168`, pero el
  checkout historico inspeccionado no contiene packaging canonico visible;
- el repo de infra no contiene manifests de `sst-chatbot` en la busqueda
  inicial;
- los checkouts principales de `sst-bend` e infra contienen trabajo ajeno sin
  cerrar, por lo que no se usaran para esta CR.

## Aislamiento Obligatorio

- Se refrescara `origin/develop` antes de crear ramas.
- Cada repo mutado tendra una worktree nueva y limpia basada en
  `origin/develop`.
- La rama prevista es `feat/CR-SST-0178/sst-chatbot-development-cluster`.
- No se editaran ni limpiaran los working trees actuales.
- La QA web se ejecutara en una sesion nueva y aislada de Chrome DevTools MCP,
  sin reutilizar tabs, cookies, cache, local storage ni session storage.

## Owners Y Mutaciones Previstas

| Owner | Cambio previsto | Condicion |
| --- | --- | --- |
| `sst-chatbot` | imagen, entrypoint, configuracion, health y owner docs | requerido |
| `sst-4uentes-infra` | Deployment, Service, overlay development y owner docs | requerido |
| `sst-bend` | URL/configuracion del runtime interno y owner docs | solo si `origin/develop` no lo soporta ya |
| `sst-fend` | ninguna mutacion; consumidor de QA | validacion solamente |
| `4uentes-auth` | ninguna mutacion; proveedor de identidad para QA | validacion solamente |

## Gates

La implementacion debe detenerse si aparece cualquiera de estos casos:

- el runtime exige guardar credenciales reales en Git;
- no existe forma segura de inyectar identidad M2M o configuracion requerida;
- el packaging disponible no corresponde al runtime HTTP de `CR-SST-0168`;
- la worktree no parte de un `origin/develop` actualizado y limpio;
- el despliegue exige exponer directamente `sst-chatbot` al navegador;
- no puede diferenciarse un fallo de Socket.IO de un fallo del hop NDJSON.

## Validacion Minima

- checks de owner en cada repo mutado;
- render y validacion del overlay development;
- imagen construida e identificable por revision;
- pod Ready y endpoints del Service poblados;
- health y stream NDJSON desde dentro del cluster;
- Socket.IO handshake y turno completo desde Chrome aislado;
- logs y evidencia sanitizados;
- `npm run check` completo en el control-plane antes del cierre.

No se escribira en Jira durante esta etapa: Jira sigue siendo mirror y no hay
un lote de escritura autorizado.
