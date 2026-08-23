# Inicio autorizado de ejecución de CR-SST-0210

## Decisión

El usuario autorizó explícitamente la ejecución de `CR-SST-0210` el
2026-08-23 con el texto `autorizo`. La autorización se limita a `sst-bend` y a
la adopción en development del contrato de identidad y scope de memoria ya
publicado por el control plane.

No autoriza cambios en Jira, `4uentes-auth`, `sst-chatbot`, `sst-fend`,
`sst-extension`, infraestructura, producción, despliegues ni datos reales.

## Clasificación operativa

- task weight: `complex-high-risk-task`;
- riesgo: autenticación, autorización, memoria privada, aislamiento
  multi-tenant, migración y contrato cross-repo;
- provider: `codex`;
- resource level/source: `normal/default`;
- perfil: `gpt-5.6-sol`, reasoning `max`;
- fallback: `gpt-5.5`, reasoning `high`;
- delegación: `none`, porque las decisiones de identidad, autorización y
  migración permanecen en el agente principal.

## Preflight del owner

El binding local resolvió el owner lógico `sst-bend`. Su checkout canónico está
dirty sobre una rama de `CR-SST-0086`, con cambios tracked y untracked ajenos a
este request. Ese checkout queda preservado: no se limpiará, reseteará,
commiteará ni reutilizará.

También existen worktrees históricos o activos de otros requests, incluidos
dos árboles de `CR-SST-0193`. No existe branch ni worktree de `CR-SST-0210` en
el owner. La ejecución creará uno nuevo desde `origin/develop` refrescado sólo
después de fusionar este lifecycle `running`.

## Unidad autorizada

1. Publicar el contrato owner de `PrincipalContext`, tenant, application y
   memory space.
2. Persistir un tenant SST explícito, sin `default` ni `legacy`.
3. Resolver membership, account y usuario dentro de `sst-bend`.
4. Fijar `application_id=sst` y separar caller/productor.
5. Revalidar la tuple completa en cada operación de memoria.
6. Ejecutar migración smoke, pruebas negativas, HTTP QA sintético y el check
   completo del owner.
7. Registrar rutas owner y resultados en el control plane antes del cierre.

## Surfaces owner obligatorias

- `specs/api/users-accounts-robots.yaml` y su doc derivada;
- `specs/api/auth.yaml` y su doc derivada;
- índices `specs/api/00-index.yaml` y `docs/00-overview.md`;
- spec/doc dedicados de identidad y scope de memoria personal;
- capability outbound para consumidores;
- harness HTTP reproducible con valores sintéticos;
- runtime, migraciones y tests correspondientes.

## Gate de ordenamiento

Este commit del control plane no modifica el child repo. El orden obligatorio
es:

```text
running lifecycle PR
  -> merge y readback de origin/main
  -> refresh de sst-bend origin/develop
  -> worktree owner limpio
  -> specs/docs owner
  -> runtime + migración + tests
  -> PR owner y checks
  -> evidencia/control-plane closure
```

Hasta completar el merge del lifecycle, el estado de implementación es
`not-started-awaiting-running-lifecycle-merge`.
