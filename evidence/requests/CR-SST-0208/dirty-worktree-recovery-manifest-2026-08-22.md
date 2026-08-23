# CR-SST-0208 - Manifiesto de recuperación de worktrees dirty

Fecha: 2026-08-22.

## Decisión

Los siete árboles dirty se mantienen en cuarentena. La inspección fue de
solo lectura sobre repositorios owner; no se descartaron cambios, no se
crearon commits owner y no se modificaron branches ni remotos.

La recuperación se separa en tres disposiciones:

| Disposición | Cantidad | Regla |
| --- | ---: | --- |
| preservación y extracción obligatoria | 2 | No retirar; contiene trabajo único o no publicado. |
| dependiente de otra recuperación | 1 | No retirar hasta cerrar la dependencia de evidencia. |
| supersesión semántica candidata | 4 | El canon posterior cubre la intención, pero descartar el patch dirty requiere aprobación explícita. |

## Matriz por árbol

| Repo / worktree | Estado observado | Disposición | Unidad de recuperación |
| --- | --- | --- | --- |
| `4uentes-orchestor` / raíz | Branch ocho commits adelante; 32 archivos trackeados modificados y 428 archivos relevantes expandidos desde entradas untracked, además de directorios generados. | Preservar y extraer. | Separar por familias de lifecycle; nunca fusionar el árbol completo. |
| `4uentes-orchestor/worktrees/init-sst-0007` | 8 archivos: 4 divergentes de `origin/main` y 4 ausentes. | Dependiente. | Conservar hasta publicar o superseder la evidencia Jira/INIT-SST-0007 más avanzada presente en la raíz dirty. |
| `sst-extension/cr-sst-0152-sst-extension-a` | 56 archivos, `+2267/-269`; 44 divergentes y 12 ausentes en `origin/develop`; sin upstream propio y seis commits detrás. | Preservar y extraer. | Dividir por `CR-SST-0098`, `0100`, `0101`, `0119`, `0121`, `0131` y `0132`; requiere aprobación owner antes de mutar o publicar. |
| `sst-4uentes-infra/cr-sst-0178-browser-socket-ingress` | 4 archivos divergentes; branch 19 commits detrás. El canon actual contiene el ingress Socket.IO publicado por `CR-SST-0199`. | Supersesión semántica candidata. | Registrar comparación final contra el contrato `platform-local-ingress`; no portar el patch antiguo completo. |
| `sst-4uentes-infra/CR-SST-0178-infra` | 24 archivos: 1 idéntico, 21 divergentes y 2 paths ausentes; branch 39 commits detrás. | Supersesión semántica candidata. | El runtime GitOps fue integrado y evolucionó en `33aa4c7`, `9421525` y `4b9db38`; verificar sólo cualquier intención residual de los dos paths retirados. |
| `sst-chatbot/CR-SST-0178-chatbot` | 9 archivos divergentes; branch 6 commits detrás. | Supersesión semántica candidata. | El packaging, Dockerfile, health y workflow fueron publicados y evolucionados por `775a7a2`; no portar el snapshot antiguo. |
| `sst-fend/.worktrees/init-sst-0007-closure/fend` | 5 archivos: 3 idénticos al canon y 2 evolucionados. El remote local apunta a un path temporal, no al owner canónico. | Supersesión semántica candidata. | `origin/develop` del repo owner ya conserva clasificación 401/403, refresh coordinado y logout; mantener sólo el readback histórico. |

## Descomposición de la raíz del control plane

El status compacto de la raíz mezcla material que pertenece a varias épocas.
Al expandir archivos relevantes y excluir `.pnpm-store/`,
`.sst7-local-deploy/` y el directorio contenedor `worktrees/`, se observaron
460 paths:

- 79 son byte-identical a `origin/main`;
- 120 existen en `origin/main` pero divergen;
- 261 no existen en `origin/main`.

La ausencia en `origin/main` no implica que el contenido deba publicarse:
incluye resultados Jira, previews, scripts de escritura, lifecycle duplicado o
histórico y evidencia que puede haber sido supersedida. Tampoco autoriza su
descarte.

Las unidades mínimas de recuperación son:

1. `HPT`: ocho commits no publicados y la iniciativa local
   `INIT-HPT-0002`; requiere reconciliar su propio lifecycle y base actual.
2. Visual documentation: `CR-CP-0006`, `CR-CP-0018`, `CR-CP-0019` y
   `CR-CP-0020`; gran parte ya fue publicada, por lo que se debe conservar sólo
   el delta residual verificable.
3. RAG gobernado: `CR-SST-0155` y `CR-SST-0156`; la raíz contiene lifecycle de
   cierre y evidencia Jira que no están en `origin/main`.
4. Seguridad criptográfica: `INIT-SST-0008` y `CR-SST-0157` a
   `CR-SST-0164`; contiene material publicado, divergente y ausente mezclado.
5. Chat conectado: `INIT-SST-0007` y `CR-SST-0165` a `CR-SST-0185`; el canon
   posterior avanzó, pero sobreviven evidencias locales no publicadas.
6. Calidad integrada: `INIT-SST-0009` y `CR-SST-0177`.
7. Memoria personal: `INIT-SST-0010` y `CR-SST-0192` a `CR-SST-0198`; incluye
   el uso local incompatible de `CR-SST-0202` y no se puede fusionar completo.
8. Históricos puntuales: `CR-SST-0083`, `0086`, `0125`, `0147`, `0152`,
   `0175`, `0176` y `0207`; decidir uno por uno entre evidencia portable,
   duplicado y supersesión.

Los directorios generados o locales quedan fuera de cualquier port:
`.pnpm-store/`, `.sst7-local-deploy/` y `worktrees/` no son evidencia de
lifecycle publicable.

## Dependencia de `init-sst-0007`

El worktree `init-sst-0007` agrega la iniciativa, resultados Jira y cambios de
jerarquía para `CR-SST-0155`/`0156`. El canon actual contiene una
reconciliación posterior de `INIT-SST-0007`, mientras que la raíz dirty conserva
un conjunto más amplio de cierre y resultados Jira. Por eso no se declara el
worktree descartable hasta resolver primero la unidad RAG/INIT-SST-0007 de la
raíz.

## Boundary owner

`CR-SST-0208` sólo autoriza normalización del control plane. La inspección no
convierte los cambios owner en cambios aprobados. En particular, Extension
contiene implementación funcional transversal y debe recibir una aprobación
owner separada antes de crear branches de recuperación, instalar dependencias,
ejecutar fixes o publicar PRs.

## Siguiente gate

1. Recuperar la raíz por una unidad de lifecycle a la vez, comenzando con un
   readback de los ocho commits HPT y sus dependencias sin commit.
2. Abrir una decisión owner para atomizar Extension por los siete request IDs
   observados.
3. Producir readback final de equivalencia para los cuatro snapshots owner
   supersedidos y solicitar autorización explícita antes de descartarlos.
4. Resolver `init-sst-0007` sólo después de la unidad RAG/INIT-SST-0007 de la
   raíz.
