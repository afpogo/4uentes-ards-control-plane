# CR-SST-0231: preflight de identidad y estado owner

Fecha observada: 2026-08-29.

## Resultado

`CR-SST-0231` es el primer identificador SST libre observado después de
`CR-SST-0230`, pero solo quedará reservado cuando este inbox se fusione y se
relea desde la referencia canónica. El label histórico `CR-SST-0211` no puede
reutilizarse: pertenece al request canónico y terminado **Adopt chat retention
facade in Auth**.

## Preflight global de identidad

La referencia remota se refrescó antes de asignar el candidato:

- referencia: `origin/main@394dd1ff5609f78705fbdede811f0ae34957616a`;
- árbol canónico: ninguna aparición de `CR-SST-0231` en requests,
  iniciativas, evidencia, states, specs o docs;
- refs locales y remotas: ninguna branch cuyo nombre o contenido reserve
  `CR-SST-0231`;
- worktrees: ningún path o branch correlacionado con `CR-SST-0231`;
- Jira JQL por `CR-SST-0231`: cero issues;
- Jira JQL por el label histórico `CR-SST-0211`: cero issues;
- Jira JQL por el tema `public landing` o `landing color contrast`: cero
  issues.

Las consultas Jira fueron de solo lectura. No se creó, editó, comentó ni
transicionó ningún issue.

## Colisión histórica

El árbol canónico contiene `CR-SST-0211` como lifecycle completo de la fachada
HTTP de retención de chat en `4uentes-auth`. El checkout raíz histórico del
control-plane conserva, sin publicar, otro lifecycle completo con el mismo ID
para contraste de landing. Esas intenciones son incompatibles; el segundo
lifecycle se conserva únicamente como procedencia y debe reconciliarse bajo
`CR-SST-0231`.

El checkout histórico permanece sobre
`agent/cr-sst-0152-sst-fend-evidence`, con cambios modificados y no trackeados
de múltiples lifecycles. No se limpió, movió, stageó ni descartó contenido.

## Estado owner observado

El checkout `sst-fend` permanece en:

- branch: `fix/SST-26/CR-SST-0086/dictionary-secrets-panel`;
- HEAD: `9148580`;
- upstream: 24 commits por delante del checkout observado;
- estado: dirty, con cambios mezclados y archivos no trackeados de otras
  tareas.

Los artefactos atribuidos históricamente al contraste incluyen:

- estilos de Header, Clock, SstButton, SstSignalTag y Landing;
- tokens Sass en `_colors.scss` y `_settings.scss`;
- specs owner `21-design-tokens.yml`, `36-public-landing-frontend.yml` y
  `37-branding-frontend.yml`;
- docs owner de landing pública y branding.

La coexistencia de esos paths con auth, signup, layout, locales y otros
cambios impide adoptar el diff completo. La planificación deberá separar cada
archivo atribuible, comparar contra el owner remoto y definir recuperación
selectiva antes de cualquier publicación.

## Evidencia histórica, no readback actual

La evidencia local del 2026-08-27 registra:

- 13 nodos de contraste reproducidos y cero después de la corrección;
- `npm run check` owner con 33 suites y 212 tests en PASS;
- Lighthouse accessibility 100 en desktop y mobile;
- secuencia final `localhost:4090 local -> build -> localhost:8088 artefacto
  desplegado`;
- consola limpia en el artefacto de producción y warnings de desarrollo
  preexistentes en 4090.

Estos datos justifican recuperación, pero no son una validación fresca ni
prueban publicación Git owner. Tampoco autorizan el image load y pod recycle
históricos. `robots.txt` y `llms.txt` permanecen expresamente fuera de alcance.

## Boundaries del gate

- No hubo mutación en `sst-fend`, Docker, Kubernetes, runtime o infraestructura.
- No se accedió a secretos, backups ni datos privados.
- No hubo escritura Jira.
- La reserva no autoriza planificación ejecutable, recuperación owner ni
  repetición de browser QA.

## Siguiente gate

1. Validar el control-plane completo.
2. Publicar y fusionar exclusivamente el inbox y este preflight.
3. Releer la reserva desde `origin/main`.
4. Retirar el worktree de reserva limpio y crear uno nuevo de planificación
   desde la referencia canónica refrescada.
5. Inventariar y comparar los cambios owner de forma selectiva, sin tocar el
   checkout dirty.
