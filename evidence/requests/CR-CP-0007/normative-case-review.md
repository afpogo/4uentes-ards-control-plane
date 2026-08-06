# Revision De Casos Normativos

| Caso | Resultado esperado |
| --- | --- |
| Jira Work disponible con Rovo bloqueado | Continuar con Jira Work/JQL y registrar degradacion semantica |
| Creacion duplicada | Rechazar creacion y reconciliar identidad |
| Señal Jira observada | Registrar intake read-only sin mutacion local automatica |
| Escritura fuera del lote | Rechazar |
| Intento desde repo hijo | Rechazar |
| Evidencia con secretos o URLs privadas | Rechazar hasta sanitizar |
| Routing ARDS o SST | Derivar del request; ninguno es default global |
| Iniciativa Jira sin Epic primaria unica | Bloquear escritura y reconciliar |
| CR seleccionado sin issue primario unico | Bloquear creacion/transicion y reconciliar |
| Subtask fuera de una Task de la misma Epic | Rechazar parent y reconciliar jerarquia |

Todos los casos quedan cubiertos normativamente por el documento humano. Su
automatizacion futura pertenece a `INIT-CP-0003 / ARDS-13`.

El perfil Jira requiere expresamente `jira-cr-mirror-hierarchy-policy`; no es
solo una relacion informativa.
