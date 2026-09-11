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
| `minio.license` | Presente, legible y no vacío; contenido no leído ni publicado |
| `age` | `v1.3.1`, disponible |
| Perfil de cifrado development | Seleccionado |
| Destino primario privado | Pendiente de creación por el operador |
| Destino de recuperación independiente | Pendiente de selección por el operador |
| Archivo de licencia cifrado y recuperación comprobada | Pendiente |
| HSM utilizable | No generado |
| Credenciales root | No generadas |
| Secrets Kubernetes | No creados |
| Mutación de runtime | No realizada |
| Helm | `v3.19.4` instalado y priorizado en el PATH del usuario; mínimo `3.17+` satisfecho |

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

## Siguiente unidad

El destino de recuperación seleccionado es un pendrive; la copia primaria queda
cifrada en el perfil local privado. El operador conecta el medio, ejecuta de
forma interactiva la Unidad A y comunica únicamente `Gate C licencia: PASS`.
Después se puede generar y cifrar directamente el soft-HSM, sin persistir una
copia en claro.

Fuentes owner:

- `docs/playbooks/aistor-kms-prerequisites.md`
- `docs/runbooks/aistor-kms-prerequisites.md`
- `specs/infra/deployment-contracts/receipt-custody-platform.yaml`

Fuente de contrato SST: `docs/requests/dictionary-secret-management-contract.md`.
