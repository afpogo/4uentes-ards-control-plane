# Autorización de publicación — CR-SST-0232

## Gate propuesto

El 2026-08-29 se presentó el batch de contrato running validado y se solicitó autorización explícita para estas cinco operaciones:

1. crear el commit de control plane;
2. publicar la rama remota;
3. abrir el pull request;
4. fusionarlo a `main`;
5. comprobar el contenido desde la referencia canónica remota.

El alcance excluye repos hijos, Jira, runtime, despliegues, migraciones, secretos y datos de producto.

## Decisión

El 2026-09-05 el operador respondió: `ok avancemos con el proximo gate`.

La autorización se interpreta exclusivamente para el gate exacto anterior. No autoriza implementar los futuros slices de Bend, BFF, Fend o E2E.

## Condiciones de ejecución

- Releer y aplicar las políticas vigentes antes de publicar.
- Integrar el batch sobre el `origin/main` actual y no sobre la base histórica.
- Repetir `npm run check` y `git diff --check` después de integrar.
- Detener la publicación ante conflictos semánticos o fallas de validación.
- Registrar PR, merge commit y readback en el reporte al operador.
