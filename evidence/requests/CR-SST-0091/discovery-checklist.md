# CR-SST-0091 - Checklist De Discovery `sst-bend`

## Proposito

Esta checklist define que hay que observar en `sst-bend` antes de editarlo.
Debe ejecutarse read-only y dejar evidencia.

## Repo

- path local;
- branch actual;
- remote/upstream;
- estado dirty;
- archivos no trackeados relevantes;
- stash existente si aplica.

## Arquitectura Local

- framework HTTP;
- patron de rutas/controllers;
- patron de servicios de aplicacion;
- patron de validacion de input;
- patron de errores/warnings;
- patron de tests.

## Persistencia

- ORM o query layer;
- ubicacion de modelos;
- ubicacion de migrations;
- naming convention de tablas;
- soporte de JSON/JSONB o equivalente;
- patron de rollback.

## Auth Y Scope

- middleware de autenticacion;
- obtencion de `tenant_id`;
- obtencion de `account_id`;
- obtencion de `user_id`;
- tests existentes de autorizacion;
- helpers reutilizables para scope filtering.

## Memoria Y Learning Content Existente

- modelos o tablas de `user_memory_event`;
- modelos o tablas de facts/intenciones;
- servicios de memoria;
- POC de parser de `learning-content`;
- endpoints existentes relacionados con tags o fuentes;
- fixtures o tests existentes.

## File Plan Requerido

Antes de mutar, registrar:

- archivos de modelo/entity;
- migrations;
- servicios;
- controllers/routes;
- validators/schemas;
- tests unitarios;
- tests de integracion;
- fixtures;
- docs o specs locales que deban actualizarse.

Si algun path no existe o el repo usa otro patron, registrar `TODO` con la
decision pendiente en vez de inventar estructura.
