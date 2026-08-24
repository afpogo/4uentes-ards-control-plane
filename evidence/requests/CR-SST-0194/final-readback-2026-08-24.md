# CR-SST-0194 - Readback Final Y Cierre

Fecha: 2026-08-24.

## Resultado

El readback final confirma que los tres PRs del gate integrado fueron
fusionados y que sus heads validados son ancestros de las ramas canÃ³nicas.

| Owner | PR | Head validado | Merge canÃ³nico | Rama |
| --- | --- | --- | --- | --- |
| `sst-bend` | `#27` | `be7ba20b959ac31a45c162869438d4bfca230110` | `fc5573a7f05433814c1407a7f7f81c7474c54c57` | `develop` |
| `sst-chatbot` | `#11` | `6b8826a56671cefd22e96f75f7c61073f42de5e1` | `99ecc162b101e36ee7d91dbff485d4008c5e8bb7` | `main` |
| control plane | `#109` | `b73ba9af8c83d8ab26661ed8ceba4e44bcb71577` | `59b6c20c39294d488737436ad3779ad2cd1e7715` | `main` |

La publicaciÃ³n inicial de Auth permanece en el merge `b9c38fc`; no necesitÃ³ un
follow-up despuÃ©s del smoke.

## Readback De Contrato

La rama canÃ³nica de Bend contiene:

- tenant del `PrincipalContext` derivado de la membresÃ­a/account;
- lookup del usuario durable sobre `conso_users`;
- envelope de proposal con `idempotencyKey` sÃ³lo en el nivel externo;
- smoke y cleanup reproducibles.

La rama canÃ³nica del chatbot contiene:

- runtime determinÃ­stico del smoke con adaptadores reales de Auth y Bend;
- estado owner actualizado con el smoke firmado integrado;
- digest de movimiento de capability reconciliado.

## Evidencia De Cierre

- QA integrada firmada: PASS.
- Recall auditado y propuesta `needs_user_review`: PASS.
- Grants exactos, aislamiento cross-scope y logout/revocaciÃ³n: PASS.
- Limpieza idempotente de fixtures y runtime temporal: PASS.
- CI de `sst-bend` PR `#27`: tres checks PASS.
- CI de `sst-chatbot` PR `#11`: PASS.
- `npm run check` del control plane: PASS.

## DecisiÃ³n

`CR-SST-0194` pasa de `running` a `done`. El objetivo aprobado estÃ¡ completo:
el chatbot puede recuperar memoria canÃ³nica gobernada, auditar las citas y
entregar el desarrollo final como propuesta pendiente de revisiÃ³n, sin aceptar
memoria por sÃ­ mismo ni confiar scope enviado por el cliente.

Este cierre no autoriza producciÃ³n, despliegue persistente, Jira, cambios de
infraestructura, proveedor externo real ni vector store.
