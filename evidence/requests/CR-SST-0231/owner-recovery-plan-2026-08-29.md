# CR-SST-0231: plan de recuperación owner

Fecha observada: 2026-08-29.

## Resultado

El cambio histórico de contraste puede recuperarse como un port semántico
acotado a doce paths. No se debe integrar la branch ni copiar archivos
completos desde el checkout dirty. La planificación no modificó `sst-fend`,
runtime, infraestructura ni Jira.

## Baselines diferenciadas

- Checkout histórico: branch
  `fix/SST-26/CR-SST-0086/dictionary-secrets-panel`, HEAD `9148580`, dirty y
  mezclado con cambios de auth, signup, layout, locales y otras tareas.
- Baseline remota owner: `develop@bd9b8d2aa52aab2346b7bf94b0db05ed188c09a3`.
- `git ls-remote` y `origin/develop` coincidieron sin ejecutar fetch ni
  modificar refs del owner.
- El HEAD histórico es ancestro de `develop` por 39 commits.

Ninguno de esos 39 commits cambia los doce paths seleccionados. El delta
dirty→HEAD y dirty→develop es idéntico: 12 archivos, 75 adiciones, 23
eliminaciones y `git diff --check` en PASS. Así se evita atribuir al request
una diferencia causada por avance upstream.

## Allowlist exacta

### Estilos runtime

- `src/assets/styles/sass/base/_colors.scss`
- `src/assets/styles/sass/lib/_settings.scss`
- `src/components/Clock/styles.module.scss`
- `src/components/Header/Header.module.scss`
- `src/components/SstButton/styles.module.scss`
- `src/components/SstSignalTag/styles.module.scss`
- `src/pages/Landing/styles.module.scss`

### Documentación owner

- `specs/21-design-tokens.yml`
- `specs/36-public-landing-frontend.yml`
- `specs/37-branding-frontend.yml`
- `docs/36-public-landing-frontend.md`
- `docs/37-branding-frontend.md`

Todo path dirty o no trackeado fuera de esta lista queda excluido.

## Decisión semántica

El port futuro debe:

- agregar un foreground success acotado sin alterar la paleta canónica del
  logo;
- usar combinaciones accesibles para Clock, Header, botones, tags y copy de
  roadmap;
- publicar el umbral WCAG AA de `4.5:1` y la diferencia entre color raw de
  marca y uso accesible como foreground;
- corregir las rutas Sass desactualizadas en la spec de tokens;
- preservar la secuencia `4090 local → build → 8088 artefacto desplegado`;
- mantener `robots.txt` y `llms.txt` fuera de los requisitos SST.

No se transportarán patch bodies desde el control-plane. Cada hunk deberá
reaplicarse y revisarse dentro de un worktree owner limpio, después de publicar
un lifecycle `running` con autorización exacta.

## Riesgo y regresión

`SstButton` y `SstSignalTag` son compartidos. Una landing sin fallos de
contraste no demuestra que Home, Auth, Articles o Learning Workspace estén
correctos. El gate owner debe revisar estados default, hover, focus y active;
el browser gate debe separar landing pública y superficies autenticadas.

La evidencia de 2026-08-27 —13 nodos reproducidos, cero después de la
corrección, accessibility 100 y 33 suites/212 tests en PASS— es histórica. No
se adopta como readback actual.

## Gates futuros

1. Publicar y releer este plan.
2. Publicar `running` con los doce paths exactos.
3. Autorizar separadamente la creación del worktree owner limpio y el port.
4. Ejecutar `npm run check` y `git diff --check` en el owner.
5. Validar primero `localhost:4090` en desktop/mobile.
6. Publicar el cambio owner con PR y readback.
7. Autorizar separadamente build, image load o pod recycle si son necesarios.
8. Validar el artefacto nuevo en `localhost:8088` sin sustituir la evidencia
   local.
9. Publicar evidencia terminal y decidir si corresponde crear un mirror Jira.

## Boundaries

- No se tocó el checkout dirty ni sus refs.
- No se creó branch o worktree en `sst-fend`.
- No se construyó ni cargó una imagen.
- No se reinició container, pod, Docker, Kubernetes ni host.
- No se escribió en Jira.
- No se accedió a secretos, cookies, tokens, backups o datos privados.
