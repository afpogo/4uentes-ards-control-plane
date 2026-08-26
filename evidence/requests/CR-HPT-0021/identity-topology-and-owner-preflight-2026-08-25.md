# Preflight De Identidad, Topologia Y Owners De CR-HPT-0021

Fecha: 2026-08-25.

## Identidad Y Aislamiento

- `CR-HPT-0021` no existia en `origin/main` ni en los worktrees observados antes de reservarlo.
- La reserva se fusiono mediante PR `#136` y se releyo en `origin/main@a53c0a194b5dea27313501e3aeeeb32062e79108`.
- La planificacion usa `worktrees/CR-HPT-0021-private-dev-planning` sobre una rama nueva nacida de ese merge.
- Los roots de Phinance, `sst-bend` e infraestructura contienen trabajo ajeno o historico y no son aptos para mutacion.
- El worktree historico `CR-HPT-0016-jira-lifecycle-execution` se conserva porque contiene un commit no fusionado.

## Fuentes Owner Observadas

- Phinance: `origin/main@c81e11467de0901b90a88a41e1759fbc034b9ca7`.
  Publica el verificador RS256/JWKS, las migraciones Alembic y los gates HTTP,
  pero no contiene Dockerfile, Compose, manifests Kubernetes ni contrato de
  despliegue.
- `sst-bend`: `origin/develop@fc5573a7f05433814c1407a7f7f81c7474c54c57`.
  Contiene el merge `845491b` con el proxy listo para consumidor, cerrado por
  `PHINANCE_PROXY_ENABLED=false`, y reutiliza el grant exacto de `sst-bend`.
- Infraestructura: `origin/develop@126f25eeed4d20b7ecba35036a7e35530482c946`.
  Define el cluster kind development, namespace `4uentes-sst`, GitOps por Argo
  CD y secrets fuera de Git, pero no modela Phinance.

Las referencias de Phinance e infraestructura se refrescaron por HTTPS porque
los remotes locales usan SSH y la sesion no dispone de la clave correspondiente.
No se cambio la configuracion de ningun remote ni working tree.

## Decision De Topologia

La instancia sera privada y efimera:

1. Phinance vive como `Deployment` y `ClusterIP` dentro de `env.development`.
2. No tiene Ingress ni puerto de host; el navegador entra por el BFF y la
   fachada protegida existente.
3. Solo `sst-bend` invoca el API. Phinance valida el bearer M2M y el principal
   confiable antes de acceder a datos.
4. PostgreSQL es dedicado, efimero y contiene exclusivamente datos sinteticos.
5. Secrets se crean fuera de Git; la evidencia verifica solamente nombres y
   keys, nunca valores.
6. La activacion del proxy existe solo en el overlay development. El default
   owner permanece en `false`.

## Owners Resueltos

- Runtime, packaging y migraciones: `finanzas-personales`.
- Integracion y fachada: `sst-bend`.
- Contrato de seguridad ya publicado: `4uentes-auth`, read-only.
- Topologia, operacion, rollback y teardown: `sst-4uentes-infra`.

## Gaps Y Gates

- Falta inspeccionar y aprobar el nombre exacto del repositorio de imagen antes
  de publicar el primer artefacto Phinance; queda `TODO` y no se inventa.
- La sesion privada de DevTools solicitada no pudo inicializarse porque el
  conector disponible no recibio su politica de aislamiento. Esto no autoriza
  usar un navegador compartido ni cambia el contrato de despliegue.
- Jira requiere un preflight de metadata, jerarquia y duplicados despues de
  publicar este plan; cualquier escritura necesitara un lote exacto separado.
- Ningun owner repo, cluster, Secret o issue Jira fue modificado durante este
  discovery.

## Proxima Compuerta

Fusionar y releer el plan y el lifecycle running. Solo despues se pueden crear
worktrees owner limpios y atomizar packaging e infraestructura. La activacion
live permanece detras de un preflight adicional de imagen, Secret references,
cluster y rollback.
