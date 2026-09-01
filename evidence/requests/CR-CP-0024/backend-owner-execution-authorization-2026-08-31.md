# Autorización de ejecución owner para Backend

## Fuente humana

El 2026-08-31, `4uentes` instruyó crear y fusionar los PRs necesarios para
completar las tareas, siguiendo las policies y usando subagentes para discovery
acotado. Bajo las policies de lifecycle y side effects, esta autorización se
consume para preparar y publicar el PR Backend; no permite su merge automático.

## Permitido

- publicar y leer este gate `running`;
- crear un worktree limpio desde Backend `origin/develop@28ce139`;
- recuperar los 51 paths HPT y los cuatro paths CR-SST-0233 enumerados;
- preservar `CR-HPT-0027`, corregir idioma y reconciliar scripts duplicados;
- implementar y ejecutar pruebas PostgreSQL descartables;
- ejecutar checks owner, HTTP, receipts, M2M y regresión de roles;
- publicar el PR Backend.

## Prohibido

- fusionar el PR Backend;
- publicar imagen o actualizar Infra;
- desplegar o sincronizar Argo CD;
- usar datos, secretos o credenciales reales;
- escribir en Jira;
- ampliar paths sin republicar el manifest;
- promover hacia `master`.

La autorización se consume al publicar el PR owner. El merge requiere un gate
posterior con PR, SHA, checks, pruebas PostgreSQL, imagen, pin Infra y rollback
enumerados.
