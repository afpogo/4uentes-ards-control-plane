# CR-SST-0174 - Policy Adoption Summary

## Resultado

`sst-fend` queda reconciliado contra
`4uentes-ards-core@162c482` mediante manifests request-driven:

- 9 `policy_adoption_manifest` activos.
- 1 `policy_exception_manifest` abierto para
  `http-qa-harness-policy`.

La excepcion HTTP es intencional: el frontend consume contratos HTTP, pero no
tiene hoy un harness `.http` versionado. Por eso no se declara una adopcion
que el repo todavia no cumple.

## Enforcement

Se agrego `npm run check:policies` y se integro al inicio de
`npm run check`. El gate falla ante:

- manifest faltante;
- kind o policy id incorrecto;
- ausencia de `CR-SST-0174`;
- placeholder `TODO`;
- path local inexistente;
- excepcion sin razon, vencimiento o plan de cierre;
- registry o indice sin el manifest correspondiente.

## Boundary

- El canon permanece en `4uentes-ards-core`.
- `orchestrator_link` queda documentado como alias local de
  `control_plane_link`.
- La allowlist del request solo habilita `sst-fend`.
- No se modifico runtime React, contratos API ni Jira.
