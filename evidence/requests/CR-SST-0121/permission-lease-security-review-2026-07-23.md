# CR-SST-0121 - revisión independiente del lease de permiso

Fecha: 2026-07-23  
Disposición: hallazgos corregidos y revalidados; habilitado para QA manual

La primera implementación pasó tests y build, pero la revisión independiente
detectó riesgos de lifecycle que requieren corrección antes de usar Chrome:

- la solicitud visual esperaba primero `permissions.contains`, lo que puede
  perder la asociación estricta con el gesto del usuario que Chrome exige;
- la limpieza inicial del background no estaba serializada con el primer
  mensaje de captura y podía competir con un permiso recién concedido;
- la limpieza retiraba `<all_urls>` incluso sin un lease propio válido y el
  `finally` también se ejecutaba para modos textuales;
- el background confiaba en el dato enviado por UI sin usar como autoridad el
  estado real observado al reclamar el permiso.

La corrección exigida es:

- `permissions.request` visual directo desde el click;
- cleanup sólo sobre leases propios y serializado antes del claim;
- claim booleano basado en el permiso real;
- release sólo por la captura visual que posee el lease;
- cobertura para modo `prefer-text`, offered reciente, grant manual sin lease,
  éxito/error y captura concurrente.

El rechazo seguro, la sesión basada sólo en metadata y la separación del
consentimiento de preview fueron verificados correctamente y deben preservarse.

## Revalidación

La segunda implementación:

- solicita el permiso visual directamente desde el click;
- identifica cada lease y espera el cleanup inicial antes de reclamarlo;
- usa el resultado real del claim como autoridad;
- no elimina un grant sin marker owner ni libera desde modos textuales;
- libera también cuando falla el guardado inicial posterior al claim;
- controla capturas concurrentes sin duplicar ownership.

Resultado independiente focalizado: 3 suites, 32/32 tests PASS.
