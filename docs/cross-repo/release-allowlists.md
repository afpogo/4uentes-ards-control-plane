# Promotion Path Allowlist Para Recomposicion Y Release

## Proposito

Un `promotion path allowlist` es una lista explicita de paths y hunks que
pueden participar en la recomposicion de un candidato de release. En un
release cross-repo se usa cuando una rama fuente contiene trabajo mezclado y
no debe promoverse completa a `develop`.

En prosa humana se usa "allowlist de rutas de promocion". Se conserva el
identificador tecnico `path_allowlist` porque es una clave estable del
manifest, junto con `hunk_rules` y `explicit_exclusions`.

El `promotion path allowlist` responde una pregunta concreta:

> De todo lo que existe en la fuente, ¿que archivos y que partes de esos
> archivos estan autorizados por este request?

No es una lista de servidores, usuarios, IPs ni permisos de red. Tampoco es un
reemplazo de tests, revision de codigo o aprobacion de merge.

## Nomenclatura ARDS/SDD

La palabra `allowlist` no debe usarse sola en documentacion nueva cuando pueda
confundirse la seleccion de cambios con una regla runtime. Se debe usar uno de
los siguientes terminos calificados:

| Termino | Owner y alcance | Que selecciona |
| --- | --- | --- |
| `promotion path allowlist` | control-plane; un request, un repositorio, una base y una fuente | paths y hunks que pueden entrar al candidato |
| `runtime network allowlist` | repo owner de infraestructura o seguridad | redes, peers, puertos o trafico permitido |
| `runtime IP allowlist` | repo owner de infraestructura, seguridad o proveedor | direcciones o rangos IP permitidos |
| `integration domain allowlist` | owner de una integracion | dominios a los que puede acceder el conector |
| `deployment artifact allowlist` | repo owner de GitOps o admission policy, cuando exista | imagenes, tags inmutables o digests admitidos |

Reglas de uso:

- `path_allowlist` siempre representa un `promotion path allowlist`.
- "Infra allowlist" y "server allowlist" estan prohibidos como terminos
  aislados porque no identifican la capa ni el recurso seleccionado.
- Una `runtime network allowlist`, `runtime IP allowlist`, `integration domain
  allowlist` o `deployment artifact allowlist` debe vivir en las specs y owner
  docs del repositorio que opera esa regla. No se define dentro del manifest
  de promocion.
- El alcance completo de un `promotion path allowlist` es la tupla
  `service_id + repository + base SHA + source SHA + request_id`.
- Los paths son relativos al repositorio declarado; un mismo nombre de archivo
  en otro repositorio no queda autorizado por coincidencia.
- La evidencia historica puede conservar la palabra `allowlist` en titulos. Si
  referencia `path_allowlist`, se interpreta como `promotion path allowlist`.

## Cuando Se Necesita

Usar un `promotion path allowlist` cuando:

- una rama historica mezcla varios CRs;
- parte del trabajo esta aprobado y parte sigue diferida;
- hay archivos con cambios de mas de una feature;
- deben excluirse workflows viejos, logs, `.env`, secretos o evidencia local;
- el candidato debe reconstruirse sobre el `origin/develop` actual.

Si una rama contiene un unico cambio pequeno, limpio y aprobado, normalmente
no hace falta recomponerla por `promotion path allowlist`: puede revisarse como
un PR convencional.

## Estructura Del Manifest

Ejemplo reducido:

```yaml
repository: "sst-bend"
service_id: "sst-bend"
request_id: "CR-SST-0152"
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

## Diferencia Entre Promotion Path Allowlist Y Aprobacion

El `promotion path allowlist` autoriza la composicion del candidato. No
autoriza por si solo:

- hacer merge a `develop`;
- disparar un workflow manual;
- mutar infraestructura;
- forzar Argo CD;
- cerrar el CR;
- crear o transicionar Jira.

En `CR-SST-0152`, cada repo conserva un gate humano independiente y el rollout
se ejecuta en orden: `sst-bend`, `4uentes-auth`, `sst-fend`.

## Caso De Infraestructura Con Cambios Mezclados

Supongamos que `sst-4uentes-infra` tiene este working tree:

```text
M k8s-manifests/overlays/development/sst-bend.yaml
M k8s-manifests/overlays/production/ingress.yaml
M secrets/local-values.yaml
```

El manifest puede autorizar solamente:

```yaml
service_id: "sst-4uentes-infra"
repository: "sst-4uentes-infra"
request_id: "CR-SST-0000"
path_allowlist:
  - "k8s-manifests/overlays/development/sst-bend.yaml"
explicit_exclusions:
  - path: "k8s-manifests/overlays/production/**"
    reason: "production no pertenece a este release"
  - path: "secrets/**"
    reason: "secretos y configuracion local excluidos"
```

Aqui `path_allowlist` es el `promotion path allowlist`: selecciona un archivo
para reconstruir un PR limpio. No crea ni modifica reglas runtime como una
`runtime network allowlist` o una `runtime IP allowlist`, ni representa una
lista de servidores.

Si el archivo permitido contiene a su vez una NetworkPolicy, existen dos
revisiones distintas:

1. el control-plane comprueba si el path y sus hunks pueden entrar al release;
2. el repo de infraestructura valida la semantica runtime de esa NetworkPolicy.

La primera revision no reemplaza ni implica la segunda.

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

## Que Hacer Si El Promotion Path Allowlist Esta Mal

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
