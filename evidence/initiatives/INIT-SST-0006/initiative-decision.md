# Decisión de Initiative

Fecha: 2026-08-04

Se crea `INIT-SST-0006` para gobernar la resiliencia estructural y el rebranding de las superficies de acceso de SST. El signin real vive en el header como popover abierto por `/?auth=login`; signup vive en `/signup` dentro de un shell dedicado. No son la misma superficie y necesitan CRs separados.

La Initiative reutiliza `SST-72` como Epic primaria. Crear otra Epic duplicaría un programa ya existente. Jira sigue siendo mirror; la autoridad de alcance, lifecycle y cierre permanece en ARDS/SDD.

## Límites

- Preservar `/?auth=login`, el redirect `/login -> /`, `/signup` y el retorno a signin.
- Preservar `AuthActor`, formularios, cookies, CSRF, refresh, logout, RBAC y payloads.
- Separar seguridad, legal y API boundary del rebranding visual.
- No modificar `sst-fend` hasta que el CR correspondiente esté planificado y la documentación owner quede declarada.
- No afirmar cierre visual sin pruebas actuales de Chrome DevTools y checks completos.

## Policies aplicadas

La tarea se clasificó `complex-high-risk-task` por tocar autenticación, privacidad, arquitectura UI y evidencia visual. Se usó el perfil normal/default `gpt-5.6-sol` con razonamiento máximo. Los subagentes ejecutaron relevamientos read-only y el agente principal retuvo decisiones de seguridad, arquitectura, Jira y lifecycle.

