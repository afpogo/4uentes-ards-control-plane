# CR-SST-0097 - Decision De Scope Para Consumidores

## Decision

No se modifican repos consumidores en este CR.

## Justificacion

`CR-SST-0092` modifico solo `sst-bend` y el control-plane. No implemento
consumo real en:

- `sst-chatbot`
- `sst-fend`
- `4uentes-auth`
- `sst-extension`

Por la policy `owner-documentation-authority-policy`, el productor `sst-bend`
debe publicar su contrato owner. Los consumidores deben crear adopcion inbound
solo cuando exista una CR que implemente consumo real o fachada BFF/UI.

## Estado Por Repo

| Repo | Estado en CR-SST-0097 |
| --- | --- |
| `sst-bend` | Mutado como owner productor |
| `sst-chatbot` | No mutado; futuro consumidor de contexto via backend |
| `sst-fend` | No mutado; sin UI LearningWorkspace en este slice |
| `4uentes-auth` | No mutado; sin fachada BFF LearningWorkspace en este slice |
| `sst-extension` | No mutado; sin handoff explicito LearningWorkspace en este slice |
