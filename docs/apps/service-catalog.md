# Catalogo De Servicios

## Servicio

Un servicio es una unidad logica que el control-plane puede catalogar, validar y
referenciar desde una solucion.

Un servicio puede ser un frontend, backend API, BFF, browser extension,
shared auth provider, agent runtime o repo de gobierno de infraestructura.

## Campos Minimos

Cada `catalog/services/*.yaml` debe incluir:

- `service_id`
- `canonical_identity`
- `kind`
- `status`
- `repo.remote` o `TODO` explicito
- `ards.kind`
- `ards.status`
- `validation.check_command` o `TODO` explicito

## Terminos De Identidad

- `service_id`: identidad logica estable usada por el control-plane.
- `repo.remote`: Git remote observado o esperado para el repo canonico.
- `local_binding`: path host-specific resuelto fuera del catalogo estable.
- `legacy_alias`: nombre historico que no debe convertirse en identidad
  canonica.

## Regla De Paths

Los archivos estables del catalogo no deben contener paths locales absolutos.
Los paths locales pertenecen solo a `environments/local/bindings.local.yaml` o a
evidencia en `inventory/`.

## ARDS Kind

`ards.kind` debe coincidir con un kind de `4uentes-ards-core`:

- `backend-api`
- `backend-bff`
- `frontend-web`
- `frontend-extension`
- `infra-gitops`
- `shared-auth-provider`

Repos de agentes que publican contracts runtime o handoffs cross-repo se
modelan como `backend-api` mientras el estandar no defina un perfil agentic
propio.
