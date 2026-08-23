# CR-SST-0212 — resumen de cambios owner recuperados

El commit local `efa955b` agrega `swagger-ui-express`, monta `/phinance` bajo
el base path SST, proyecta el OpenAPI owner con `servers` seguros y publica un
shell protegido que falla cerrado sin proxy. También contiene specs, docs,
capability owner, test y harness HTTP.

El contrato relacionado `PrincipalContext v1` existe en el commit local
Phinance `ef4f8d0` y se gobierna mediante `CR-HPT-0013`.

Los cambios preexistentes de dictionary secrets en `sst-bend` y el documento
de lluvia de ideas en Phinance permanecen fuera de estos commits. Esta
reconciliación no modificó repositorios owner.
