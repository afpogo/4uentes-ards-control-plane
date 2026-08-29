# CR-SST-0229: lote exacto para iniciar ejecución

Fecha: 2026-08-28  
Estado: `approved-for-running-publication-only`

## Autorización consumida

La instrucción `comencemos la fase de ejcucion` habilita la creación,
validación y publicación canónica del lifecycle `running`. No habilita todavía
crear un worktree en `sst-4uentes-infra`, editar o publicar el owner, consultar
runtime, aplicar manifests, reiniciar componentes ni escribir Jira.

## Readback owner previo al lote

GitHub reportó `develop@620c42c` después del merge del PR owner `#20`. El árbol
histórico continúa dirty en
`fix/SST-26/CR-SST-0086/development-gitops-readiness@f3f2737` y conserva los
mismos ocho artefactos objetivo. La comparación actual mantiene cuatro rutas
con cambios concurrentes upstream.

El SHA de `develop` debe refrescarse nuevamente antes de cualquier futura
creación de worktree owner. Este documento no lo congela como base de
ejecución.

## Rutas permitidas para una autorización posterior

- `argocd/argocd-project.yml`;
- `k8s-manifests/bootstrap/kind/sst-cluster-dev.kind.yml`;
- `specs/infra/clusters/sst-dev-kind.yaml`;
- `specs/infra/clusters/00-index.yaml`;
- `specs/states/stabilize-kind-api-server-port.yaml`;
- `specs/states/00-index.yaml`;
- `docs/runbooks/ngrok-durable-development.md`;
- `docs/runbooks/argocd-kind-development.md`.

Las rutas `argocd/argocd-project.yml`,
`docs/runbooks/argocd-kind-development.md`,
`specs/infra/clusters/sst-dev-kind.yaml` y `specs/states/00-index.yaml`
requieren reconciliación semántica manual porque también cambiaron en
`develop`.

La lista es cerrada: ningún archivo implícito puede agregarse durante el port.

## Rutas excluidas

- `docs/00-overview.md`;
- `docs/environments/README.md`;
- `docs/runbooks/ghcr-private-pull-development.md`;
- `specs/00-index.yaml`;
- `specs/infra/environments/00-index.yaml`;
- `specs/infra/environments/development.yaml`;
- `specs/infra/environments/production.yaml`;
- `specs/infra/environments/test-demo.yaml`;
- `specs/states/implement-durable-ngrok-edge.yaml`.

Esas rutas pertenecen a otras intenciones presentes en el árbol dirty. No se
incorporan por proximidad temporal.

## Reglas de preservación

- El árbol histórico no se limpia, stashea, resetea, rebasa, cambia de branch,
  commitea ni retira.
- No se fusiona ni se hace cherry-pick de la branch completa.
- El port futuro se hará en un worktree limpio creado desde un SHA de
  `develop` confirmado directamente con GitHub.
- Cada hunk se revisará por scope y datos sensibles antes de transportarse.
- La documentación nueva usará `CR-SST-0229`; `CR-SST-0210` quedará sólo como
  etiqueta histórica explícita.
- No se crearán `robots.txt` ni `llms.txt`.

## Próximo gate

Después del merge y readback de este lifecycle se pedirá una autorización
separada que enumere:

1. creación de un único worktree owner limpio;
2. port selectivo limitado a las ocho rutas;
3. validaciones no mutantes del owner;
4. commit, PR, merge y readback owner;
5. prohibición de aplicar el cambio al cluster o ejecutar reinicios.

Los probes runtime read-only y la corrección Jira de `SST-119` continuarán como
gates posteriores e independientes.
