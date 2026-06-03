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
