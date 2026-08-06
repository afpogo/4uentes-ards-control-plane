# Reconciliacion Del Allowlist De Recomposicion

## Resultado

El merge del PR de control plane `#2` aprobo el inicio de la recomposicion
aislada. El preflight posterior verifico los cuatro `origin/develop` y encontro
que los SHAs base siguen coincidiendo con el manifest, pero tambien demostro que
varios patrones del allowlist no corresponden a las rutas reales del source o
dejan afuera barrels, indices owner y wiring necesarios.

No se publicara un PR hijo parcial. La ampliacion exacta de paths se presenta en
un PR de control plane separado y debe mergearse antes de continuar con esos
paths. Cada merge hijo conserva su aprobacion humana independiente.

## Bases Revalidadas

| Repo | Base `origin/develop` | Source observado | Resultado |
| --- | --- | --- | --- |
| `sst-bend` | `8d36a91832a3c55445255c938f0de257312f166b` | `b47ca013abea653d7651da5f71c537ea11f9ed64` | coincide |
| `4uentes-auth` | `82f84da4a99feb7b9606c5b1244f8f05ac60efaa` | `5d722794e1094100be4fa088d99bcf6c7afb4e09` | coincide |
| `sst-fend` | `164c19cfcb88c22048eb5cbf5b6c47aa2fa09776` | `832b39e3811e887f567fa94550e02841057885cf` | coincide |
| `sst-extension` | `2cd6ad495eaf15668ccbb586911ceaf9ac24b344` | delta sin commit sobre la misma base | coincide; captura gobernada pendiente |

## Hallazgos Por Repo

### `sst-bend`

- Tres patrones LearningWorkspace expandian a cero rutas porque el source usa
  `application/learning-workspaces`, `infrastructure/db/postgres` y
  `presentation/schemas`.
- Article semantics, retiro de `/filterArts`, Plaud y preview requieren wiring,
  schemas, rutas, indices owner y repositorios que no estaban enumerados.
- `CR-SST-0123` debe atribuir los hunks de Text nativo sin URL.
- Los aliases npm presentes solo en el `package.json` excluido se reemplazan por
  invocaciones directas a sus scripts.
- El worktree aislado quedo limpio, sin commits ni cambios parciales.

### `4uentes-auth`

- Los inbound owner reales usan el prefijo `sst-bend--`; el patron anterior no
  autorizaba ninguno.
- Faltaban los barrels `src/domain/constants/index.ts`, `src/domain/index.ts` y
  `src/infrastructure/index.ts`, ademas de los indices de capabilities y su
  overview.
- Se recompuso localmente una unica unidad segura de body limits, commit
  `f09c82eba54c9707c0c45099f795bd5f6e763aae`; no fue publicada. El resto queda
  detenido hasta el merge de esta enmienda.

### `sst-fend`

- El diff contiene 112 paths. Trece se excluyen como paths completos y quedan
  99 candidatos con revision por hunk.
- El source agrega specs y capabilities nuevas que requieren sus indices de
  descubrimiento, la ruta `/learning` y el path del servicio.
- El archivo `docs/architecture/articles-modal-sheet.md` mezcla el patron
  gobernado de `SstSheetWorkspace` con el piloto `SstInfoPill` sin request; solo
  el primer hunk puede incluirse.
- `specs/33-articles-frontend.yml` contiene ruido de reformateo y capabilities
  historicas con `request_id: TODO`; la recomposicion debe seleccionar unicamente
  hunks atribuidos a los CRs enumerados.
- `SstInfoPill` y los cuatro task reports con `request_id: TODO` permanecen
  excluidos.
- `ArticleTreeExplorer` y los estilos de `ArticleDetailView` conservan el base:
  su delta observado es solo piloto o formato. `ArticleDetailView.tsx` conserva
  unicamente sus hunks gobernados de semantica.
- Dos fixes LearningWorkspace con `request_id: TODO` estan entrelazados dentro
  de archivos nuevos. El commit de sheet queda con merge gate hasta reconciliar
  esos lifecycles o reconstruir y probar el comportamiento gobernado anterior.

### `sst-extension`

- Draft A necesita indices owner, contratos runtime, clientes BFF, materializers
  PDF, permisos por origen y tests que no estaban en el allowlist.
- Los mismos archivos mezclan captura base con lease global y preview privada;
  las reglas de hunk ahora excluyen `<all_urls>`, lease, consentimiento privado,
  `previewCandidate` y `firstFrameDataUrl` del Draft A.
- `credentialed-web-source` debe documentar solo la proyeccion semantica en A y
  no afirmar la capacidad privada de `CR-SST-0139`.
- El candidato parcial no es publicable ni validable; no tiene commits y conserva
  hunks B para retirar despues de aprobar la enmienda.

## Exclusiones Preservadas

- `CR-SST-0125` y cualquier implementacion asociada.
- `example.png`, la captura PNG de extension y toda evidencia runtime privada.
- Workflows historicos SST-26, logs, env locales, keys y ruido de `package.json`.
- Pilotos o fixes cuyo artefacto owner conserva `request_id: TODO`.
- Draft B de extension hasta completar sus dependencias, hardening de imagen y
  QA privada.

## Gate De Continuidad

1. Validar este manifest con `npm run check` y revision de secretos.
2. Publicar la enmienda como draft y obtener merge humano.
3. Reanudar los worktrees aislados desde los mismos SHAs si siguen vigentes.
4. Validar cada candidato completo antes de publicar su draft hijo.
