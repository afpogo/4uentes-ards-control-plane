# Readback canónico de adopción — CR-SST-0186

## Resultado

`4uentes-auth` adoptó `visual-documentation-as-code-policy` mediante un
`policy_adoption_manifest` owner y documentación local descubrible.

- PR de adopción: <https://github.com/afpogo/4uentes-auth/pull/7>.
- Commit de adopción: `7c45605d903d6fd92eace8f6c5d6dac9cc2f5f47`.
- Merge commit del PR #7: `9746e3138290e7d73b579e3cdcd55796e9c52169`.
- PR de remediación documental: <https://github.com/afpogo/4uentes-auth/pull/8>.
- Commit de remediación: `60dcc61bd48646422e4df6c77d8f3610e949c1ac`.
- Merge commit vigente en `develop`: `4249ba3bd949c902e943c2b826df10bae6809c1b`.

## Artefactos owner

- `specs/integration/policies.yaml`.
- `specs/policies/00-index.yaml`.
- `specs/policies/adoptions/visual-documentation-as-code-policy.yaml`.
- `docs/policies/README.md`.
- `AGENTS.md`.

El manifest declara `adoption_status: adopted`, conserva a
`4uentes-ards-core` como owner canónico y limita la adopción a mapas normativos
propiedad de `4uentes-auth`.

## Remediación observada

El readback inicial detectó seis caracteres de control `0x07` en lugar de la
letra inicial de los identificadores `agent-*` del índice humano. El PR #8
corrigió únicamente esas seis entradas antes del cierre del request.

## Validación

- `4uentes-auth npm.cmd run check`: PASS.
- GitHub `build-publish-update` del PR #7: PASS.
- GitHub `build-publish-update` del PR #8: PASS.
- Escaneo de caracteres de control luego de la remediación: PASS.
- `git diff --check`: PASS.
- Revisión secret-safe focalizada: PASS.
- `4uentes-orchestor npm.cmd run check`: PASS.

## Límites

- No se modificó runtime, autenticación, sesiones, contraseñas ni contratos
  HTTP.
- No se utilizaron base de datos, seeders, Kubernetes ni secretos.
- No hubo escrituras Jira.
- La adopción es prospectiva y no migra diagramas existentes en masa.
