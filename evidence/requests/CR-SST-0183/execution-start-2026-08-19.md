# Inicio de ejecución de CR-SST-0183

## Autoridad y frontera

`CR-SST-0183` avanza desde el lifecycle planificado y aprobado el 2026-08-15.
El usuario pidió continuar el 2026-08-19 después de fusionar el gate previo del
control plane. La mutación queda limitada a `sst-extension`; no autoriza
publicación, nuevas capacidades visuales, permisos adicionales, datos
productivos, escrituras Jira ni creación de secretos.

## Contrato predecesor

La PR draft #9 de `4uentes-auth` congela el contrato de familias independientes,
CAS por generación y logout por `sid`. Sus checks owner y GitHub están verdes.
La extensión puede implementar y validar su coordinación local sin fusionar ni
desplegar Auth.

## Gates de ejecución

- Worktree limpia desde `origin/develop` refrescado.
- Background MV3 como dueño único de refresh y logout.
- Escrituras conscientes de generación y barrera terminal de logout.
- Fallback seguro ante ausencia o rechazo de `browser.storage.session`.
- Flujo de permisos opcionales existente, sin ampliar permisos ni UI.
- Owner docs, check completo, build MV3, `git diff --check` y scan secret-safe antes del PR.
