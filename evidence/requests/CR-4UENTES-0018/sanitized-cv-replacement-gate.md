# CR-4UENTES-0018 - Sanitized CV Replacement Gate

## Resultado

El corte no reactiva la descarga publica del CV.

`CR-4UENTES-0017` verifico que el PDF actual contiene telefono directo,
direccion granular y codigo postal. En este corte no existe un PDF nuevo
entregado o aprobado por el owner, por lo que publicar una version generada por
el agente seria una decision editorial no autorizada.

## Contrato De Sanitizacion

Para restaurar la descarga publica, el asset debe cumplir:

- No contener telefono directo.
- No contener direccion exacta, codigo postal o ubicacion granular.
- No contener metadatos locales innecesarios del editor, autor, rutas o maquina.
- No contener texto oculto, anotaciones o capas con datos sensibles.
- Mantener solo datos de contacto aprobados: email publico, LinkedIn, GitHub y
  ubicacion general.
- Reusar claims ya aprobados en el portfolio o aprobados explicitamente por el
  owner.

## Decision

La descarga queda bloqueada hasta que exista un PDF sanitizado y aprobado. El
repositorio hijo queda documentado con el gate para que el proximo corte pueda
reemplazar `src/assets/resources/afpogo_cv.pdf` y reactivar el boton sin cambiar
la politica de contacto.

## Seguimiento

El proximo corte debe recibir o producir bajo aprobacion del owner un PDF
publicable, verificar texto visible y metadatos, reemplazar el asset fuente y
restaurar el handler del boton de CV.
