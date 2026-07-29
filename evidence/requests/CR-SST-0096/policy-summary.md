# CR-SST-0096 - Resumen De Policy

## Resultado

Se adopta `owner-documentation-authority-policy` como policy local del
control-plane.

La policy establece que la documentacion principal pertenece al repo o canon que
posee la responsabilidad tecnica:

- repo hijo para runtime, specs tecnicas, docs tecnicas, tests y capabilities que
  produce;
- productor para capability outbound;
- consumidor para capability inbound/adopcion local;
- control-plane para request lifecycle, iniciativa, evidencia, catalogo logico,
  plan de orquestacion y Jira mirror;
- `4uentes-ards-core` para canon ARDS/SDD compartido.

## Regla Central

Una CR que modifica un repo hijo no puede quedar cerrada solo con evidencia del
control-plane. Debe actualizar la documentacion ARDS/SDD owner del repo hijo o
registrar una excepcion explicita con follow-up.

## Archivos Normativos

- `docs/policies/owner-documentation-authority-policy.md`
- `specs/integration/policies.yaml`

## Boundary

Este CR no muta repos hijos. La deuda detectada en `sst-bend` queda registrada
como gap y debe resolverse con un follow-up especifico.
