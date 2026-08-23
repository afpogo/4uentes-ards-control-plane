# Inicio de ejecución de CR-SST-0204

## Decisión

El usuario autorizó el 2026-08-22 comenzar la adopción en repositorios hijos
siguiendo las policies ARDS/SDD. La primera unidad ejecutable es
`CR-SST-0204`, porque `sst-bend` debe publicar el contrato owner antes de que
`CR-SST-0211` pueda adoptarlo en `4uentes-auth`.

La autorización queda limitada a `sst-bend`. No habilita cambios en
`4uentes-auth`, `sst-fend`, infraestructura, Jira, deployment o producción.

## Preflight

- La reserva y planificación de `CR-SST-0211` están fusionadas en
  `origin/main@a50e092`.
- `CR-SST-0204` existe en inbox y planned bajo la identidad canónica.
- El checkout canónico observado de `sst-bend` contiene cambios ajenos y se
  preserva sin modificación.
- La ejecución debe usar un worktree limpio desde `origin/develop` refrescado.
- Se revisaron `AGENTS.md`, el registry local de policies y la autoridad de
  documentación owner de Bend.

## Boundaries

- Bend es autoridad sobre contrato, estado temporal, PostgreSQL, Redis
  cache-aside, ownership y errores de dominio.
- Auth solamente podrá adoptar el contrato publicado en un lifecycle posterior.
- Fend y QA permanecen bloqueados por sus dependencias publicadas.
- No se registra contenido de conversaciones, tokens, cookies ni secretos en
  evidencia.

## Gates antes de cierre

1. Specs, docs y capability outbound deben quedar en `sst-bend` junto al
   runtime y las pruebas.
2. La semántica de compatibilidad entre finish temporal y delete durable debe
   quedar explícita.
3. El check completo del owner debe pasar; cualquier coverage protegido
   omitido por falta de JWT se registra sin presentarlo como validación total.
4. El check completo del control plane debe pasar antes del cierre local.
5. Jira, deploy y producción quedan fuera de esta ventana.
