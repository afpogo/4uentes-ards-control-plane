# QA De CV Y Publicacion - CR-4UENTES-0017

## Hallazgo

El archivo `src/assets/resources/afpogo_cv.pdf` existe y Vite lo copia a
`dist/pdfs/afpogo_cv.pdf`.

Se extrajo texto con `pdftotext` a un archivo temporal local y se detecto que el
CV actual contiene:

- direccion granular;
- codigo postal;
- telefono directo;
- email.

Esto contradice la politica de exposicion de contacto aplicada en
`CR-4UENTES-0015`, que permite email, perfiles profesionales y ubicacion general,
pero no telefono, codigo postal ni direccion granular en superficie publica.

## Decision

El CV actual no queda aprobado para descarga publica. La accion segura en este
CR es deshabilitar el boton de descarga visible y documentar el blocker hasta
que exista un CV sanitizado aprobado por el owner.

## Guardrails

- No se genera ni reemplaza el CV en este CR.
- No se elimina el asset historico del repositorio.
- No se agrega backend, formulario, analytics ni runtime nuevo.
- La publicacion amplia queda pendiente de CV sanitizado y QA visual.
