# CR-SST-0222 - Plan de reconciliacion

Fecha: 2026-08-28

## Resultado del discovery

La desviacion no afecta solamente a los dos cambios recientes de `sst-fend`.
El arbol stale tambien contiene:

- `CR-SST-0177`, usado para crear `SST-101/SST-102` pero nunca publicado como
  lifecycle canonico;
- `CR-SST-0210`, que goberno una mutacion real de `sst-4uentes-infra`, la
  recreacion controlada del cluster, el reboot del host y el cierre de
  `SST-119`, pero colisiona con el request canonico de memory identity scope;
- `CR-SST-0211`, contraste de landing, colisionado con Auth chat retention;
- `CR-SST-0212`, readiness frontend-auth, colisionado con SST Phinance facade.

## Plan seguro

`CR-SST-0222` conserva solamente la coordinacion y la reconciliacion del
control-plane. No absorbe las mutaciones historicas de distintos owners en un
unico lifecycle.

La secuencia obligatoria es:

1. publicar y releer `INIT-SST-0009` y este plan;
2. reservar y reconciliar infraestructura bajo un nuevo CR;
3. reservar y reconciliar contraste bajo otro CR;
4. reservar y reconciliar readiness bajo otro CR;
5. preparar una correccion Jira exacta para `SST-102` y `SST-119`;
6. abrir despues el assessment de journeys y lineas base.

Cada reserva es secuencial. No se asignan por anticipado `CR-SST-0223` ni IDs
posteriores porque otra branch podria publicarlos antes del siguiente preflight.

## Evidencia funcional preservada

Los hechos siguientes se retienen como evidencia historica que cada request
retroactivo debera atribuir y, cuando el riesgo lo requiera, revalidar:

- kind API fijo en `127.0.0.1:16443`, ingress `localhost:8088`, GitOps healthy
  y recuperacion despues de reboot;
- landing en `localhost:4090` y artefacto en `localhost:8088` con accessibility
  100 y cero fallos de contraste en desktop/mobile;
- readiness frontend-auth PASS en host y contenedor, con negative path
  atribuible y sin credenciales;
- `sst-fend npm run check` PASS con 33 suites y 212 tests;
- checks completos del control-plane historico reportados como PASS.

Esos hechos no convierten los labels historicos en identidades validas ni
permiten importar todo el worktree dirty.

## Mutaciones prohibidas en este gate

- ninguna edicion, limpieza, commit o publicacion de repos hijos;
- ninguna recreacion o reinicio de cluster/host;
- ninguna operacion sobre datos, backups o secretos;
- ninguna escritura Jira;
- ninguna creacion de `robots.txt` o `llms.txt`.
