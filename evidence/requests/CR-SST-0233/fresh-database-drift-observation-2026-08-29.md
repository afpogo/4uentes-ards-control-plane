# Observación histórica del drift de migraciones en base nueva

## Rol, procedencia y autoridad

- Rol primario: evidencia histórica de diagnóstico.
- Observado originalmente: `2026-08-29`.
- Procedencia: recuperada selectivamente del worktree legacy
  `CR-SST-0233-migration-reconciliation`.
- Owner técnico: `sst-bend` para migraciones, modelos y validación local.
- Owner del lifecycle: `4uentes-ards-control-plane`.
- Efecto de autorización: ninguno.

Esta evidencia conserva el hallazgo que originó `CR-SST-0233`. No reemplaza
los checks owner posteriores ni describe el estado runtime actual; la
corrección y sus validaciones quedaron integradas después mediante el PR owner
#32.

## Resultado observado

El gate de base nueva quedó `BLOCKED` para promoción, aunque las migraciones de
receipt binding que motivaron el chequeo sí se aplicaron correctamente. El
bloqueo apareció después, al recorrer la cadena completa de `sst-bend`.

| Dato | Observación sanitizada |
| --- | --- |
| Owner observado | `sst-bend` |
| Ref exacta | `2a0de56bdfadbbfdd6f586e97b5300f5fc7e9bdf` |
| Base de datos | PostgreSQL 16 efímero, sin volumen y con datos sintéticos |
| Migración que falló | `20260829010000-adopt-article-agent-processing-v1` |
| Primera operación fallida | agregar `document_agent_jobs.tenant_id` |
| Error | columna duplicada |
| Entorno compartido | no utilizado |
| Datos privados o productivos | no utilizados |

La infraestructura efímera fue detenida después del chequeo. No quedó listener
ni contenedor del gate.

## Causa confirmada por lectura owner

La migración histórica
`db/migrations/20260524120000-create-document-agent-jobs.js` importaba
`DocumentAgentJobSchema` desde el modelo runtime actual. El commit owner
`d10a0442003540d4cc3ac37bbfb9754ef58e3b0c`, perteneciente a
`CR-SST-0223`, había agregado al modelo actual `tenant_id`, `user_id`,
`application_id`, `processing_mode`, snapshots, cadena de contexto y
fingerprint.

En una base vacía ocurría esta secuencia:

1. la migración histórica creaba `document_agent_jobs` usando el modelo actual
   y adelantaba columnas futuras;
2. la migración de adopción de Article Agent intentaba agregar las columnas que
   contractualmente le pertenecían;
3. PostgreSQL rechazaba la primera duplicación y la cadena no podía completar.

Una base histórica donde la primera migración ya estaba aplicada no reejecutaba
ese archivo. El riesgo era la divergencia entre instalación limpia y upgrade,
por lo que ambos caminos debían probarse explícitamente en el lifecycle
correctivo.

## Disposición posterior

El owner congeló el schema histórico y probó instalación limpia, upgrade con
datos sintéticos, down/up y paridad final. Esta observación queda preservada
como causa y antecedente; no contradice el readback posterior exitoso ni
autoriza repetir el ensayo sobre ambientes compartidos.
