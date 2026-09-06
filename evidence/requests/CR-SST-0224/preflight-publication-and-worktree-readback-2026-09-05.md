# Readback de publicación y worktrees de CR-SST-0224

## Clasificación y alcance

- Rol documental primario: evidencia de ejecución y readback.
- Owner: `4uentes-ards-control-plane`.
- Estado: observado y reconciliado el 2026-09-05.
- Alcance: publicación del preflight y retiro de worktrees del control plane.
- Límite: este documento no autoriza publicación Git adicional, Jira,
  `sst-chatbot`, runtime, deployment ni datos.
- Fuentes técnicas: historia de `origin/main`, GitHub PR #202 y #245,
  `worktree-request-lifecycle-policy` y el lifecycle de `CR-SST-0224`.

## Readback canónico

Los tres documentos de preflight fueron introducidos efectivamente en
`origin/main` mediante PR #202:

| Dato | Valor observado |
| --- | --- |
| PR | `#202` |
| Head | `6637dc82e7a668694602fcb16000b09d10840c4b` |
| Merge | `71de402ea05c31e9b70cb41d32dd472cb44907a0` |
| Delta canónico | 3 archivos, 235 inserciones |

PR #245 fusionó después el commit recuperado `69b41f1fbf61293d2688322572e1494c62a89089`
como merge `532daf0db616a59cef9ecd37a227aca531bc9dd3`. Su primer parent ya contenía los
mismos documentos, por lo que ese merge no produjo delta de árbol. Se registra
como reconciliación y confirmación de alcance, no como segunda publicación de
contenido.

`origin/main@3159e67b435a9dc8e5c378d277f46ae5a94b730a` contiene los documentos y
alcanza ambos commits de preflight.

## Retiro controlado

Antes del retiro se comprobó para ambos worktrees:

- `git status` limpio;
- `HEAD` alcanzable desde `origin/main`;
- path resuelto dentro de `worktrees/`;
- ausencia de procesos con el path en su línea de comando;
- conservación de ramas locales y remotas.

| Worktree retirado | Branch preservada | Head integrado |
| --- | --- | --- |
| `worktrees/CR-SST-0224-running-preflight` | `agent/cr-sst-0224-running-preflight` | `69b41f1fbf61293d2688322572e1494c62a89089` |
| `worktrees/CR-SST-0224-preflight-recovery` | `agent/cr-sst-0224-preflight-recovery` | `6637dc82e7a668694602fcb16000b09d10840c4b` |

No se borró ninguna rama. El nuevo worktree
`worktrees/CR-SST-0224-running-start` quedó creado desde
`origin/main@3159e67b435a9dc8e5c378d277f46ae5a94b730a`, inicialmente limpio y con
divergencia `0/0`.

## Resultado

El preflight está canónico y los dos árboles históricos ya no compiten con la
ejecución actual. El siguiente gate es validar y publicar el lifecycle
`running` del control plane. Sólo después de su merge y readback se pueden
solicitar, por separado, los lotes exactos de owner y Jira.
