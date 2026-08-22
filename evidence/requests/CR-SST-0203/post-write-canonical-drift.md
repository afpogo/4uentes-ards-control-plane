# Deriva canónica detectada después del write Jira

## Hallazgo

Después de ejecutar y verificar `JIRA-SEC-PREPROD-01`, el fetch de `origin/main` incorporó PR #35 con evidencia canónica posterior a la base usada por `CR-SST-0203`:

- `CR-SST-0199` está `done`;
- `CR-SST-0201` está `done/validated-live` y el login/refresh público por ngrok pasó;
- `CR-SST-0200` continúa `running` por copy de signup, continuidad register → refresh y teardown/logout;
- `CR-SST-0178` continúa `running` coordinando esas correcciones.

## Impacto

Los payloads y el readback de `CR-SST-0203` siguen siendo evidencia histórica exacta de lo escrito. Sin embargo, las descripciones publicadas en `SST-86`, `SST-89` y `SST-92` conservan frases que tratan el QA ngrok como pendiente y a `CR-SST-0201` como `running`.

## Decisión de policy

La autorización de `JIRA-SEC-PREPROD-01` quedó consumida. No se ejecuta una segunda escritura Jira por inferencia. La corrección requiere un lote nuevo, mínimo, enumerado y aprobado; no necesita cambiar prioridad, estado, parent, labels ni summaries.

No se conservaron secretos, datos de sesión ni identificadores privados de conexión.

## Reconciliación posterior

La deriva quedó corregida mediante el lote autorizado `JIRA-SEC-PREPROD-02`
del request `CR-SST-0204`. El readback confirmó las narrativas nuevas y que
estado, prioridad, labels, parent y summary permanecieron sin cambios.
