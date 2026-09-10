# CR-CP-0024: playbook de prerrequisitos AIStor/KMS

Fecha: 2026-09-10. Owner: `sst-4uentes-infra`. Request: `CR-HPT-0024`.

## Resultado

Infra PR #33 publica un playbook decisional y un runbook asociado para ejecutar
Gate C en tres unidades verificables:

1. aceptar y archivar la licencia AIStor Free;
2. generar el soft-HSM fijado, conservar dos copias cifradas independientes y
   comprobar lectura/igualdad sin publicar valores;
3. preparar los contratos de Secrets según su momento real de creación.

Merge owner: `226443397d07ac8e59f83b408dbcf34b25364d79`.
Head validado: `ea58fcefda199a0d7f495df177cab2d7c29468f4`.

## Aplicación de políticas

La unidad completa se clasificó como sensible por tratar custodia criptográfica
y contratos de Secrets. El agente principal conservó las decisiones, edición,
integración y validación. La política de delegación se aplicó a una única
revisión documental acotada, sin mutaciones, runtime, valores ni autoridad de
arquitectura. Su salida fue verificada antes de incorporarse.

La atomización publicada declara objetivo, inputs, salida, riesgo y criterio de
salida para licencia, HSM y contratos. Playbook y runbook preservan la relación
`recommends -> external authorization -> operationalizes`; ningún documento
autoriza por sí mismo el bootstrap.

## Correcciones y límites

- `sst-receipt-object-store` no se exige antes del bootstrap: sólo puede
  materializarse después de crear bucket e identidad mínima.
- El soft-HSM inicial y el futuro snapshot `minkms backup` son artefactos
  distintos y ambos son necesarios para una recuperación total.
- Los checks de Secrets enumeran nombres de claves, no valores.
- La licencia se adquiere/custodia antes del bootstrap y se registra/verifica
  cuando AIStor existe.
- `S3_CA_BUNDLE` carece aún de representación publicada por SST. CR-HPT-0025
  debe fijar contenido PEM o referencia de ruta antes de crear ese Secret.

## Validación

- `npm run check` Infra: PASS.
- CI `validate-repository` de Infra PR #33: SUCCESS.
- Seis bloques PowerShell: sintaxis PASS en PowerShell 5.1.
- RNG criptográfico de credenciales sintéticas: PASS.
- Imagen KMS fijada generó un soft-HSM efímero con formato esperado: PASS. La
  clave no se guardó ni se imprimió; el contenedor fue `--rm`.
- `git diff --check`: PASS.
- No hubo mutación del cluster, creación de Secrets, aceptación de licencia ni
  escritura Jira.

## Siguiente unidad

Gate C / Unidad A: el operador accede a SUBNET, acepta el acuerdo vigente y
guarda `minio.license` en custodia cifrada fuera de Git. Sólo después se ejecuta
la preparación local guiada del HSM. HPT-16 permanece En curso.
