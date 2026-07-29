# Particion De Scope Del Control-Plane

## Proposito

Definir como `4uentes-orchestor` separa el alcance de SST, 4uentes Portfolio y
futuras apps como Fulbito sin convertir el control-plane en un runtime ni en un
repo de producto.

## Regla Central

El control-plane es global solo para gobierno ARDS/SDD:

- catalogo de servicios;
- soluciones logicas;
- request lifecycle;
- evidencia;
- validacion;
- ownership cross-repo observado.

SST no es el scope global del control-plane. SST es una solucion logica grande
dentro del control-plane. Otros productos deben entrar como soluciones separadas
cuando tengan identidad, repo owner y evidencia suficiente.

## Capas De Scope

| Capa | Ejemplo | Autoridad | Donde se modela |
| --- | --- | --- | --- |
| Control-plane global | requests, policies, catalogo, evidence | `4uentes-orchestor` | `requests/`, `catalog/`, `solutions/`, `evidence/` |
| Solucion | `sst`, `4uentes`, futuro `fulbito` | control-plane para mapa logico; repos hijos para comportamiento | `solutions/*.yaml` |
| Servicio | `sst-bend`, `4uentes-portfolio` | repo owner del servicio | `catalog/services/*.yaml` |
| Repo hijo | repo funcional concreto | repo hijo | ARDS/SDD local del repo |
| Binding local | path de workstation | host local | `environments/local/bindings.local.yaml` |

## Scope Actual

### SST

SST agrupa servicios de una solucion funcional:

- `sst-fend`;
- `sst-bend`;
- `sst-extension`;
- `sst-chatbot`;
- `sst-4uentes-infra`;
- servicios compartidos consumidos, como `4uentes-auth`.

Las decisiones de SST no deben modificar ni condicionar por defecto a
`4uentes-portfolio` o a futuras apps no-SST.

### 4uentes

`4uentes` agrupa activos publicos y corporativos bajo la marca 4uentes.

Hoy incluye:

- `4uentes-portfolio`.

`4uentes-portfolio` pertenece a la solucion `4uentes`, no a SST. Su scope es
presentacion profesional, narrativa laboral y evidencia visible del usuario.

### Fulbito Futuro

Fulbito no debe entrar como `sst-*` ni como parte de `4uentes-portfolio`.

Cuando exista evidencia suficiente, el camino correcto es:

1. crear `catalog/services/<servicio-fulbito>.yaml`;
2. crear o actualizar `solutions/fulbito.yaml`;
3. registrar binding local solo en `environments/local/bindings.local.yaml`;
4. crear request de onboarding o integracion antes de mutar el repo hijo;
5. actualizar documentacion owner en el repo Fulbito o registrar excepcion.

No se debe crear un repo `fulbito-solution` sin decision explicita.

## Evitar Sobrecarga Del Control-Plane

El control-plane puede manejar varias soluciones si mantiene estas restricciones:

- cada request declara `initial_scope.solution` y servicios afectados;
- cada servicio tiene un `service_id` estable;
- los paths locales no entran en `catalog/` ni `solutions/`;
- las decisiones de una solucion no se aplican a otra por default;
- los shared services se modelan como compartidos, no como pertenencia oculta;
- las mutaciones en repos hijos mantienen request, plan, evidence y owner docs;
- las validaciones se ejecutan en el repo owner y se cierran con `npm.cmd run check`
  del control-plane cuando hay mutacion de repo hijo.

La carga del control-plane crece mal si se mezclan scopes, no por tener mas
soluciones. La unidad de aislamiento debe ser la solucion logica.

## Criterio De Decision

Usar una solucion existente solo si el nuevo servicio entrega directamente el
mismo producto o capacidad operativa.

Crear una solucion nueva si:

- el usuario final o caso de uso principal es distinto;
- el ciclo de roadmap puede avanzar sin SST;
- los repos owner no comparten runtime obligatorio;
- la evidencia, requests y validaciones necesitan cierre independiente.

Usar un shared service si:

- varias soluciones consumen una misma capacidad;
- el repo productor conserva ownership independiente;
- el contrato outbound/inbound puede documentarse sin fusionar soluciones.

## Definition of Done Para Nuevas Integraciones

- Existe service catalog entry sin paths absolutos.
- Existe solucion logica o relacion con una solucion existente.
- Existe evidencia local o TODO explicito.
- Existe binding local cuando se valida en esta workstation.
- Si hay repo hijo, su ARDS/SDD owner queda actualizado o con excepcion.
- `npm.cmd run check` pasa antes del cierre local.
