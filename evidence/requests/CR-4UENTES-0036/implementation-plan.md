# CR-4UENTES-0036 - Plan De Implementacion

## Intencion

Mejorar la legibilidad e impacto de la seccion experiencia del Portfolio para
que un recruiter pueda entender rapidamente responsabilidades, evidencias,
alcance y valor profesional sin depender del CV.

## Alcance

- Revisar la experiencia actual visible en `4uentes-portfolio`.
- Mejorar jerarquia de lectura, narrativa de impacto y conexion con evidencia.
- Mantener claims conservadores y verificables.
- Actualizar owner docs/specs del repo hijo.
- Validar con build, QA visual y check completo del control plane.

## Fuera De Alcance

- Activar descarga de CV.
- Reemplazar el asset de CV sanitizado.
- Hacer una remediacion mobile amplia.
- Migrar I18N de la experiencia.
- Agregar backend, BFF, auth, analytics o fetching runtime de GitHub.
- Reescribir Skills/Certificates o Projects fuera de lo necesario para enlaces
  narrativos.

## Politicas Aplicadas

- `owner-documentation-authority-policy`: toda mutacion del repo hijo debe
  actualizar owner docs/specs o registrar excepcion explicita.
- `human-doc-language`: evidencia y documentacion humana en espanol.
- `agent-architecture-boundary-policy`: no se cambia arquitectura ni contratos
  cross-repo fuera del CR.
- `agent-task-atomization-policy`: corte acotado a la seccion experiencia.
- `agent-context-management-policy`: revisar AGENTS, owner docs y archivos
  relevantes antes de mutar.

## Criterios De Cierre

- `4uentes-portfolio` compila.
- La seccion experiencia queda mas escaneable y orientada a impacto.
- Los textos no sobreprometen seniority, impacto productivo o alcance cliente.
- Owner docs/specs reflejan el cambio.
- QA visual desktop/mobile basico documentado.
- `4uentes-orchestor: npm.cmd run check` pasa.
