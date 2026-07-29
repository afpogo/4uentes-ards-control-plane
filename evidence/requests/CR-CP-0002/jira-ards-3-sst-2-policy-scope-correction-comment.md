# ARDS-3 correccion de alcance SST-2

Se corrigio una omision en la evidencia de policies vivas: el cierre anterior
reflejaba claramente `INIT-SST-0003 / SST-29`, pero no dejaba explicita la
aplicacion equivalente para `INIT-SST-0002 / SST-25-SST-26`.

Correccion aplicada:

- Se agrego `evidence/initiatives/INIT-SST-0002/policy-application.md`.
- Se referencio desde `initiatives/INIT-SST-0002-dictionary-management.yaml`.
- Se registro evidencia de correccion en
  `evidence/requests/CR-CP-0002/sst-2-policy-scope-correction.md`.

SST-2 queda incluido con:

- policies agenticas comunes;
- `owner-documentation-authority-policy`;
- `http-qa-harness-policy` cuando aplica por superficies HTTP;
- reglas Dictionary de secret-safe, evidencia redactada, exclusion de material
  de custodia extrema, compatibilidad de tags y owner documentation.

No se mutaron repos hijos. `npm.cmd run check` del control-plane paso con
`0 WARN / 0 FAIL`.
