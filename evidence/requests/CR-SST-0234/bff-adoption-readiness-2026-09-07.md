# Preparación del siguiente gate: adopción BFF

- Rol: evidencia de preflight y guía de decisión.
- Owner: control plane `4uentes-orchestor`.
- Estado: preparado localmente, pendiente de publicación.
- Autoridad: `requests/planned/CR-SST-0235-adopt-learning-source-contract-in-bff.yaml`.
- Alcance: lectura de la revisión publicada de Auth y preparación de adopción;
  no constituye implementación ni cierre de la QA de Bend.

## Gate de dependencia

El plan de CR-SST-0235 exige que CR-SST-0234 publique y pase sus checks owner.
La evidencia de PR 33 y del runtime cumple ese prerrequisito técnico. Esto
permite preparar el running de BFF sin afirmar que CR-SST-0234 esté cerrado.
La prueba positiva persistente sigue pendiente bajo la restricción del usuario
de no seeders ni cambios de base de datos. No se modifica ese criterio de cierre.

## Baseline comprobada

`git ls-remote` confirmó que `afpogo/4uentes-auth`, rama `develop`, apunta a
`ff5605c67d412e3e363d58de14a5b6b98b38c4ad`, igual que la ref local consultada.
La inspección de código se realizó con `git show origin/develop:<archivo>`;
el checkout principal tiene cambios ajenos y quedó intacto. No se encontró
branch local/remota cacheada ni worktree con CR-SST-0235; antes de implementar
se debe completar la búsqueda remota de PRs y refrescar la baseline.

## Hallazgos del relay existente

| Componente | Observación sobre la revisión comprobada |
|---|---|
| Rutas Learning | Ya existen me, context, preview, accept y reject, con validación JWT |
| Controller | Reenvía body quitando user y authTokenPayload agregados por middleware |
| Contexto autenticado | Usa getAccountContextHeadersFromReq y Authorization |
| Datasource | Reenvía request.body y response.data sin transformación semántica |
| Errores upstream | validateStatus acepta todo; respuestas HTTP de error se devuelven con body original |
| Capability inbound | Versión 1.1.0, asociada a CR-SST-0116; no declara la nueva adopción de descriptores/snapshots |

Referencias owner: `src/presentation/learning-workspaces/{routes,controller}.ts`,
`src/infrastructure/datasources/learning-workspaces.datasource.impl.ts`,
`src/domain/use-cases/LearningWorkspaces/proxyLearningWorkspaceRequest.usecase.ts`,
`specs/capabilities/inbound/sst-bend--learning-workspace-context.yaml`.

La ausencia de validación específica no prueba que el descriptor sea descartado:
el passthrough genérico podría transportarlo. Hay que probarlo antes de cambiarlo.
De igual forma, el reenvío de errores sin filtro es una brecha respecto del plan,
pero no prueba por sí solo exposición de un secreto en runtime.

## Lote owner propuesto

1. Publicar y leer de vuelta el running CR-SST-0235 antes de mutar Auth.
2. Adoptar la versión real de la capability Bend; actualizar contrato relay,
   guías inbound/outbound, mapa browser–BFF–Bend y runbook owner.
3. Verificar preservación de descriptor/snapshot y contexto autenticado;
   corregir solo diferencias comprobadas y sanitización de errores.
4. Validar límites de payload y fallos con dobles en memoria, sin servicios de
   base de datos, seeders ni requests mutantes al entorno compartido.
5. Ejecutar checks completos owner y control plane; publicar PR owner.

El runbook ejecutable pertenece a Auth y debe existir antes de implementar;
este preflight no lo reemplaza. No se despliega ni ejecuta migraciones en este
lote. CR-SST-0236 permanece posterior al handoff BFF; la aceptación E2E conserva
su identidad CR-SST-0237. No se cambia Jira en este preflight.

## Publicación pendiente

La evidencia autenticada y este preflight amplían el lote local de la rama
`agent/cr-sst-0234-manual-qa-jira-preflight`. El push anterior fue rechazado por
revisión automática al considerar no verificada la confianza del destino y
no explícitos el payload y destino autorizados. No se elude ese rechazo ni
se presenta el trabajo local como integrado en main.
