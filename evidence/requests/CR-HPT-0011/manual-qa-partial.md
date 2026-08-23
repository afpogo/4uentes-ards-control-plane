# QA manual parcial con Chrome DevTools

## Alcance

`CR-HPT-0011` es documental y no contiene runtime Phinance. El QA manual se
limitó a comprobar el ARDS propietario observable en Chrome DevTools, su
coherencia con el contrato owner y la inexistencia honesta de endpoints para
probar antes de `CR-HPT-0012`.

## Observación inicial

Chrome cargó `ARDS_Phinance_API.md` y permitió confirmar visualmente:

- identidad estable `finanzas-personales-backend`;
- nombre `Phinance-API`;
- tipo `backend-api`;
- baseline Python/FastAPI;
- monolito modular sin split Node/Python;
- separación de ownership entre SST y Phinance.

## Hallazgo y corrección

El modelo conceptual todavía declaraba `sst_subject` como identificador único,
en contradicción con el contrato aceptado `account_id + stable_subject`. Se
corrigió el ARDS raíz para declarar ambos campos y la restricción única
compuesta.

## Resultados de navegador y red

La apertura directa mediante `file://` generó una advertencia de origen único
del navegador, pero mostró correctamente el contenido UTF-8. No se atribuyó esa
advertencia al documento.

La repetición mediante un servidor HTTP local efímero confirmó respuesta `200`
para `ARDS_Phinance_API.md`. Chrome solicitó además `/favicon.ico`, que devolvió
`404`; el documento no es una aplicación web y no requiere favicon. El servidor
simple no declaró charset para Markdown y Chrome mostró mojibake bajo esa ruta;
la apertura directa y la lectura de repositorio confirmaron que el archivo sí
está codificado correctamente. Este comportamiento del servidor temporal no se
promueve como defecto del ARDS ni como evidencia de runtime.

## Límite del QA

No se simularon respuestas ni se afirmó que la API funciona. Health,
readiness, OpenAPI y contratos HTTP se probarán cuando `CR-HPT-0012` cree el
scaffold ejecutable.
