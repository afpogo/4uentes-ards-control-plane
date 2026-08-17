# Resultados De Validación De CR-CP-0019

## Resultado

`CR-CP-0019` pasa el gate local. El quality gate queda incorporado a
`npm.cmd run check` y la adopción local cambia a `validated-local`.

## Validator

- `node --check scripts/verify-visual-documentation.js`: PASS.
- `npm.cmd run check:visual-docs`: PASS, cinco documentos y cinco mapas.
- `npm.cmd run check:visual-docs:self-test`: PASS, nueve fixtures.

Los fixtures cubren:

- caso de dependencia válido;
- metadata requerida ausente;
- `source_ref` inexistente;
- request ID desconocido;
- arista de gobierno sin label;
- dependencia que contradice predecessors;
- estado expresado sólo mediante color;
- fallback textual ausente;
- markers desbalanceados.

## Render Pinneado

El modo focalizado recibió un module root temporal con:

- `mermaid@11.12.0`;
- `jsdom@26.1.0`.

Los cinco mapas produjeron SVG. Un module root inexistente y la ausencia del
argumento requerido fallaron de forma determinista. El entorno temporal se
eliminó después del check.

## Check Canónico

`npm.cmd run check`: PASS, incluido el nuevo validator.

- catálogo: 5 OK, 0 WARN, 0 FAIL;
- bindings locales: 42 OK, 9 WARN, 0 FAIL;
- state: 56 OK, 0 WARN, 0 FAIL;
- initiatives: 19 OK, 0 WARN, 0 FAIL;
- owner documentation: 101 OK, 0 WARN, 0 FAIL;
- visual documentation: 5 documentos, 5 mapas, 0 FAIL.

Los nueve warnings corresponden únicamente a remotos de repos hijos no
observables.

## Higiene Y Boundaries

- `git diff --check`: PASS.
- escaneo de valores secretos: PASS.
- cleanup temporal: PASS.
- no se modificaron repos hijos, Core ni Jira.
