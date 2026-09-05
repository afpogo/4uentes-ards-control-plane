# CR-SST-0231: reconciliación del QA local

Fecha observada: 2026-09-05.

Rol documental: evidencia de ejecución del control plane. El owner técnico de
la UI, sus pruebas y sus contratos continúa siendo `sst-fend`. Este documento
no autoriza mutaciones ni sustituye las specs y docs del repo owner.

## Resultado

El gate `localhost:4090` queda **no aprobado**. La repetición confirmó los dos
fallos descubiertos en el gate del 2026-08-29:

- cuatro introducciones de texto normal permanecen por debajo de `4.5:1`;
- `Sign in to start`, usado después de `View walkthrough`, crea el formulario
  de login fuera del viewport porque continúa anclado al header superior.

No se modificaron archivos owner durante esta repetición. Tampoco hubo commit,
push, PR, despliegue en `localhost:8088`, escritura Jira, operación de
infraestructura ni acceso a credenciales o sesiones autenticadas.

## Identidad del source

El contenedor Docker `sst-fend` observado publica `4090` y monta el checkout
histórico preservado de `sst-fend` en `/app`. No sirve el worktree limpio
`agent/cr-sst-0231-public-landing-contrast`.

Por esa diferencia, el resultado es evidencia válida de reproducción sobre el
ambiente de desarrollo levantado, pero no es evidencia de aceptación del branch
owner. Un `HTTP 200` o un render visualmente correcto no elimina este gap de
identidad.

## Matriz observada

| Control | Desktop `1440x900` | Mobile `390x844` | Resultado |
| --- | --- | --- | --- |
| Documento y assets | `200` o `304` | `200` o `304` | PASS |
| Overflow horizontal | no | no | PASS |
| Botones y signal tags | mínimo `5.26:1` | mínimo `5.26:1` | PASS |
| Introducciones sobre gradiente | `4.37`, `4.17`, `4.05`, `4.06` | `4.49`, `4.24`, `4.05`, `4.05` | FAIL |
| `View walkthrough` | heading visible a `187px` | scroll ejecutado | PASS |
| `Sign in to start` | formulario a `top=-1071.8px` | formulario a `top=-1416.8px` | FAIL |
| `Sign in` del header | formulario creado | formulario visible entre `352.8px` y `702.8px` | PASS |
| Tamaño de controles primarios | sin clipping | `44px` de alto | PASS |

Los ratios de las introducciones se calcularon con el foreground computado y
píxeles del fondo realmente renderizado. Este control es necesario porque una
auditoría agregada puede omitir nodos cuyo fondo usa gradientes CSS y producir
un falso positivo.

## Estabilidad del servidor

Webpack completó compilaciones correctas. Durante una recompilación larga se
observaron un timeout HTTP y una desconexión del WebSocket de hot reload. El
contenedor permaneció `running`, con `RestartCount=0`, sin OOM y con uso bajo de
CPU al tomar la muestra. Cinco probes posteriores respondieron `200` entre
`4ms` y `12ms`.

Esto se clasifica como intermitencia del servidor de desarrollo durante build,
no como caída persistente. La evidencia final confirma que `4090` continuó
encendido.

## Consola

La carga final conservó avisos de desarrollo por:

- future flags de React Router;
- casing de `fetchPriority` en un elemento DOM;
- deprecación de `findDOMNode` dentro de componentes observadores/tooltips.

No se atribuyen silenciosamente estos avisos al cambio de contraste. Deben
permanecer separados hasta que un request owner los clasifique.

## Siguiente lote propuesto

El port owner existente conserva doce paths sin commit. Resolver el nuevo gap
requiere dos paths adicionales y vuelve a abrir tres superficies ya incluidas.
La corrección futura queda propuesta como una allowlist exacta de cinco paths:

- `src/pages/Landing/styles.module.scss`;
- `src/pages/Landing/index.tsx`;
- `src/pages/Landing/__tests__/Landing.test.tsx`;
- `specs/36-public-landing-frontend.yml`;
- `docs/36-public-landing-frontend.md`.

El total final del worktree owner sería de catorce paths: los doce originales
más `Landing/index.tsx` y la nueva prueba.

La implementación debe garantizar contraste normal de al menos `4.5:1`, hacer
visible el login desde la posición scrolleada, agregar una prueba owner y
repetir `npm run check`, `git diff --check` y QA sobre el worktree limpio. No se
autoriza esa mutación mediante esta evidencia.

## Stop condition

No avanzar con mutaciones adicionales de `sst-fend` hasta validar esta
reconciliación en el control plane y recibir autorización humana explícita para
el lote correctivo de cinco paths. La publicación owner, Jira y `8088`
permanecen como gates separados.
