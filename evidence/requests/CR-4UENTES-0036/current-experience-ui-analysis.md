# CR-4UENTES-0036 - Analisis De UI Actual

## Hallazgos

La ruta `/afpogo/experience` ya tenia I18N aplicado y contenido profesional
revisado en cortes anteriores, pero la experiencia visible seguia obligando a
leer demasiado detalle sin una entrada clara para recruiters.

Problemas observados:

- La ruta empezaba directamente con el carrusel de companias sin explicar que
  la experiencia funciona como evidencia laboral.
- Las cards de compania mostraban campos utiles, pero no priorizaban rol,
  periodo y contexto como lectura rapida.
- Las iniciativas del detalle mostraban funciones y logros, pero no tenian
  senales visibles de contribucion y valor de evidencia.
- En mobile, `/afpogo/experience/company/giresa` mantenia una grilla de tres
  columnas y generaba overflow horizontal real.

## Decision

El corte mejora jerarquia y legibilidad sin reescribir la narrativa ni cambiar
la arquitectura:

- introduccion profesional en la ruta de experiencia;
- senales de evidencia laboral;
- cards de compania con rol y periodo mas visibles;
- cards de iniciativas con etiquetas de contribucion y valor de evidencia;
- ajuste responsive puntual del detalle de experiencia.
