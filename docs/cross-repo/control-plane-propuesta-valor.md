# Control Plane En 4uentes

## Proposito

Este documento define que es un control plane y como opera
`4uentes-orchestor` dentro del stack 4uentes como orquestador de gobierno
ARDS/SDD.

Tambien resume sus recursos vivos, sus conexiones observadas, el tipo de
trabajo end-to-end que resuelve en desarrollo y su propuesta de valor.

## Que Es Un Control Plane

Un control plane es la capa que:

- mantiene la identidad canonica de servicios y soluciones;
- separa el desired state de la evidencia observada;
- valida entradas antes de permitir ejecucion;
- planifica impacto, riesgo y contexto requerido;
- conserva trazabilidad y evidencia;
- decide que entra, que se planifica, que se aprueba y que se rechaza.

En este repo, el control plane no es el runtime de producto. No expone la logica
de negocio final ni reemplaza a los repos funcionales. Su funcion es gobernar el
flujo entre repos, requests, capacidades y evidencia.

## Como Funciona `4uentes-orchestor`

`4uentes-orchestor` funciona como el orquestador logico del stack:

1. cataloga identidades estables en `catalog/services/*.yaml`;
2. modela soluciones logicas en `solutions/*.yaml`;
3. valida el catalogo y los bindings locales;
4. recibe trabajo como request o handoff estructurado;
5. calcula impacto, contexto y checks requeridos;
6. escribe la respuesta planificada en el lifecycle de `requests/`;
7. conserva evidencia en `inventory/` y, en fases futuras, en `evidence/`.

La regla central es que planificar no es ejecutar. El control plane decide y
documenta; los repos funcionales ejecutan solo cuando el request lo habilita.

## Recursos Vivos

Los recursos vivos del control plane, hoy, son estos:

- `catalog/services/*.yaml`
- `solutions/*.yaml`
- `specs/`
- `docs/`
- `requests/`
- `inventory/`
- `environments/local/bindings.local.yaml`

Lectura operativa de cada uno:

- `catalog/services/*.yaml`: identidades canonicas de servicios.
- `solutions/*.yaml`: agrupaciones logicas que conectan servicios por valor.
- `specs/`: registros y contratos machine-readable.
- `docs/`: modelo humano, policies y playbooks.
- `requests/`: ciclo de vida del trabajo gobernado por el orchestrator.
- `inventory/`: evidencia observada y decisiones de fase.
- `environments/local/bindings.local.yaml`: bindings host-specific que no deben
  contaminar el catalogo estable.

## Con Quien Esta Conectado

Las conexiones observadas del control plane son documentales y de gobierno, no
de ejecucion directa.

Conecta con:

- `4uentes-ards-core` como fuente canonica de estandar ARDS/SDD;
- `sst-bend` como API principal de la solucion `sst`;
- `sst-fend` como frontend web principal de la solucion `sst`;
- `4uentes-auth` como proveedor compartido de autenticacion;
- `sst-extension` como runtime opcional de browser extension;
- `sst-4uentes-infra` como capa GitOps/Kubernetes observada;
- `sst-chatbot` como runtime agente que emite intents estructurados para
  handoff;
- `requests/` como cola documental de trabajo;
- `inventory/` como evidencia de descubrimiento y fase.

Las relaciones logicas observadas para la solucion `sst` incluyen:

- `sst-fend` consume `4uentes-auth`;
- `sst-extension` consume `4uentes-auth`;
- `sst-4uentes-infra` despliega `sst-fend`, `sst-bend` y `4uentes-auth`;
- `sst-bend` pide derivaciones a `sst-chatbot`;
- `sst-chatbot` devuelve resultados validados hacia `sst-bend`;
- `sst-chatbot` solicita handoff hacia `4uentes-orchestor`.

## Que Resuelve End-To-End En Desarrollo

`4uentes-orchestor` resuelve el circuito end-to-end de desarrollo gobernado,
no el runtime de producto.

En concreto resuelve:

- descubrimiento y normalizacion de servicios;
- separacion entre identidad canonica y alias legacy;
- modelado de soluciones logicas multi-repo;
- recepcion de requests o intents con forma validable;
- analisis de impacto sobre servicios y soluciones;
- planificacion de trabajo con riesgo y contexto requerido;
- definicion de evidencia y trazabilidad;
- reconciliacion de trabajo iniciado fuera del orchestrator;
- boundary seguro para handoffs desde agentes como `sst-chatbot`.

Eso significa que el control plane cubre de punta a punta la gobernanza del
cambio: desde la intencion hasta la evidencia.

## Propuesta De Valor

La propuesta de valor del control plane es reducir drift y ambiguedad en un
stack multi-repo.

Beneficios principales:

- una sola identidad canonica por servicio;
- trazabilidad entre request, plan y evidencia;
- menor riesgo de mutar repos funcionales sin control;
- separacion clara entre propuesta y ejecucion;
- mejor lectura de impacto antes de cambiar codigo o infraestructura;
- handoff seguro para agentes IA sin darles poder de ejecucion directa;
- capacidad de auditar que paso, por que paso y con que dependencia.

En la practica, el control plane convierte trabajo disperso en un flujo
gobernado y verificable.

## Limites

El control plane no:

- redefine el estandar ARDS/SDD canonico;
- reemplaza a `4uentes-ards-core`;
- ejecuta runtime productivo por si mismo;
- debe escribir directamente en repos funcionales sin request aprobado;
- debe convertir paths locales en identidad estable.

Su rol es coordinar, validar y registrar.

## Resumen Ejecutivo

`4uentes-orchestor` es la capa de gobierno del stack 4uentes. Mantiene el
catalogo, modela soluciones, recibe handoffs estructurados, planifica cambios y
conserva evidencia.

Su valor no esta en ejecutar producto, sino en hacer que el desarrollo
end-to-end sea auditable, seguro y consistente entre repos, agentes y
infraestructura.
