# Validación local de la regla experimental

Fecha: 2026-08-23. Request: `CR-CP-0022`.

## Superficies implementadas

- contrato machine-readable en
  `specs/requests/execution-publication-rule.yaml`;
- documentación humana y enlace desde el modelo de ejecución;
- validator enfocado integrado al gate completo `npm run check`;
- adopción prospectiva del propio lifecycle `CR-CP-0022`;
- gate explícito de promoción futura mediante `CR-CP-0023`.

## Hallazgo durante el trial

La primera versión del validator delimitaba bloques YAML con una expresión
regular que terminaba ante una línea vacía. El self-test detectó que esa
estrategia podía truncar el bloque de adopción y producir resultados
incorrectos.

Se reemplazó por lectura lineal basada en indentación para bloques raíz y
anidados. También se agregaron controles para provider de tracker, motivo de
no-aplicabilidad y unicidad del estado de ejecución.

## Resultados finales

- `node scripts/verify-execution-publication-rule.js --self-test`: PASS, seis
  casos positivos/negativos;
- `node scripts/verify-execution-publication-rule.js`: PASS, dos lifecycles
  opt-in validados;
- `npm run check`: PASS, 706 lifecycles, 141 controles de documentación owner,
  21 controles de iniciativas y 18 mapas visuales, sin FAIL;
- `git diff --check`: PASS;
- revisión de secretos: sin material sensible nuevo.

Los warnings observados corresponden a la excepción congelada de
`CR-SST-0016` y a la ausencia permitida del binding local opcional.

## Estado del gate de promoción

El contrato y el validator local pasan. Todavía faltan, en este orden:

1. merge y readback de esta implementación;
2. reconciliación exacta y autorizada de Jira;
3. merge y readback del lifecycle terminal;
4. cleanup posterior al readback.

Sólo después de esos pasos el trial puede considerarse exitoso y habilitar
la apertura separada de `CR-CP-0023`; este request no modifica
`4uentes-ards-core`.
