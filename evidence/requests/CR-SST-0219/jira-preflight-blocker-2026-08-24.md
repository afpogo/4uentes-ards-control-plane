# CR-SST-0219 - Preflight Jira Bloqueado

Fecha: 2026-08-24.

## Resultado

El preflight JQL para `CR-SST-0218` falló porque Atlassian no pudo renovar la
sesión OAuth: el refresh token fue reportado como inválido. Antes del fallo, el
preflight Git detectó que `CR-SST-0218` ya estaba reservado por el lifecycle de
retención terminal, por lo que ese ID fue descartado.

La búsqueda Git local, remota y canónica no encontró una reserva para
`CR-SST-0219`. El ID queda reservado por este lifecycle del control plane, pero
no se crea ni modifica ningún issue Jira hasta completar la búsqueda live.

## Gate Para Desbloquear

1. Reconectar la cuenta Atlassian/Jira del entorno.
2. Buscar `CR-SST-0219` por summary y description mediante JQL.
3. Verificar la Epic primaria `SST-105`, tipos disponibles y campos requeridos.
4. Preparar un lote exacto para crear una sola Task bajo `SST-105`, usando
   `jira-description-draft.md`.
5. Solicitar autorización humana explícita para ese lote enumerado.
6. Ejecutar y leer nuevamente key, summary, description, type, parent y status.

## Restricciones

- No hay autorización de escritura Jira vigente.
- No se permiten ediciones de otros issues ni transiciones wildcard.
- La descripción debe permanecer sanitizada y no incluir contenido privado,
  credenciales, URLs privadas, cloud IDs, account IDs ni correos.
