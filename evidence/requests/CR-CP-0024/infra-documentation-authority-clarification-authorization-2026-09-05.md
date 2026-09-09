# Autorización para aclarar la autoridad documental en Infra

Fecha: 2026-09-05

Request gobernante: `CR-CP-0024`

Owner slice: `CR-HPT-0024` / `HPT-16`

## Decisión

El usuario autorizó continuar únicamente con la recuperación local de Docker
Desktop y con la adopción documental de Infra. La recuperación concluyó sin
recrear el clúster ni eliminar imágenes, volúmenes o datos, y el check owner
completo volvió a pasar.

La adopción autorizada para el PR de Infra se interpreta de forma acotada:

- mantener Learning, playbooks, runbooks y el verificador en el repo owner;
- declarar que su arquitectura de información es una convención local;
- enlazar la gobernanza de rollout del control plane;
- evitar presentar una policy no publicada como canon compartido;
- dejar la adopción formal de `knowledge-to-execution-documentation-policy`
  pendiente de una fuente versionada y de su manifest correspondiente.

## Mutación autorizada

Se autoriza exclusivamente:

1. modificar la rama existente
   `docs/CR-HPT-0024/human-receipt-custody-guides`;
2. actualizar documentos y el verificador de documentación humana dentro del
   alcance ya abierto por `CR-HPT-0024`;
3. agregar un commit owner auditable;
4. publicar ese commit en la misma rama para actualizar el PR #26;
5. releer checks, head, base y mergeability del PR.

## Límites

No se autoriza:

- fusionar el PR #26;
- modificar `develop` o `main`;
- adoptar como canónica una policy sin commit fuente publicado;
- cambiar manifests de runtime, Secrets, recursos de ClamAV o datos;
- ejecutar una transición terminal en Jira.

## Preflight

- El worktree owner está limpio y conserva la rama del PR #26.
- Docker Desktop y los dos nodos existentes de Kind fueron recuperados sin
  recreación.
- `kubectl get --raw=/readyz` respondió `ok`.
- `npm run check` de Infra concluyó correctamente antes de la mutación.
- `npm run check` del control plane concluyó correctamente antes de registrar
  esta autorización.
