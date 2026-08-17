# Resultados De Validación De CR-CP-0018

## Resultado

`CR-CP-0018` pasa el gate local. El perfil queda `active-local` y el siguiente
gate es `CR-CP-0019`.

## Perfil Y Fuentes

- El YAML del perfil y el lifecycle `running` fueron parseados correctamente.
- Las siete rutas `source_refs` del piloto existen.
- Las cinco superficies visuales contienen markers balanceados, metadata,
  Mermaid y fallback obligatorio.

## Mermaid

Se instaló temporalmente `mermaid@11.12.0` con `jsdom@26.1.0` fuera de las
dependencias del proyecto. `mermaid.parse` aceptó:

- dependency map template;
- lifecycle map template;
- sequence map template;
- data map template;
- mapa de rollout `CR-CP-0006`.

El entorno temporal fue eliminado después de la validación. El pin y el runner
permanente pertenecen a `CR-CP-0019`.

## Check Canónico

Comando: `npm.cmd run check`.

Resultado: PASS.

- catálogo: 5 OK, 0 WARN, 0 FAIL;
- bindings locales: 42 OK, 9 WARN, 0 FAIL;
- state: 56 OK, 0 WARN, 0 FAIL;
- initiatives: 19 OK, 0 WARN, 0 FAIL;
- owner documentation: 101 OK, 0 WARN, 0 FAIL.

Los nueve warnings corresponden a remotos de repos hijos que no pudieron ser
observados; no afectan este cambio control-plane-only.

## Higiene

- `git diff --check`: PASS.
- escaneo de valores secretos: PASS.
- cleanup del entorno Mermaid temporal: PASS.
- no hubo mutación de repos hijos, Core ni Jira.
