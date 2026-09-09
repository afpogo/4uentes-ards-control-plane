# CR-SST-0239: preflight de identidad y frontera del edge

## Resultado

`CR-SST-0239` estaba libre al iniciar este plan. No se observaron coincidencias
en `origin/main`, branches, worktrees, pull requests ni Jira por summary o
label. La base aislada se reconcilio antes de publicar sobre
`origin/main@75cab78`.

El readback del PR `#278` confirmo el cierre de CR-SST-0217 en el merge
`5311af220a2a513aa145517676a076ef5fae9e65`. Jira permanece alineado con el
control plane: SST-117 sigue En curso sin resolucion bajo SST-113; SST-113 y la
Epic SST-86 siguen abiertas. No se realizo ninguna escritura Jira.

## Relevamiento ARDS/SDD

El control plane identifica a `sst-4uentes-infra` como autoridad del edge. Su
ARDS/SDD owner ya define:

- dominio HTTPS reservado de ngrok sobre el origin local estable;
- GitHub OAuth mediante Traffic Policy antes de que la solicitud llegue a SST;
- politica individual de menor privilegio con scope `read:user`;
- runbook de alta de colaboradores y validacion con sesion OAuth interactiva;
- prohibicion de persistir URL privada, cookies, tokens o secretos.

Fuentes owner relevadas:

- `docs/runbooks/ngrok-durable-development.md`;
- `docs/runbooks/add-oauth-collaborator-access.md`;
- `docs/runbooks/access-urls-and-credentials.md`;
- `specs/states/implement-durable-ngrok-edge.yaml`.

No corresponde crear un runbook paralelo en el control plane ni mover la
decision a Auth, Bend o Fend. El camino preferido es reutilizar una sesion de
operador ya allowlisted. Si esa via no esta disponible, cualquier cambio de
allowlist o reinicio de ngrok necesita una autorizacion operativa exacta.

## Limites preservados

Este checkpoint no autoriza publicacion Git, Jira, runtime, navegador
autenticado, configuracion ngrok, reinicio de servicio, repos hijos,
deployment, cluster, datastore, secretos ni produccion. El cleanup de
identidades sinteticas queda fuera de CR-SST-0239 y requiere un lifecycle
independiente.
