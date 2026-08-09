# Candidato SST Frontend Y Separacion De CR-SST-0149

## Candidato Gobernado

El candidato de `sst-fend` fue recompuesto desde
`origin/develop@164c19cfcb88c22048eb5cbf5b6c47aa2fa09776` en la rama
`release/CR-SST-0152/sst-fend-development-reconciliation` y publicado como el
PR [sst-fend#5](https://github.com/afpogo/sst-fend/pull/5), listo para revision
despues del CI exitoso. El `HEAD` publicado es
`da27585f3934288f93eaf9189af1b6476cb9cbe6`.

El candidato conserva cinco unidades auditables:

1. `e675112e4647edf425e10ea99775fa0c4dad4d6f`, adopcion gobernada del sheet y
   Learning Workspace;
2. `33c93c9b86552ef9771d5161941cf2b8ee15aa8a`, separacion entre preview de
   fuente y contexto aceptado (`CR-SST-0153`);
3. `8edff561ffb5043e736bb9dd510a68483841eddb`, clasificacion de presentacion de
   fuente (`CR-SST-0154`);
4. `39b9410393f4bb0118522a27d452bacba43e0990`, semantica canonica de articulos;
5. `da27585f3934288f93eaf9189af1b6476cb9cbe6`, cierre del loop de solicitudes
   del Home ante un catalogo vacio.

La recomposicion excluye el preview de imagen de articulos de `CR-SST-0120` y
`CR-SST-0140`, `SstInfoPill`, cambios de formato no funcionales,
`ArticleTreeExplorer` y estilos diferidos de `ArticleDetail`. El preview de
Learning Workspace incluido por `CR-SST-0153` no es el preview de imagen de
articulos diferido.

## Validacion Local

- `npm.cmd run css:types:check`: OK;
- Jest completo: 29 suites y 195 tests en verde;
- `npm.cmd run build`: OK, con tres advertencias historicas de tamano de bundle;
- `npm.cmd run check`: OK, incluidas las validaciones ARDS/SDD del repo;
- `git diff --check`: OK;
- comparacion contra allowlist y busquedas de exclusiones: OK;
- GitHub Actions `build-publish-update`, run `31298624957`: OK; check del repo,
  build frontend y build de imagen completados. Login a GHCR, publicacion y
  actualizacion de infraestructura fueron omitidos correctamente por tratarse
  de un PR sin merge.

## Merge Y Rollout De Desarrollo

La aprobacion humana fusiono el PR #5 a `develop` el 2026-08-09. La cadena
observada fue:

- merge commit: `94a4b4ee0d8b2fcae63b801f9e1d29ce89758de3`;
- workflow push: `31311347292`, resultado `success`;
- imagen: `ghcr.io/afpogo/sst-fend:develop-94a4b4ee0d8b`;
- digest: `sha256:de0bdbebb04f2f59427f18b13e0d3ba554aea8271d90b34fd93a2ba3b11cdb27`;
- commit GitOps automatico: `579957fc63d541377434c4b99eb62064b33fe777`;
- Argo CD `sst-app`: `Synced` y `Healthy` en ese commit;
- deployment `sst-fend`: una replica lista y disponible;
- pod efectivo: `Running`, readiness verdadera, cero reinicios y `imageID`
  igual al digest publicado;
- smokes: `/`, `/signup`, `/learning` y el bundle principal respondieron 200;
  `/api/learning-workspaces/context` respondio 401 sin credenciales, como
  exige el limite protegido.

No hubo mutacion manual de infraestructura, imagen ni cluster. La publicacion
y reconciliacion fueron ejecutadas por Actions, GHCR, el commit GitOps y Argo
CD.

## Decision Sobre CR-SST-0149

No existe un `stash` de Git en `sst-fend`. La funcionalidad recordada es un
delta local sin commit, preservado en el checkout principal y asociado a
`CR-SST-0149`. La revision confirma que es coherente y publicable: reemplaza
areas de grid rigidas por una grilla intrinseca responsiva, evita solapamientos
y overflow, y agrega pruebas enfocadas de layout.

El delta permanece intacto en estos paths:

- `docs/31-auth-frontend.md`;
- `docs/capabilities/inbound/node-auth--auth-frontend-access-ui.md`;
- `specs/15-ui-framework.yml`;
- `specs/31-auth-frontend.yml`;
- `specs/capabilities/inbound/node-auth--auth-frontend-access-ui.yaml`;
- `src/pages/Auth/pages/Register/components/Form/styles.module.scss`;
- `docs/tasks/2026-08-04-cr-sst-0149-signup-responsive-structure-repair.md`;
- `src/pages/Auth/pages/Register/components/Form/__tests__/RegisterFormLayout.test.ts`.

No se incorporo al PR #5. Con el merge y rollout principal ya validados, se
recompone en una rama nueva desde el `develop` actualizado:
`fix/SST-74/CR-SST-0149/signup-responsive-structure`. Esta separacion evita
confundir una allowlist de paths y hunks de una promocion con la identidad
funcional de otro cambio ya gobernado.

La recomposicion se completo desde
`develop@94a4b4ee0d8b2fcae63b801f9e1d29ce89758de3`. Los ocho archivos del
candidato coincidieron por SHA-256 con el delta local preservado y no se
trasladaron otros cambios del checkout historico. El commit resultante es
`ae1ad2e9a6ae330c46390a9f63a6c3ec4fb5ae3d` y fue publicado como el PR
borrador [sst-fend#6](https://github.com/afpogo/sst-fend/pull/6).

Validacion del candidato:

- prueba focalizada: una suite y tres tests aprobados;
- `npm.cmd run check`: OK;
- CSS Modules sincronizados y build exitoso;
- suite completa: 30 suites y 198 tests aprobados;
- lint: cero errores y 22 warnings historicos;
- `git diff --check`: OK;
- GitHub Actions run `31338685727`: OK; check del repo, build frontend y build
  de imagen completados. Login a GHCR, publicacion y actualizacion de
  infraestructura fueron omitidos correctamente por tratarse de un PR
  borrador sin merge.
