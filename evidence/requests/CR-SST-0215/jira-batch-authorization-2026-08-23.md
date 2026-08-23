# Lote Jira Autorizado De CR-SST-0215

Fecha: 2026-08-23.

## Autoridad Y Ventana

El usuario autorizó Jira con el texto `ok autorizo jira, y avancemos con el
proximo frente`. La autorización se materializa como una única ejecución
manual durante esta sesión y se consume al completar las operaciones
enumeradas. Jira es mirror; el control-plane es fuente de verdad.

## Preflight

- Proyecto: `HPT`.
- Initiative: `INIT-HPT-0002`; Epic primaria observada: `HPT-5`.
- Request canónico reflejado: `CR-SST-0214`, estado local `done`.
- Issue primario existente: `HPT-6`, tipo `Tarea`, parent `HPT-5`, estado
  `Listo`.
- Identidad obsoleta observada: `CR-SST-0208` en summary, descripción y label.
- La búsqueda JQL no encontró otro issue compatible con `CR-SST-0214`.

## Operaciones Exactas

1. Editar el summary de `HPT-6` a
   `[CR-SST-0214] Adopt the Phinance service invocation grant under its canonical identity`.
2. Reemplazar la descripción de `HPT-6` por un resumen sanitizado de la
   adopción owner validada, incluyendo la identidad canónica, contrato exacto,
   checks y límites de activación.
3. Reemplazar labels de `HPT-6` por `ards-sdd`, `auth`,
   `control-plane-mirror`, `cr-sst-0214`, `phinance`, `validated-owner`.
4. Releer `HPT-5` y `HPT-6`; verificar project, tipo, parent, status, summary y
   labels.

Estado esperado de `HPT-6` antes y después: `Listo`.

No se autorizan creación, borrado, transición, comentario, link, reparenting ni
ninguna edición sobre otro issue.

