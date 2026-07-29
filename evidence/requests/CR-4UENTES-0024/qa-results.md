# CR-4UENTES-0024 - QA Results

Fecha: 2026-07-05

## Objetivo

Validar la experiencia bilingue ES/EN despues de las migraciones I18N de
`CR-4UENTES-0022` y `CR-4UENTES-0023`.

## Politicas Aplicadas

- Request-driven child repo mutation.
- Owner documentation authority/enforcement.
- Human-facing documentation policy: evidencia operativa en espanol.
- Jira como espejo; control-plane y owner docs son fuente de verdad.
- Fixes atomizados: solo corregir bloqueantes de QA bilingue.

## Hallazgos Iniciales

- BLOCKER: el boton de idioma del layout mostraba el idioma activo, pero no
  ejecutaba `handleTranslateClick`; por lo tanto no permitia alternar ES/EN
  desde la UI.

## Resultado

- FIXED: el boton de idioma del layout interior ahora ejecuta
  `handleTranslateClick` y alterna el estado ES/EN.
- La clase `btn--disabled` fue removida del control de idioma porque era una
  accion real requerida para QA bilingue.
- PASS: revision estatica confirma que el boton usa `onClick` y que no queda
  `btn--disabled` en `PortFolioLayout`.
- PASS: los strings detectados por grep en experiencia quedan en recursos I18N
  o como fallbacks legacy de datos; no quedan labels activos hardcodeados en
  los componentes migrados.

## Superficies En Alcance

- Home hero: namespace `home`.
- Experience company cards: namespace `experience`.
- Experience company detail header: namespace `experience`.
- Experience initiative/detail cards: namespace `experience`.

## Pendiente De QA Visual Manual

- Verificar en navegador que el cambio ES/EN no rompe layout en desktop/mobile.
- Verificar que no haya mojibake ni textos sin traducir en las superficies
  migradas.
