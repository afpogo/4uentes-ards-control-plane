# CR-SST-0194 - Resultado Del Gate De QA Integrado

Fecha: 2026-08-23.

## Resultado

El gate integrado local/dev pasÃ³ con Auth, Bend y chatbot ejecutados desde sus
owners publicados y con credenciales sintÃ©ticas inyectadas sÃ³lo en procesos
temporales. No se usaron producciÃ³n, Jira, GitOps ni repositorios de
infraestructura.

La corrida demostrÃ³:

1. registro, login, cookies de sesiÃ³n y JWT de usuario emitidos por Auth;
2. cuenta y tenant explÃ­citos reconstruidos desde la membresÃ­a persistida;
3. memoria canÃ³nica aceptada por revisiÃ³n humana sintÃ©tica;
4. turno realtime Bend -> chatbot autenticado con `chat:process`;
5. recall con grant exacto `user-memory:recall` y cita opaca;
6. audit de recall persistido con un resultado;
7. propuesta final `fact` persistida como `needs_user_review` mediante el grant
   exacto `user-memory:propose`;
8. rechazo del grant incorrecto;
9. rechazo de una referencia de conversaciÃ³n fuera del scope durable;
10. revocaciÃ³n efectiva del socket despuÃ©s de logout.

El provider del smoke fue determinÃ­stico. Los adaptadores HTTP, JWKS, tokens
M2M, sesiÃ³n, membresÃ­a, PostgreSQL, MongoDB, Socket.IO y contratos de memoria
fueron reales dentro del entorno temporal.

## Defectos Encontrados Y Contenidos

La QA integrada descubriÃ³ tres defectos que los checks aislados no exponÃ­an:

- Bend tomaba el tenant del JWT al construir `PrincipalContext`; ahora usa el
  tenant de la membresÃ­a/account persistidos e ignora claims de tenant.
- El resolver SQL del contexto chatbot consultaba `consolidated_users`, pero la
  tabla owner real es `conso_users`.
- El DTO de handoff heredaba `candidate.idempotencyKey` como requerido aunque
  el contrato lo ubica sÃ³lo en el envelope; el campo interno ahora estÃ¡
  prohibido.

Los fixes y sus regresiones estÃ¡n publicados para revisiÃ³n en:

- `sst-bend` PR `#27`, head `be7ba20`;
- `sst-chatbot` PR `#11`, head `6b8826a`.

## ValidaciÃ³n

- Smoke integrado: `npm run smoke:user-memory:integrated` -> PASS.
- Limpieza Bend: primera reconciliaciÃ³n quitÃ³ 1 cuenta y 1 usuario remanentes;
  segunda ejecuciÃ³n quitÃ³ 0 y 0.
- Limpieza Auth: quitÃ³ 9 usuarios sintÃ©ticos y 7 sesiones huÃ©rfanas de intentos
  diagnÃ³sticos; segunda ejecuciÃ³n quitÃ³ 0 y 0.
- `sst-bend`: `npm run test:user-memory` -> PASS; `npm run build` -> PASS.
- `sst-bend`: `npm run check` -> `OK`; la cobertura protegida general quedÃ³ en
  modo parcial permitido por falta de `SMOKE_JWT`, mientras el smoke especÃ­fico
  de CR-SST-0194 sÃ­ ejecutÃ³ autenticaciÃ³n y revocaciÃ³n reales.
- `sst-chatbot`: `scripts/check.py` -> PASS; 172 tests -> PASS.
- `git diff --check` -> PASS en ambos owners.

## Limpieza Del Runtime

Los procesos temporales de Auth, Bend y chatbot fueron detenidos. Los compose
de MongoDB y PostgreSQL fueron bajados sin borrar volÃºmenes. La verificaciÃ³n
final confirmÃ³ compose vacÃ­o y ningÃºn listener en `4010`, `3005`, `3006` ni
`8092`.

## Estado Del Gate

La QA integrada queda aprobada. CR-SST-0194 permanece `running` hasta que los
PRs owner `sst-bend#27` y `sst-chatbot#11` se fusionen y el control plane ejecute
el readback final de commits publicados. No se autoriza despliegue persistente
por esta evidencia.
