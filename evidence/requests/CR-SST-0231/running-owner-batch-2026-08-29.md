# CR-SST-0231: gate running del lote owner

Fecha observada: 2026-08-29.

## Resultado del gate

`CR-SST-0231` avanza a `running` únicamente como autorización publicada del
alcance futuro. Este gate no modifica `sst-fend`, no crea un worktree owner y
no ejecuta runtime, infraestructura ni escrituras Jira.

La planificación quedó publicada en el PR `#189`, con commit de head
`12c7fde7d5a272791b9a34b49c9760e91b3165fb` y merge
`2e1049fd88c43686a1d052915eecb2606c0b4c24`. El lifecycle `running` parte del
`origin/main@4e66a69522ca60d6867b1ccabd0d37b68b0268e6`, que incluye ese merge.

## Allowlist exacta

El lote owner futuro queda limitado a doce paths.

Estilos runtime:

- `src/assets/styles/sass/base/_colors.scss`
- `src/assets/styles/sass/lib/_settings.scss`
- `src/components/Clock/styles.module.scss`
- `src/components/Header/Header.module.scss`
- `src/components/SstButton/styles.module.scss`
- `src/components/SstSignalTag/styles.module.scss`
- `src/pages/Landing/styles.module.scss`

Documentación owner:

- `specs/21-design-tokens.yml`
- `specs/36-public-landing-frontend.yml`
- `specs/37-branding-frontend.yml`
- `docs/36-public-landing-frontend.md`
- `docs/37-branding-frontend.md`

Todo path dirty o no trackeado fuera de esta lista queda excluido. También se
excluyen `robots.txt`, `llms.txt`, contratos de auth, routing, API, Redux,
sesiones, extensión e infraestructura.

## Preservación y port

El checkout histórico de `sst-fend` permanece dirty, en
`fix/SST-26/CR-SST-0086/dictionary-secrets-panel@9148580`. No se ejecutó
commit, clean, stash, reset, rebase, switch ni retiro sobre ese checkout.

La siguiente ejecución deberá releer `develop` y crear un worktree owner
limpio. Cada hunk será reaplicado semánticamente; queda prohibido copiar los
archivos completos, integrar el branch histórico o hacer cherry-pick del
checkout mezclado.

## Controles contra falsos positivos

- La evidencia histórica de Lighthouse, consola y tests no es readback actual.
- `localhost:4090` valida primero el source owner local.
- Un build exitoso no prueba contraste ni regresión visual.
- `localhost:8088` se valida después del merge owner y de una autorización
  runtime separada para construir y desplegar el artefacto nuevo.
- `SstButton` y `SstSignalTag` obligan a revisar Home, Auth, Articles y Learning
  Workspace además de la landing pública.

## Jira read-only

El readback directo confirmó `SST-101` y `SST-102` en `En curso`, y `SST-119`
en `Finalizada`. La consulta JQL exacta devolvió los tres issues, por lo que la
degradación de indexación anterior no se reprodujo en este gate. No apareció
un issue con summary o label `CR-SST-0231`, resultado esperado porque no existe
mirror primario para este request. No se realizó ninguna escritura Jira.

## Próxima autorización

Después del merge y readback de este gate, se requiere autorización nueva y
exacta para:

1. releer el `develop` owner remoto;
2. crear un único branch/worktree limpio de `sst-fend`;
3. portar únicamente hunks semánticos dentro de los doce paths;
4. ejecutar checks owner y revisar el diff exacto.

La validación en `localhost:4090`, la publicación owner, cualquier operación
de build/deploy sobre `localhost:8088` y cualquier escritura Jira permanecen
como gates separados.

## Validación del control plane

- `git diff --check`: PASS.
- `npm.cmd run check`: PASS.
- Identidades/lifecycle: 758 archivos, una advertencia histórica congelada de
  `CR-SST-0016` y cero fallos.
- Regla de publicación: 30 lifecycles opt-in válidos.
- Owner documentation: 144 gates válidos.
- Documentación visual: 28 documentos y 35 mapas válidos.
