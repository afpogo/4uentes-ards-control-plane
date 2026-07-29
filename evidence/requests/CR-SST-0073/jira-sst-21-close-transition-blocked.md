# SST-21 Jira Close Transition Blocked

## Estado

- Fecha: 2026-06-20
- Request: CR-SST-0073
- Issue: `SST-21`
- Accion intentada: transition to `Listo` and final closure comment

## Resultado

- La validacion local previa fue exitosa.
- El runtime rechazo la escritura outbound hacia Jira durante el cierre.

## Motivo reportado por el entorno

- El write incluia descripcion, labels y comentario final de control-plane.
- La policy del tenant trato Atlassian como destino externo no confiable para
  esa exportacion de metadata interna.
- El rechazo ocurrio incluso con aprobacion explicita del usuario.

## Consecuencia

- `SST-21` queda localmente listo para cierre segun la evidencia de
  `CR-SST-0073`.
- La transicion remota no fue ejecutada desde este runtime.
- El siguiente intento debe hacerse desde un entorno con permiso outbound a
  Atlassian o manualmente por el operador.

## Comando preparado

```powershell
node scripts/jira-mcp/transition-sst-21-close.js --connect --approved --request-id CR-SST-0073 --output-dir evidence/requests/CR-SST-0073 --preferred-transition Listo
```
