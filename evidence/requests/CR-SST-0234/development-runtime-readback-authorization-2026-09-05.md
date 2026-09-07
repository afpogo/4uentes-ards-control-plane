# Autorización del readback de runtime de desarrollo

## Decisión humana

El usuario indicó:

> ok verifiquemos y avancemos con el proximo gate, acutalicemos branches

## Interpretación acotada

La decisión autoriza:

- refrescar refs remotas canónicas de control plane, `sst-bend` e Infra;
- verificar read-only Argo CD, workloads, rollout, imagen activa y schema;
- ejecutar probes HTTP públicos y negativos sin credenciales;
- registrar y publicar evidencia sanitizada en el control plane.

No autoriza revelar o buscar secretos, leer contenido de usuarios, crear
fixtures, ejecutar escrituras manuales en base/cluster ni realizar el lote Jira
pendiente. La prueba positiva autenticada requiere credenciales y fixtures
expresamente provistos o autorizados.
