# Allowlists De Recomposicion Y Release

## Proposito

Un `allowlist` es una lista explicita de cambios permitidos. En un release
cross-repo se usa cuando una rama fuente contiene trabajo mezclado y no debe
promoverse completa a `develop`.

La traduccion conceptual es "lista permitida", pero se conserva `allowlist`
porque las claves estables del manifest son `path_allowlist`, `hunk_rules` y
`explicit_exclusions`.

El allowlist responde una pregunta concreta:

> De todo lo que existe en la fuente, ¿que archivos y que partes de esos
> archivos estan autorizados por este request?

No es una lista de servidores, usuarios, IPs ni permisos de red. Tampoco es un
reemplazo de tests, revision de codigo o aprobacion de merge.

## Cuando Se Necesita

Usar un allowlist de recomposicion cuando:

- una rama historica mezcla varios CRs;
- parte del trabajo esta aprobado y parte sigue diferida;
- hay archivos con cambios de mas de una feature;
- deben excluirse workflows viejos, logs, `.env`, secretos o evidencia local;
- el candidato debe reconstruirse sobre el `origin/develop` actual.

Si una rama contiene un unico cambio pequeno, limpio y aprobado, normalmente
no hace falta recomponerla por allowlist: puede revisarse como un PR convencional.

## Estructura Del Manifest

Ejemplo reducido:

```yaml
repository: "sst-bend"
base:
  ref: "origin/develop"
  observed_sha: "8d36a918..."
source:
  ref: "feat/SST-26/CR-SST-0086/dictionary-secrets-release-readiness"
  sha: "b47ca013..."

path_allowlist:
  - "specs/api/learning-workspaces.yaml"
  - "docs/api/26-learning-workspaces.md"
  - "src/apps/sst/application/learning-workspaces/{accept-learning-source,preview-learning-source,reject-learning-source}.usecase.js"

hunk_rules:
  - path: "db/models/index.js"
    rule: "incluir LearningAnnotationRef y excluir ArticlePreviewResolution"

explicit_exclusions:
  - path: ".env"
    reason: "configuracion local y secretos"
  - path: "src/apps/sst/application/articulos/preview-*"
    reason: "article preview permanece diferido"
```

### `base`

Es el punto de partida del candidato, normalmente un SHA observado de
`origin/develop`. Debe revalidarse antes de crear o continuar el worktree.

Si el SHA remoto cambio, no se asume compatibilidad: se crea un candidato nuevo
o se recompone de nuevo contra la base actual.

### `source`

Es el commit inmutable desde el que se extraen los cambios autorizados. El SHA
manda sobre el nombre de la rama, porque una rama puede moverse.

### `path_allowlist`

Enumera archivos o patrones que pueden participar del candidato. Estar en esta
lista significa "puede revisarse e incluirse", no "copiarlo automaticamente".

Reglas:

- cada patron se expande contra el diff entre `base` y `source`;
- un patron que produce cero archivos es un fallo de planificacion;
- un archivo no listado no entra por proximidad o dependencia implicita;
- si falta una dependencia necesaria, se enmienda el manifest antes de sumarla;
- los owner docs y sus indices deben quedar incluidos cuando corresponda.

### `hunk_rules`

Un `hunk` es un bloque de lineas dentro de un diff. Se usa cuando un mismo
archivo mezcla alcance permitido y alcance diferido.

Ejemplo: `db/models/index.js` podia registrar tanto
`LearningAnnotationRef` como `ArticlePreviewResolution`. El primer cambio
pertenecia al tren estable; el segundo quedaba diferido. Copiar el archivo
completo hubiera violado el scope aun cuando el path estuviera allowlisted.

### `explicit_exclusions`

Declara cambios que no deben entrar y explica por que. Las exclusiones hacen el
review auditable y evitan depender de memoria o de convenciones informales.

Exclusiones frecuentes:

- `.env`, keys, tokens y logs;
- workflows historicos sin lifecycle vigente;
- migraciones o endpoints de una feature diferida;
- archivos generados o binarios sin referencia;
- cambios solo de formato mezclados con cambios funcionales;
- artefactos con `request_id: TODO` sin request aprobado.

## Diferencia Entre Allowlist Y Aprobacion

El allowlist autoriza la composicion del candidato. No autoriza por si solo:

- hacer merge a `develop`;
- disparar un workflow manual;
- mutar infraestructura;
- forzar Argo CD;
- cerrar el CR;
- crear o transicionar Jira.

En `CR-SST-0152`, cada repo conserva un gate humano independiente y el rollout
se ejecuta en orden: `sst-bend`, `4uentes-auth`, `sst-fend`.

## Flujo Operativo

1. Congelar `base` y `source` por SHA.
2. Expandir cada patron contra el diff real.
3. Fallar si un patron critico produce cero resultados.
4. Separar archivos completos de archivos mixtos por hunks.
5. Aplicar solo paths y hunks permitidos en un worktree aislado.
6. Confirmar que las exclusiones no aparezcan en el candidato.
7. Actualizar specs, docs y capabilities del repo owner.
8. Ejecutar tests, build, check, `git diff --check` y escaneo de secretos.
9. Comparar `base -> candidato` y `source -> candidato` para demostrar que no
   falta alcance permitido ni entro alcance diferido.
10. Publicar un PR hijo y pedir la aprobacion de merge correspondiente.

## Que Hacer Si El Allowlist Esta Mal

No se amplia silenciosamente durante la implementacion.

Si un test o la inspeccion descubre un path faltante:

1. pausar el worktree sin publicar el repo hijo;
2. registrar evidencia del gap;
3. corregir el manifest en el control plane;
4. validar `npm run check`;
5. obtener el merge humano de la enmienda;
6. revalidar los SHA y continuar.

Este fue el caso de `preview-learning-source.usecase.js`: el nombre contenia
`preview`, pero pertenecia al contrato estable de Learning annotations. La
exclusion correcta debia apuntar al dominio de article preview, no a cualquier
archivo cuyo nombre incluyera esa palabra.

## Criterio De Finalizacion

Un candidato recompuesto queda listo para PR cuando:

- todos los paths incluidos tienen un CR o una razon gobernada;
- todo patron fue expandido y revisado;
- los hunks mixtos fueron separados;
- las exclusiones siguen ausentes;
- owner docs y capabilities estan alineados;
- los checks requeridos pasan o existe un blocker verificable;
- el diff no contiene secretos ni artefactos locales;
- el merge y el rollout siguen sujetos a sus gates propios.

## Ejemplo Vivo

El manifest vigente de referencia es:

- [`CR-SST-0152/promotion-manifest.yaml`](../../evidence/requests/CR-SST-0152/promotion-manifest.yaml)

La evidencia de dos correcciones reales esta en:

- [`stable-allowlist-gap-2026-08-07.md`](../../evidence/requests/CR-SST-0152/stable-allowlist-gap-2026-08-07.md)
- [`learning-preview-allowlist-gap-2026-08-07.md`](../../evidence/requests/CR-SST-0152/learning-preview-allowlist-gap-2026-08-07.md)
