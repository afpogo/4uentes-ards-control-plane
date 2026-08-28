# CR-SST-0229: preflight de identidad y estado owner

Fecha: 2026-08-28  
Ref canónica del control plane: `origin/main@b268847820a196ea550cb9852807b79a4163ceb9`  
Resultado: `available-for-local-reservation-validation`

## Identidad global

La búsqueda en el árbol canónico, las referencias Git y los worktrees activos
no encontró `CR-SST-0229` ni `cr-sst-0229` antes de crear este intake.

Los IDs `CR-SST-0223` a `CR-SST-0227` se omitieron porque un worktree activo
señala una asignación concurrente para planes de procesamiento de artículos.
Una branch no constituye una reserva canónica, pero competir con esos IDs
crearía una colisión evitable. `CR-SST-0228` ya está publicado para la
migración del cifrado de Secrets del entorno development compartido.

La consulta read-only del proyecto Jira `SST` no encontró un issue con el texto
exacto `CR-SST-0229` ni otro resultado compatible con la reconciliación del
puerto de la API de kind. No se realizó ninguna escritura Jira y no se
persistieron identificadores de cuenta o cloud.

## Hechos observados en el repositorio owner

El repositorio `sst-4uentes-infra` se observó en la branch local
`fix/SST-26/CR-SST-0086/development-gitops-readiness`, con `HEAD` en `f3f2737`.
El árbol está dirty y contiene, entre otros, estos artefactos de la ejecución
histórica:

- `k8s-manifests/bootstrap/kind/sst-cluster-dev.kind.yml`, modificado;
- `specs/infra/clusters/sst-dev-kind.yaml`, modificado;
- `specs/infra/clusters/00-index.yaml`, modificado;
- `specs/states/stabilize-kind-api-server-port.yaml`, sin trackear;
- `specs/states/00-index.yaml`, modificado;
- `docs/runbooks/ngrok-durable-development.md`, modificado;
- `docs/runbooks/argocd-kind-development.md`, con cambios staged y unstaged;
- `argocd/argocd-project.yml`, modificado.

Los archivos observados describen `127.0.0.1:16443 -> 6443` para la API de
kind y `127.0.0.1:8088 -> 32080` para ingress. Esto prueba que el diseño y la
evidencia existen en el árbol local owner; no prueba que esos cambios estén
integrados en una ref remota canónica.

La ref remota local `origin/fix/SST-26/CR-SST-0086/development-gitops-readiness`
apunta al mismo commit `f3f2737`, mientras los artefactos enumerados aparecen
como cambios posteriores en el worktree. Se intentó una lectura directa del
remoto con `git ls-remote`, pero falló porque la credencial SSH disponible no
fue aceptada. Por lo tanto, la actualidad del remoto queda `unverified`; no se
declara publicación, merge ni cierre owner.

## Procedencia histórica y falso positivo evitado

La evidencia histórica del control plane atribuye a la etiqueta local
`CR-SST-0210` una recreación controlada del cluster, recuperación de Argo CD,
validación posterior al reinicio del host y respuestas HTTP esperadas. Esa
etiqueta colisiona con un lifecycle ya publicado para otro propósito y sólo se
conserva como procedencia.

El estado correcto para esta reserva es:

- diseño y ejecución histórica observados;
- cambios owner locales y dirty;
- publicación remota actual no verificada;
- reconciliación canónica todavía no planificada ni ejecutada;
- ninguna nueva validación runtime realizada bajo `CR-SST-0229`.

La existencia de contenedores, listeners o archivos no se utilizará por sí sola
como prueba de disponibilidad de `localhost:8088`. Una futura validación deberá
separar binding Docker, Service/Ingress, workloads, rutas HTTP y respuesta del
frontend para evitar falsos positivos.

## Límites aplicados

Este preflight no modificó el repositorio owner, el cluster, Docker, el host,
backups, Secrets ni Jira. Tampoco crea ni propone `robots.txt` o `llms.txt`, que
permanecen fuera del alcance SST por decisión del operador.

El operador autorizó el lote exacto de publicación de esta reserva: commit,
push, PR, merge y readback canónico. El plan de recuperación owner debe abrirse
desde una ref canónica refrescada después del merge y no autorizará
automáticamente mutaciones del repo hijo o del runtime.
