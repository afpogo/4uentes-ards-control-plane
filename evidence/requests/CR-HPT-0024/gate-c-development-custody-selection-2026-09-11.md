# Gate C — selección de custodia temporal para development

Fecha local: 2026-09-11. Request owner: `CR-HPT-0024`. Coordinación:
`CR-CP-0024`.

## Decisión

El operador seleccionó SST Dictionary Secrets como candidato futuro para la
gestión de credenciales cuando SST alcance producción. Para cerrar los
prerrequisitos actuales de development se seleccionan archivos cifrados con
`age` y frase de paso interactiva, con una copia primaria y otra copia cifrada
en un dominio de falla independiente.

Dictionary Secrets v1 no se adopta como raíz de confianza de AIStor/KMS. Su
contrato vigente declara que no reemplaza un vault empresarial, excluye
material de recuperación extrema y sólo tiene evidencia validada en
development. Además, SST consume la plataforma que Gate C debe iniciar; guardar
allí el HSM raíz o su recuperación introduciría una dependencia circular.

Una evaluación futura de Dictionary queda limitada a credenciales derivadas o
referencias opacas y requiere un request del owner de SST. Producción mantiene
abierta la selección de un gestor externo de Secrets o HSM independiente.

## Preflight observado

| Check | Resultado sanitizado |
| --- | --- |
| `minio.license` | Nueva descarga sellada; plaintext retirado después de recuperación comprobada |
| `age` | `v1.3.1`, disponible |
| Perfil de cifrado development | Seleccionado |
| Destino primario privado | Copia cifrada presente y no vacía |
| Destino de recuperación independiente | Copia cifrada presente y no vacía en pendrive |
| Archivo de licencia cifrado y recuperación comprobada | `PASS` |
| HSM utilizable | No generado |
| Credenciales root | No generadas |
| Secrets Kubernetes | No creados |
| Mutación de runtime | No realizada |
| Helm | `v3.19.4` instalado y priorizado en el PATH del usuario; mínimo `3.17+` satisfecho |

## Intentos operativos fallidos y corrección

Dos ejecuciones PowerShell de la Unidad A terminaron `FAIL`. En la primera se
ingresó un directorio en lugar del archivo y `age` dejó una salida parcial. En
la segunda, las salidas parciales preexistentes activaron el stop condition y
la frase de paso no coincidió. En ambos casos la apertura de recuperación
devolvió `unexpected EOF`; por tanto, las copias no son evidencia recuperable.
El operador continuó pegando instrucciones después de los errores, se
imprimieron cadenas `PASS` literales y el plaintext fue eliminado. Esas cadenas
no acreditan ningún check. No se registran rutas personales, hashes, frases de
paso ni contenido de licencia.

El owner corrige el runner para ejecutar el sellado como una sola unidad,
detenerse ante el primer error, retirar únicamente salidas parciales creadas por
ese intento y preservar el plaintext. La eliminación pasa a un bloque separado
que sólo se habilita tras `ready-for-plaintext-removal: YES`, vuelve a exigir un
archivo regular llamado exactamente `minio.license` y requiere confirmación
literal. Gate C licencia sigue pendiente de una nueva descarga y una ejecución
exitosa con el runner corregido.

Infra PR #38 publicó la corrección mediante merge
`f2b2531d504e7e8df6536acca5f02dcbb1a2e860`; `validate-repository` terminó
`SUCCESS`. La validación local pasó el check owner completo y el análisis de
sintaxis de ocho bloques Bash y diez bloques PowerShell.

Infra PR #39 añadió el procedimiento reversible de cuarentena para las salidas
`.age` inválidas y quedó integrado mediante
`c27e7f70984c810cd40fffa58a1abb8f41a61c11`; `validate-repository` terminó
`SUCCESS`. El corte valida nueve bloques Bash y once PowerShell.

Infra PR #40 convirtió generación, cifrado directo, copia y recuperación del
soft-HSM en una unidad fail-closed. Quedó integrado mediante
`418a35c1cc5c2eb3546827a99efb69d25795eefa`; `validate-repository` terminó
`SUCCESS`. La ejecución HSM permanece pendiente del operador.

Infra PR #42 sustituyó antes de futuras ejecuciones el dry-run con HSM real por
un fixture sintético y quedó integrado mediante
`1ac78027408818b4afeffef7c93afc3491727fd6`; `validate-repository` terminó
`SUCCESS`. El bloque sintético exacto pasó localmente sin acceso al HSM real.

## Cierre técnico de Unidad A

Timestamp del operador: `2026-09-11T18:46:32-03:00`.

