# Arquitectura De Informacion De Documentacion

## Proposito

Este documento define como seccionar la documentacion del control-plane para que
requests, responses, material por app y material cross-repo no se mezclen.

El objetivo es orden, no solo almacenamiento.

## Secciones Principales

La documentacion debe organizarse en cuatro secciones principales:

1. `apps/`
2. `platform/`
3. `requests/`
4. `cross-repo/`

La politica de idioma para Markdown humano esta en
[idioma-markdown.md](idioma-markdown.md).

## 1. `apps/`

Usar `apps/` para material que pertenece principalmente a un servicio logico o a
un repositorio canonico.

Ejemplos:

- `sst-bend`
- `4uentes-auth`
- `sst-fend`
- `sst-extension`
- `sst-4uentes-infra` cuando se trata como artefacto de un repo y no como
  comportamiento compartido de plataforma

Poner aqui:

- notas por repo/app
- lecturas de contrato de deployment por app
- analisis de workflows por app
- notas de adopcion de capabilities por app
- checklists de ejecucion por app

No poner aqui:

- decisiones de rollout multi-repo
- mapas de handoff entre repos
- explicaciones del request lifecycle del orchestrator

## 2. `platform/`

Usar `platform/` para infraestructura, nodos, comportamiento de cluster y
mecanicas GitOps compartidas.

Ejemplos:

- Argo CD
- comportamiento de Kubernetes cluster
- ingress
- modelo de sync GitOps
- `prune` y `selfHeal`

Poner aqui:

- tutoriales de cluster/nodo/platform
- reglas operativas GitOps
- comportamiento de Argo CD
- comportamiento de ingress/edge
- riesgos operativos de plataforma

No poner aqui:

- documentacion runtime local de una app
- comportamiento de negocio de un solo repo

## 3. `requests/`

Usar documentacion en `requests/` para semantica de input/output del
orchestrator.

Esta seccion trata del lifecycle del control-plane.

Poner aqui:

- que va en `requests/inbox/`
- que significa un archivo `planned`
- que significan `queued`, `running`, `done`, `rejected`
- como se adjunta evidencia
- como leer riesgo y checks requeridos de un request

Separacion importante:

- input de request:
  `requests/inbox/*.yaml`
- response del planner:
  `requests/planned/*.yaml`
- estado de ejecucion:
  `requests/queued/`, `requests/running/`, `requests/done/`,
  `requests/rejected/`
- evidencia de ejecucion:
  `evidence/requests/<request-id>/`

## 4. `cross-repo/`

Usar `cross-repo/` para cualquier documento cuyo valor principal aparece solo
cuando se consideran dos o mas repos juntos.

Ejemplos:

- handoff de deployment desde repos de app al repo de infra
- handoff BFF entre `sst-bend` y `4uentes-auth`
- boundary entre `sst_chatbot` y `4uentes-orchestor`
- mapas de dependencia
- playbooks de rollout que involucran varios repos

Poner aqui:

- grafos de dependencia
- playbooks de request que coordinan varios repos
- mapas de handoff
- mapas de arquitectura
- explicaciones de deployment multi-repo

No poner aqui:

- docs repo-locales que mencionan otro repo una sola vez

## Regla De Decision De Seccion

Al crear un doc nuevo, preguntar:

1. El dueno principal es un repo o una app?
   Entonces usar `apps/`.
2. El dueno principal es el cluster, GitOps o infraestructura compartida?
   Entonces usar `platform/`.
3. El documento explica input/output o lifecycle del orchestrator?
   Entonces usar `requests/`.
4. El documento solo tiene sentido entre varios repos?
   Entonces usar `cross-repo/`.

## Separacion Request/Response

Para este control-plane, "request" y "response" deben documentarse como capas
distintas.

### Request

Un request es la intencion de entrada.

Almacenamiento canonico:

- `requests/inbox/*.yaml`

### Response

Una response es la interpretacion producida por el orchestrator para ese
request.

Almacenamiento canonico:

- `requests/planned/*.yaml`

Esta response incluye:

- servicios afectados
- contexto requerido
- checks requeridos
- riesgo
- restricciones de ejecucion

### Execution Output

El output de ejecucion no es lo mismo que la response planificada.

Almacenamiento canonico:

- `requests/queued/`
- `requests/running/`
- `requests/done/`
- `requests/rejected/`
- `evidence/requests/<request-id>/`

## Ubicacion Actual De Documentos

Ubicacion canonica actual:

- `docs/apps/service-catalog.md`
- `docs/cross-repo/solutions-model.md`
- `docs/requests/execution-model.md`
- `docs/cross-repo/sst-cluster-dependency-map.md`
- `docs/cross-repo/deployment-request-playbook.md`
- `docs/cross-repo/orchestrator-boundary.md`
- `docs/platform/argocd-self-heal-tutorial.md`
- `docs/platform/argocd-prune-vs-self-heal.md`
- `docs/idioma-markdown.md`

## Regla Operativa

Los docs nuevos no necesitan mover inmediatamente todos los archivos viejos.

Desde ahora:

- los docs nuevos deben clasificarse por seccion
- los indices de seccion deben apuntar a docs canonicos
- docs antiguos en la raiz pueden permanecer hasta que un request controlado de
  limpieza los mueva

Esto mantiene el orden claro sin forzar un refactor grande e inseguro.
