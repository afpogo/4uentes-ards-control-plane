# Modelo De Soluciones

## Solucion Logica

Una solucion es un grupo logico de servicios que juntos entregan un producto o
una capacidad operativa.

Las soluciones se modelan en `solutions/*.yaml` y referencian service IDs de
`catalog/services/*.yaml`.

## Grupos De Servicios

Las soluciones pueden agrupar servicios por rol:

- `core`
- `shared`
- `optional`
- `infrastructure`

Estos grupos son logicos y no implican layout de carpetas ni topologia de
deployment.

## Servicios Compartidos

Servicios compartidos, como `4uentes-auth`, pueden ser referenciados por mas de
una solucion. El catalogo debe marcarlos como compartidos y preservar su
identidad canonica.

Alias legacy como `node-auth` pueden registrarse como aliases, pero no deben
usarse como service IDs.

## Repos De Solucion

La Fase 1B no crea `sst-solution` ni `fulbito-solution`.

SST y Fulbito se modelan primero como soluciones logicas. Un repo dedicado de
solucion debe crearse solo despues de una decision explicita posterior.

## Particion De Scope

El control-plane puede catalogar varias soluciones sin mezclar su alcance.
`sst` no es el scope global del control-plane; es una solucion logica dentro del
control-plane. `4uentes` y un futuro `fulbito` deben permanecer como soluciones
separadas salvo que exista una decision explicita de fusion o shared service.

Regla operativa:

- los requests deben declarar la solucion y servicios afectados;
- los servicios compartidos se referencian como `shared`, no como pertenencia
  oculta a una solucion;
- las relaciones entre soluciones deben modelarse como dependencies o shared
  capabilities, no duplicando service IDs;
- un repo hijo conserva la autoridad documental sobre su comportamiento runtime;
- el control-plane conserva autoridad sobre catalogo, request lifecycle,
  evidence y reconciliacion cross-repo.

Ver tambien
[control-plane-scope-partition.md](control-plane-scope-partition.md).
