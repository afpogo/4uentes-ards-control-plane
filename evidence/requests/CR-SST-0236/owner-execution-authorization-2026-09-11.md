# Autorización de ejecución owner para la bandeja de fuentes

Owner documental: `4uentes-orchestor`. Rol primario: decisión y evidencia de
autorización de CR-SST-0236. La autoridad de la implementación y documentación
frontend seguirá perteneciendo a `sst-fend`.

GitHub confirmó que el preflight PR #312 fue fusionado en `main` como
`09c15cb61ede2c8a9c63b69caca79a27e6629c5a` el
`2026-09-11T22:00:16Z`. Inmediatamente después de recibir el resumen del próximo
gate, el usuario indicó «ok avancemos con el proximo gate». Se interpreta esa
decisión únicamente como autorización para publicar este gate y, después de su
merge/readback, ejecutar localmente el lote owner descrito en el preflight.

## Lote autorizado después del readback

En un worktree limpio de `afpogo/sst-fend`, branch
`agent/cr-sst-0236-learning-source-inbox`, se podrá:

1. Actualizar spec y documentación owner de LearningWorkspace.
2. Adoptar el inbound de Auth `learning-workspace-context@1.2.0`.
3. Tipar `sourceDescriptor` y `source.snapshot`, conservando compatibilidad de
   texto manual.
4. Implementar una bandeja para `manual_text`, `article`, `article_document` y
   `agent_output` que envíe referencias owner, no cuerpos privados.
5. Mostrar identidad, procedencia, versión/hash, frescura y errores sanitizados
   antes de decidir.
6. Mantener separadas preparación/publicación de artículo, ArticleTag,
   Learning contentTags y cualquier propuesta futura de memoria.
7. Agregar tests focalizados, estilos, playbook UX, mapa Mermaid con fallback y
   runbook de QA; ejecutar el check completo del owner y del control plane.

Se permite commitear ese resultado localmente. La publicación de la branch y
la apertura de un PR Fend no están incluidas: requerirán un checkpoint posterior
con diff, checks y alcance exactos.

## Límites obligatorios

- No introducir valores secretos ni credenciales en browser, DTOs, logs,
  fixtures, documentos o evidencia. V1 no soporta adquisición con secretos.
- No llamar directamente a `sst-bend` ni decidir autorización en la UI.
- No enviar `sourceText` para `article`, `article_document` o `agent_output`.
- No desplegar, ejecutar migraciones/seeders, escribir DB o Jira ni invocar
  preview/accept/reject contra el runtime compartido.
- No crear automáticamente ArticleTag, TagDefinition, UserMemory o publicación
  de artículo.
- No adoptar `knowledge-to-execution-documentation-policy` ni cerrar la
  excepción `http-qa-harness-policy` dentro de este lote.

## Gate y compensación

No se editará Fend hasta que este artefacto esté fusionado y su merge sea leído
de vuelta. Detener ante drift del contrato `1.2.0`, baseline owner cambiado,
checkout no limpio, necesidad de secretos o imposibilidad de conservar los
flujos embebidos existentes. Antes de publicar el owner, la compensación es
preservar o descartar el worktree bajo decisión gobernada; después de publicar,
un revert requerirá su propio gate.