| Check | Resultado sanitizado |
| --- | --- |
| Entrada regular, legible y no vacía antes del sellado | `PASS` |
| Cifrado interactivo con `age` | `PASS` |
| Copia primaria cifrada presente y no vacía | `PASS` |
| Copia cifrada independiente presente y no vacía | `PASS` |
| Igualdad local de ambas copias | `PASS` |
| Apertura de la copia independiente sin materialización plaintext | `PASS` |
| Plaintext retirado después de todos los checks | `PASS` |
| Salidas de intentos fallidos separadas con sufijo `invalid` | `PASS` |

No se conserva en evidencia el contenido, la frase de paso, un hash, una ruta
personal ni salida cruda. Unidad A queda validada técnicamente. Gate C continúa
abierto para la Unidad B de generación, cifrado y recuperación del soft-HSM y
para los contratos/materialización por etapas de Secrets.

## Avance técnico de Unidad B

Timestamp del operador: `2026-09-11T19:18:27-03:00`.

| Check | Resultado sanitizado |
| --- | --- |
| Imagen KMS fijada por digest disponible | `PASS` |
| Generación y cifrado directo del soft-HSM | `PASS` |
| Copias cifradas primaria e independiente presentes | `PASS` |
| Igualdad local de ambas copias | `PASS` |
| Apertura en memoria y formato HSM | `PASS` |
| Dry-run client de `receipt-kms-hsm:hsm` | `PASS` |
| Recurso ausente del cluster después del dry-run | `PASS` |
| Directorio efímero sin entradas después del cierre | `PASS` |

El operador alcanzó a ejecutar el bloque de PR #41 antes de su sustitución: el
HSM real se materializó temporalmente bajo ACL privada, el dry-run no lo envió
al API Server y el `finally` retiró el archivo. La comprobación posterior no
encontró entradas efímeras ni el Secret en el contexto actual. La eliminación
normal no constituye borrado forense; por ello el owner reemplaza este dry-run
por un fixture sintético y mantiene cifrado el HSM real en futuras ejecuciones.
No se registra contexto local, ruta, contenido, frase de paso ni hash.

La frase de paso no puede pasar por chat, logs, Git, Jira ni comandos con valor
literal. Por ello, el cifrado y la prueba de recuperación son una acción
interactiva del operador guiada por el runbook owner.

## Cambios owner autorizados

La instrucción de continuar autoriza la actualización documental acotada de
`CR-HPT-0024` y su publicación. El owner debe actualizar el playbook, runbook y
tarea para:

- describir el perfil `age` de development;
- cifrar licencia, HSM y `config.env` antes de custodiarlos;
- exigir una recuperación comprobada y copia independiente;
- preservar la separación entre custodia temporal, Secrets Kubernetes y el
  futuro gestor de producción;
- no mutar todavía el cluster ni crear Secrets.

Infra PR #34 publicó esta decisión en `develop` mediante merge
`00049b7636c06aa34d9b5b77fe70eeb2be9df503`; su CI
`validate-repository` terminó `SUCCESS`. El check owner completo y la sintaxis
de los siete bloques PowerShell del runbook pasaron localmente.

Infra PR #35 añadió Bash/Linux como ruta principal, PowerShell/Windows como
fallback y el ciclo `OPEN / USE / CLOSE`; quedó integrado mediante
`3afe7dd240ada84396575c0ecb38106d6156a75e`. Infra PR #36 incorporó el perfil
elegido de recuperación en pendrive y el procedimiento completo de cifrado,
verificación, retiro del plaintext y expulsión; quedó integrado mediante
`12219e55889e6dcf5bff96646ddc3ef26e8c05f7`. Ambos CI terminaron `SUCCESS`.
La validación local final cubrió seis bloques Bash, ocho bloques PowerShell y
el check owner completo.

Infra PR #37 añadió el desglose explícito de la transformación
`minio.license` plaintext a `minio.license.age` cifrado, incluyendo sellado,
verificación, copia, recuperación, retiro del original y expulsión. Quedó
integrado mediante `32ab87691f12992b92743e50164c1b693dd082bc`, con CI
`SUCCESS`. El corte final valida siete bloques Bash y nueve PowerShell.

## Siguiente unidad

El destino de recuperación seleccionado es un pendrive y la Unidad A quedó en
`PASS`. La siguiente unidad genera y cifra directamente el soft-HSM, sin
persistir una copia en claro.

Fuentes owner:

- `docs/playbooks/aistor-kms-prerequisites.md`
- `docs/runbooks/aistor-kms-prerequisites.md`
- `specs/infra/deployment-contracts/receipt-custody-platform.yaml`

Fuente de contrato SST: `docs/requests/dictionary-secret-management-contract.md`.
