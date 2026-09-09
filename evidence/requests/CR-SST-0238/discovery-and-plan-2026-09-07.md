# Descubrimiento y plan de entrada autenticada y compatibilidad React

## Resultado

Se confirmaron cuatro gaps reproducibles en `sst-fend`, sin modificar el owner:

- el state machine envia `firstLogin` a `/onboard`, pero no existe ni existio una ruta o pantalla owner con ese destino; el wildcard muestra `Not Found`;
- la imagen principal de Landing entrega `fetchPriority` a React 18.2 y genera el warning observado;
- `SstButton` envuelve `AntButton` sin reenviar su referencia, por lo que `Popover` cae en `findDOMNode` bajo `StrictMode`;
- `RouterProvider` no activa el flag compatible `v7_startTransition` disponible en la version instalada.

La landing ya posee una seccion interna de onboarding. Eso no constituye una ruta autenticada. El flujo owner implementado y documentable es:

```text
Landing publica -> login o registro -> validacion -> defaultModule/Home
```

Agregar una pantalla `/onboard` vacia o redireccionarla superficialmente esconderia el defecto sin corregir la decision obsoleta del state machine.

## Lote futuro propuesto

El owner debera documentar primero el destino de primera entrada, reemplazar `gotoOnboard` por el contrato existente de `defaultModule`, retirar la prop no soportada, reenviar el ref de `SstButton` y habilitar el future flag del router. `StrictMode` permanece activo.

Las pruebas focales deben cubrir el branch `firstLogin`, el ref del boton y la configuracion del router. Luego corresponde ejecutar el check owner completo y QA de navegador sobre una fuente identificada en `localhost:4090`.

## Controles contra falsos positivos

- No se aceptara un redirect `/onboard` como reparacion del state machine.
- No se aceptara desactivar `StrictMode` ni filtrar el console.
- La consola debe observarse despues de abrir overlays y completar navegacion, no solamente al cargar Landing.
- Un login de cuenta existente no reemplaza el test focalizado de `firstLogin`.
- El runtime debe demostrar la branch/worktree servida antes de atribuir resultados al cambio.

## Autoridad y limites

La fuente tecnica observada y leida de vuelta fue `sst-fend@develop@bd9b8d2aa52aab2346b7bf94b0db05ed188c09a3`; el SHA remoto coincide con `origin/develop` local. Esta evidencia no autoriza mutacion owner, runtime, Jira ni publicacion Git.
