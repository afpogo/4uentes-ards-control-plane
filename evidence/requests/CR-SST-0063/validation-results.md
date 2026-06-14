# Validation Results

## Estado

- Fecha: 2026-06-11
- Request: CR-SST-0063
- Resultado: pass-with-existing-warnings

## Checks

- `npm.cmd run check`: pass

## Warnings Observados

- `4uentes-auth`, `sst-fend`, `sst-bend`, `sst-extension`, `sst-chatbot` y
  `sst-4uentes-infra`: remote could not be observed.
- `login-504-proxy-timeout.current.yaml`: sin `request_ids` y sin
  `evidence_refs` para estado no terminal.
- `sst-bend-emfile-watchers.current.yaml`: sin `request_ids` y sin
  `evidence_refs` para estado no terminal.
