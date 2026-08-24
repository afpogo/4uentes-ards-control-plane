# CR-SST-0219 - QA Manual De Última Revisión

Fecha: 2026-08-24.

## Regla De Cierre

El QA manual es el último gate funcional/documental antes de mover el CR a
`done`. No reemplaza `npm run check`, pruebas owner, smokes HTTP ni E2E; los
complementa con una revisión humana de intención, claridad y seguridad.

Para `CR-SST-0219` el QA será un walkthrough del contrato. En los futuros CRs
runtime, la última revisión deberá ejercitar la aplicación autenticada y las
superficies desktop/mobile que correspondan.

## Escenarios Del Walkthrough

| ID | Escenario | Resultado esperado |
| --- | --- | --- |
| `MQA-01` | Artículo de tres párrafos con prompt default | Una corrida, contexto versionado y tres derivaciones ordenadas. |
| `MQA-02` | Un párrafo no produce interpretación útil | La corrida admite cero derivaciones útiles sin inventar memoria. |
| `MQA-03` | El usuario cambia el prompt | Se crea una corrida/fork nuevo; la corrida anterior queda intacta. |
| `MQA-04` | El texto contiene prompt injection | Se trata como dato no confiable y no altera guardrails ni output schema. |
| `MQA-05` | Retry después de un fallo intermedio | Se reanuda desde checkpoint sin duplicar derivaciones ni propuestas. |
| `MQA-06` | Finalización exitosa | Se crea una propuesta `needs_review`, nunca memoria aceptada automática. |
| `MQA-07` | Usuario rechaza o corrige candidatos | Sólo las decisiones explícitas cambian el lifecycle de la propuesta. |
| `MQA-08` | Usuario/tenant distinto intenta leer la corrida | El acceso falla de forma cerrada. |
| `MQA-09` | Revisión de Jira y evidencia | No hay contenido privado, tokens, URLs privadas, account IDs ni prompts reales. |
| `MQA-10` | Revisión de ownership | Cada comportamiento runtime futuro tiene repo owner y ARDS/SDD local obligatorio. |

## Checklist De Última Revisión

- [ ] La terminología coincide entre request, state, docs y mapa.
- [ ] La cadena de contexto tiene límites y versionado explícitos.
- [ ] Evidencia e inferencias permanecen diferenciadas.
- [ ] El prompt default es abierto sin perder guardrails.
- [ ] Los prompts personalizados conservan provenance independiente.
- [ ] El chatbot no adopta memoria ni confía identidad enviada por el cliente.
- [ ] Los estados terminales, retry, cancelación y supersesión son coherentes.
- [ ] La descripción Jira refleja el alcance real y los límites.
- [ ] Los checks automatizados están en PASS.
- [ ] `4uentes` registra `PASS`, observaciones o rechazo explícito.

## Resultado

- Estado: `pending`.
- Revisor humano: `4uentes`.
- Momento: después de implementar el contrato y antes del cierre local/Jira.
- Evidencia futura: `evidence/requests/CR-SST-0219/manual-qa-last-review-result.md`.
