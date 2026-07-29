# Runbook: token de escritura infra para imagenes de desarrollo SST

## Proposito

Este runbook documenta como crear y mantener el token usado por workflows de
repos hijos SST para actualizar tags de imagen en `afpogo/sst-4uentes-infra`.

El caso observado fue `sst-bend`: al mergear a `develop`, el workflow publico
la imagen de desarrollo y luego intento actualizar
`k8s-manifests/overlays/development/kustomization.yml` en el repo infra. Esa
segunda parte requiere un secret llamado `SST_INFRA_WRITE_TOKEN`.

## Boundary ARDS/SDD

- El token no se guarda en este repo.
- El valor del token no se documenta en Markdown, Jira, evidencia, logs ni
  secretos del Diccionario.
- Este documento solo registra procedimiento, permisos, ubicacion logica,
  vencimiento y rotacion.
- El repo infra observado por Argo CD para el cluster dev es
  `afpogo/sst-4uentes-infra`, branch `develop`.
- El endpoint local `http://localhost:8088` toma cambios cuando Argo CD
  reconcilia el desired state de infra y las imagenes publicadas por los repos
  hijos.

## Cuando usarlo

Usar este runbook cuando un workflow de un repo hijo falla con un error similar:

```text
SST_INFRA_WRITE_TOKEN is required to update afpogo/sst-4uentes-infra:develop.
```

Tambien aplica cuando se agrega un nuevo repo hijo cuyo workflow debe publicar
imagen de desarrollo y actualizar el tag correspondiente en infra.

## Crear el token

El token se crea desde la cuenta de GitHub, no desde un repo.

1. Abrir GitHub.
2. Ir al avatar de usuario.
3. Entrar en `Settings`.
4. Entrar en `Developer settings`.
5. Entrar en `Personal access tokens`.
6. Entrar en `Fine-grained tokens`.
7. Elegir `Generate new token`.

Valores recomendados:

- Token name: `sst-bend-dev-infra-writer`
- Description:
  `Allows sst-bend GitHub Actions to update development image tags in afpogo/sst-4uentes-infra.`
- Expiration: `90 days` o `180 days`, segun tolerancia operativa.

Permisos minimos:

- Repository access: `Only select repositories`.
- Selected repository: `afpogo/sst-4uentes-infra`.
- Repository permissions:
  - `Contents`: `Read and write`.
  - `Metadata`: `Read-only` automatico.
- El resto de permisos debe quedar en `No access` o default.

No hace falta darle acceso al repo que ejecuta el workflow. El token se guarda
en ese repo como secret, pero el permiso que necesita es escribir en
`sst-4uentes-infra`.

## Guardar el token como secret

Ejemplo para `sst-bend`:

1. Ir al repo `afpogo/sst-bend`.
2. Entrar en `Settings`.
3. Entrar en `Secrets and variables`.
4. Entrar en `Actions`.
5. Elegir `New repository secret`.
6. Name: `SST_INFRA_WRITE_TOKEN`.
7. Value: pegar el token generado.
8. Guardar.

Si otro repo hijo necesita actualizar infra, repetir el guardado del secret en
ese repo hijo. El token puede ser especifico por repo hijo o compartido por
varios workflows de desarrollo, pero la opcion mas auditable es un token por
repo hijo.

## Validar

Despues de guardar el secret:

1. Volver a la corrida fallida de GitHub Actions.
2. Usar `Re-run failed jobs`.
3. Confirmar que el workflow:
   - construye la imagen;
   - publica el tag `develop-<sha>`;
   - actualiza `afpogo/sst-4uentes-infra:develop`;
   - deja Argo CD con desired state nuevo para el cluster dev.

Validacion esperada en `sst-bend`:

```text
Build and Publish Development Image: success
```

Validacion esperada en infra:

```text
k8s-manifests/overlays/development/kustomization.yml
```

debe quedar apuntando al tag nuevo de la imagen correspondiente.

## Mantenimiento por vencimiento

Registrar el vencimiento al crear el token. Antes de que expire:

1. Crear un token nuevo con los mismos permisos minimos.
2. Reemplazar el valor del repository secret `SST_INFRA_WRITE_TOKEN` en el repo
   hijo correspondiente.
3. Ejecutar o reintentar un workflow de desarrollo para confirmar que puede
   escribir en `sst-4uentes-infra:develop`.
4. Revocar el token anterior desde GitHub cuando el nuevo este validado.
5. Actualizar la tabla de tracking de este documento.

Ventana recomendada:

- Revisar 14 dias antes del vencimiento.
- Rotar al menos 7 dias antes del vencimiento.
- No esperar a que falle el workflow de merge a `develop`.

## Registro de secrets operativos

No completar valores secretos. Usar esta tabla para trackear existencia,
ubicacion y vencimiento.

| Secret name | Valor almacenado en | Token name | Acceso concedido | Creado | Vence | Ultima validacion | Rotacion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SST_INFRA_WRITE_TOKEN` | `afpogo/sst-bend` Actions secrets | `sst-bend-dev-infra-writer` | `afpogo/sst-4uentes-infra` contents read/write | TODO | TODO | TODO | TODO |
| `SST_INFRA_WRITE_TOKEN` | `afpogo/sst-fend` Actions secrets | TODO | `afpogo/sst-4uentes-infra` contents read/write | TODO | TODO | TODO | TODO |
| `SST_INFRA_WRITE_TOKEN` | `afpogo/4uentes-auth` Actions secrets | TODO | `afpogo/sst-4uentes-infra` contents read/write | TODO | TODO | TODO | TODO |

## Registro en SST Dictionary Secrets

Si se crea una entrada en SST para documentar este secret, no guardar el token
real como valor salvo que el uso operacional requiera custodiarlo ahi y el
owner lo apruebe explicitamente.

Entrada documental recomendada:

- Nombre: `SST_INFRA_WRITE_TOKEN - sst-bend development infra writer`.
- Categoria: `ci-cd`.
- Plataforma: `GitHub Actions`.
- Proposito: permitir que `sst-bend` actualice tags de imagen en
  `sst-4uentes-infra:develop`.
- Valor protegido: usar un placeholder no sensible o dejar el valor real fuera
  de SST si el token ya vive como GitHub Actions secret.
- Instrucciones de rotacion: seguir la seccion `Mantenimiento por vencimiento`.
- Dependencias:
  - `afpogo/sst-bend`
  - `afpogo/sst-4uentes-infra`
  - Argo CD development app
- Metadata sugerida:
  - `secret_name`: `SST_INFRA_WRITE_TOKEN`
  - `token_name`: `sst-bend-dev-infra-writer`
  - `permission_scope`: `sst-4uentes-infra contents read/write`
  - `environment`: `development`
  - `expires_at`: `TODO`
  - `rotation_owner`: `TODO`

## Checklist rapido

- [ ] Token fine-grained creado desde cuenta GitHub.
- [ ] Acceso limitado a `afpogo/sst-4uentes-infra`.
- [ ] `Contents: Read and write`.
- [ ] Secret `SST_INFRA_WRITE_TOKEN` guardado en el repo hijo que ejecuta el
      workflow.
- [ ] Workflow reintentado y exitoso.
- [ ] Vencimiento registrado.
- [ ] Entrada documental en SST creada o excepcion registrada.
