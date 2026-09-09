# Autorización de publicación de la fundación documental de Infra

Fecha: 2026-09-05

Request gobernante: `CR-CP-0024`

Owner slice: `CR-HPT-0024` / `HPT-16`

## Gate autorizado

El usuario indicó `ok avancemos con el siguiente gate`. El siguiente gate
enumerado en el lifecycle vigente es publicar el commit owner exacto
`67c4874b2404235d70dc56ce143343954f5c707e` y abrir un PR de Infra sin
fusionarlo.

La autorización permite exclusivamente:

1. publicar la branch `docs/CR-HPT-0024/human-receipt-custody-guides` en
   `afpogo/sst-4uentes-infra`;
2. comprobar que el head remoto coincide exactamente con `67c4874`;
3. abrir un PR contra `develop@a4d1200`;
4. leer estado, archivos, checks y mergeability del PR;
5. registrar el readback en el control plane.

## Límites

Este gate no autoriza:

- fusionar el PR owner;
- modificar el commit o ampliar sus doce paths;
- cambiar memoria o recursos de ClamAV;
- ejecutar, reiniciar o alterar Kubernetes/Argo CD;
- modificar Secrets, datos persistentes o runtime;
- escribir o cerrar Jira.

El gate de remediación de memoria ClamAV continúa separado. Sólo se retomará
después de publicar y releer este PR documental.

## Precondiciones

- el worktree owner existente debe continuar limpio;
- `HEAD` debe ser exactamente `67c4874`;
- el commit debe descender de `origin/develop@a4d1200`;
- `npm run check`, `npm run check:human-docs`, enlaces, Mermaid,
  `git diff --check` y el scan sensible deben conservar `PASS`;
- cualquier drift de base, head o paths detiene la publicación.

## Resultado de publicación

La rama fue publicada exactamente en
`67c4874b2404235d70dc56ce143343954f5c707e` y se abrió
[Infra PR #26](https://github.com/afpogo/sst-4uentes-infra/pull/26) hacia
`develop@a4d120061d0d4d53352b1de766858602ff759750`.

El readback confirmó `OPEN`, `MERGEABLE`, `CLEAN`, sin auto-merge, un commit y
doce archivos. El check `validate-repository` concluyó `SUCCESS`; los workflows
de manifests no aplicaron porque el cambio es exclusivamente documental y del
validador docs-as-code.

`develop` permaneció sin cambios. Una lectura adicional del cluster no estuvo
disponible porque el API local agotó el TLS handshake. No se intentó reparar o
reiniciar Kubernetes: la inmutabilidad de `develop` demuestra que esta
publicación no produjo una nueva revisión GitOps.

La autorización quedó consumida. El PR no fue fusionado y requiere un gate
separado para merge.
