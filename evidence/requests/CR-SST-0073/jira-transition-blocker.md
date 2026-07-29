# Jira Transition Blocker

## Estado

- Fecha: 2026-06-18
- Request: CR-SST-0073
- Issue: `SST-21`
- Accion intentada: transition to active work and start comment

## Resultado

- La observacion read-only de `SST-21` fue exitosa.
- La escritura aprobada fue rechazada por la policy del entorno.

## Motivo reportado por el entorno

- El write exportaria metadata interna del proyecto, del CR y de evidencia
  local hacia Jira.
- Jira fue tratado como destino externo no confiable para esa exportacion.
- La policy rechazo el write incluso con aprobacion explicita del usuario.

## Consecuencia

- `jira_read_executed` queda soportado por evidencia.
- `jira_write_executed` permanece `false`.
- `SST-21` queda observado pero no transicionado desde este runtime.
- El trabajo local puede continuar bajo `CR-SST-0073` como request gobernante.
