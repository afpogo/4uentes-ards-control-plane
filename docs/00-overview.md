# 4uentes ARDS/SDD Control Plane

`4uentes-ards-control-plane` es el repo de orquestacion logica para gobierno
ARDS/SDD de 4uentes.

Cataloga servicios y soluciones reales sin depender del layout de carpetas
locales. Separa la identidad logica estable de la evidencia observada y de los
bindings host-locales.

## Que Contiene

- `catalog/services/`: catalogo logico de servicios.
- `solutions/`: mapas logicos de soluciones.
- `environments/local/`: ejemplos de bindings locales y archivos
  host-specific ignorados.
- `scripts/`: scripts de validacion determinista.
- `inventory/`: evidencia observada y decisiones de fase.
- `requests/`: lifecycle de requests cross-ARDS/SDD.
- `templates/`: templates reutilizables de requests y manifests de adopcion o
  excepcion.
- `docs/`: modelo operativo legible por humanos.
- `specs/`: indice del control-plane y specs futuras.

## Secciones De Documentacion

La documentacion del control-plane debe separarse por responsabilidad:

- `docs/apps/`: material cuyo dueno principal es una app o un repo.
- `docs/platform/`: infraestructura compartida, nodos y comportamiento GitOps.
- `docs/requests/`: lifecycle de request/response y semantica del
  orchestrator.
- `docs/cross-repo/`: handoffs, mapas de dependencia y modelo operativo
  multi-repo.
- `docs/ai/`: politicas operativas para trabajo con agentes IA.

La regla de clasificacion esta definida en:

- [documentation-information-architecture.md](documentation-information-architecture.md)

La policy activa de idioma para Markdown humano esta definida en:

- [policies/human-doc-language-policy.md](policies/human-doc-language-policy.md)

La guia detallada de idioma y migracion esta definida en:

- [idioma-markdown.md](idioma-markdown.md)

La politica complementaria de seleccion de modelos y subagentes esta definida
en:

- [model-selection-policy.md](ai/model-selection-policy.md)

## Que No Contiene

- Codigo runtime de producto.
- Implementaciones de servicios.
- Desired state de Kubernetes o Docker Compose.
- Estandares ARDS/SDD canonicos.

El estandar canonico vive en `4uentes-ards-core`.

## Modelo Operativo

El control-plane valida primero la consistencia del catalogo. La Fase 2 agrega
planificacion de requests: un request entra en `requests/inbox`, el planner lee
catalogo y soluciones, calcula impacto y escribe el resultado planificado en
`requests/planned`.

Planificar no es ejecutar. Los repos funcionales no se modifican y sus checks no
se ejecutan desde el planner de Fase 2.

El lifecycle de request y su separacion documental se describen en:

- [docs/requests/README.md](requests/README.md)
- [execution-model.md](requests/execution-model.md)

El boundary operativo para handoffs de agentes y `sst_chatbot` esta documentado
en:

- [orchestrator-boundary.md](cross-repo/orchestrator-boundary.md)
