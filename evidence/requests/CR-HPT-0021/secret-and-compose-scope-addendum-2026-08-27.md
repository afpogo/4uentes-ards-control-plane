# Addendum De Secret Y Docker Compose De CR-HPT-0021

Fecha: 2026-08-27.

## Autorizacion Humana

El owner autorizo continuar con dos unidades adicionales relacionadas con la
misma instancia privada y efimera:

1. generar y referenciar las credenciales PostgreSQL de Phinance en el cluster
   development, sin publicar valores;
2. agregar un Docker Compose owner para levantar Phinance y su PostgreSQL de
   desarrollo local a partir del Dockerfile ya publicado.

La autorizacion no permite reutilizar credenciales reales, copiar datos de
usuario, modificar staging/production, alterar el Secret M2M compartido ni
publicar valores en Git, Jira, logs o evidencia.

## Preflight De Cifrado

La inspeccion read-only de `kind-sst-cluster-dev` no encontro:

- `--encryption-provider-config` en el API server;
- CRDs o deployments de Sealed Secrets;
- CRDs o deployments de External Secrets.

Por tanto, un objeto Kubernetes `Secret` directo estaria protegido en transito
por el API y limitado por RBAC, pero no existe evidencia de cifrado en reposo
en etcd. Base64 no se considera cifrado. Instalar un operador o modificar el
API server seria una decision de arquitectura y operacion del cluster que este
addendum no presume.

## Alcance Aprobado

- `finanzas-personales`: Compose, configuracion de ejemplo sin valores,
  documentacion owner y validacion local reproducible.
- `kind-sst-cluster-dev`: crear `phinance-postgres-secret` solo despues de una
  decision humana sobre el nivel de proteccion aceptado.
- `sst-4uentes-infra`: mantener referencias por nombre y keys; ningun valor en
  Git.

## Compuertas

- Compose puede avanzar despues de publicar y releer este addendum.
- La generacion y escritura del Secret queda pendiente de elegir entre aceptar
  un Secret efimero fuera de Git para este kind local o abrir una unidad de
  cifrado en reposo del cluster.
- La activacion GitOps continua separada y posterior al Secret preflight.
