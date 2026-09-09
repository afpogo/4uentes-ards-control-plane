# Inicio de la adopción BFF de Learning

- Rol: evidencia y playbook del gate de inicio.
- Owner: `4uentes-orchestor`.
- Autoridad: plan publicado `CR-SST-0235` y autorización humana «ok avancemos».
- Alcance: publicación del running; todavía sin modificación del owner Auth.

## Readback y dependencias

GitHub confirmó PR #279 fusionado en `0bfd831213efbbac435a940eb549dd5625cc1d9a`
el `2026-09-08T00:59:16Z`. El merge es ancestro de la ref refrescada
`origin/main@55ab208`. GitHub no reportó checks en statusCheckRollup; el check
local completo de la evidencia anterior pasó. No se afirma CI verde inexistente.

La búsqueda de PRs CR-SST-0235 en Auth y de PRs abiertos en el control plane no
devolvió resultados. El ID y plan ya estaban reservados. Se creó un worktree
limpio desde esa ref canónica, preservando los checkouts con cambios ajenos.

El plan exige publicación y checks owner de Bend, ya documentados en PR 33.
No exige declarar todo CR-SST-0234 terminado para preparar BFF. La QA positiva
de persistencia y la validación E2E siguen pendientes, sin excepción concedida.

## Trabajo owner que prepara este inicio

1. Refrescar develop de Auth antes de crear el worktree owner.
2. Adoptar contrato, capabilities y guía de relay con mapa y fallback textual.
3. Probar el passthrough existente de descriptores y snapshots antes de
   introducir cambios; conservar el boundary de identidad vigente.
4. Resolver sanitización de errores y límites sin trasladar dominio SST a Auth.
5. Probar con dobles en memoria y ejecutar checks owner/control plane.

El runbook de implementación y rollback debe publicarse en Auth antes del código.
No aplica rollback runtime a este gate documental; sus cambios pueden revertirse
mediante un commit. Este documento no autoriza datos, deployments ni Jira.

## Próximo gate

El check completo del control plane pasó el 2026-09-08 con 0 fallos;
solo aparecieron los warnings históricos de CR-SST-0016 y bindings opcionales.

Merge y readback del running. Después, ejecución owner autorizada y acotada al
relay, documentación y pruebas sin DB. El frontend permanece en CR-SST-0236 y
la aceptación integrada en CR-SST-0237.
