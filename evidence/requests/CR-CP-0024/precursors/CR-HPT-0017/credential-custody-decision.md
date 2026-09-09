# Decisión de custodia de la credencial M2M

Fecha: 2026-08-27

## Decisión

La credencial pertenece solamente a dos superficies:

1. `4uentes-auth`, como verificador del grant;
2. `4uentes-automation`, como caller que solicita tokens efímeros.

SST no recibe el secreto simétrico: valida únicamente el JWT RS256 mediante el
JWKS de Auth. Phinance tampoco recibe el secreto ni el token de Automation.

Para desarrollo local, el operador ingresará el mismo valor directamente en:

- el `.env` ignorado de Auth bajo
  `M2M_AUTOMATION_RECEIPT_INTAKE_CLIENT_SECRET`;
- el credential store cifrado de n8n, nunca en workflow JSON, Git, Jira,
  Evidence, argumentos de shell o prompts.

El agente puede verificar presencia mediante estados booleanos sanitizados,
pero no puede pedir, leer, imprimir ni transferir el valor. La creación se
mantiene bloqueada hasta que Auth y el receptor SST sean artefactos promovibles.

Para ambientes administrados, el mecanismo queda `TODO`: deberá elegirse un
secret manager o referencia GitOps compartida por ambos deployments. No se
autoriza usar variables de repositorio, archivos versionados ni copiar el valor
entre logs de CI.

La rotación exige coordinación: desactivar primero el workflow, actualizar
caller y verifier, validar emisión/negativos, reactivar y revocar el valor
anterior. V1 no declara una ventana dual de secretos.
