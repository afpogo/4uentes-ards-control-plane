# CR-SST-0121 - inicio de ejecución y decisión de permiso visual

Fecha: 2026-07-23  
Estado: implementación iniciada

## Origen

El QA manual de `CR-SST-0103 / SST-35` confirmó que la captura visual de una
sesión con varias pestañas no puede apoyarse únicamente en `activeTab` ni en
permisos de host solicitados por origen. Chrome devolvió el resultado
sanitizado:

```text
Either the '<all_urls>' or 'activeTab' permission is required.
```

`activeTab` cubre la pestaña donde la persona invoca la extensión, pero no las
demás pestañas activadas programáticamente durante una captura de ventana.

## Decisión autorizada

La persona responsable autorizó continuar el 2026-07-23 con este contrato:

- declarar `<all_urls>` como permiso opcional, no permanente;
- solicitarlo solamente cuando una acción explícita inicia una captura visual;
- explicar visiblemente por qué se solicita;
- retirarlo al finalizar, tanto en éxito como en error;
- limpiar un permiso temporal remanente cuando el background MV3 vuelva a
  iniciar;
- no solicitarlo para el modo exclusivamente textual;
- mantener separado el consentimiento para enviar previews privadas: permitir
  la captura visual local no autoriza el envío del thumbnail;
- si la persona rechaza el permiso, conservar la sesión y devolver un resultado
  explícito en vez de perder la captura completa.

## Alcance de implementación

El único repo funcional autorizado en este CR es `sst-extension`. La
documentación owner, las pruebas de permiso concedido/denegado, la limpieza y
el check completo del repo forman parte de la misma entrega.

La reconciliación de backend, BFF y frontend se realizará como preparación de
QA usando sus CRs ya aprobados; no amplía el ownership de `CR-SST-0121`.

## Jira

`CR-SST-0121` no tiene una clave Jira confirmada. No se infiere ni se escribe
una clave durante este inicio de ejecución.
