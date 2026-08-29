# Autorización de running owner y batch Jira

## Decisión humana

El 2026-08-28, 4uentes autorizó expresamente ambos gates enumerados para `CR-SST-0223`.

## Gate owner

Se permite publicar el lifecycle `running` y, únicamente después de su merge y readback, crear un worktree limpio de `sst-bend` desde `origin/develop` refrescado. La mutación queda limitada al plan publicado: ARDS/SDD owner, mapas, migraciones reversibles no ejecutadas, modelos, repositorios, casos de uso, adaptadores de rutas y pruebas focales.

Quedan prohibidos el checkout dirty existente, deployment, infraestructura, ejecución de migraciones sobre entornos compartidos, datos productivos y cambios en chatbot, Fend u otros owners.

## Gate Jira

Se permite un batch de un solo uso para crear exactamente una Subtask de `CR-SST-0223` bajo `SST-122`, validar el readback y aplicar únicamente la transición `21` hacia `En curso`.

La autorización no incluye comentarios, links, labels, assignee, adjuntos, worklogs, otros issues, segunda transición ni creación de mirrors para `CR-SST-0224` a `CR-SST-0227`.

## Privacidad

La evidencia debe omitir identidad personal, correo, credenciales, tokens e identificadores internos del conector Atlassian.
