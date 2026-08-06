# Auditoría visual con Chrome DevTools

Fecha: 2026-08-04

Runtime observado: `sst-fend` local en `127.0.0.1:4090`. Se usó un contexto aislado, sin credenciales ni sesión privada.

## Signin

- `1440x900`: el popover mide aproximadamente `420x704`, acumula encabezado, copy, pills, formulario y switch; el fondo translúcido deja competir el contenido de la landing.
- `390x844`: el popover ocupa `x=12`, `y=126`, `w=366.4`, `h=700.4`, con borde inferior en `826.4`; queda apenas dentro, sin reserva segura.
- `360x800`: el borde inferior del popover queda en `826.4`, 26.4 px fuera del viewport; el CTA final llega a `807.6`. `overflow-y` permanece `visible` y no existe scroll interno intencional.
- Al abrir, el foco queda en el trigger. El primer `Tab` salta al CTA de la landing que está detrás del popover.
- `Escape` no cierra el popover ni restaura el foco.
- Lighthouse snapshot móvil: accesibilidad 96; falla contraste. El CTA Sign in del header presenta 2.98:1 y el CTA primario del popover 4.39:1 frente a 4.5:1 esperado.

## Signup

- `390x700` y `390x844`: los cinco inputs reportan la misma coordenada (`x=39.3`, `y=369.2`) y los cinco labels el mismo rectángulo (`x=33.5`, `y=290`, `w=343.4`, `h=116`). El resultado visible es superposición total.
- Causa reproducida: las clases `grid-area` se aplican fuera del breakpoint, pero `grid-template-areas` sólo aparece desde tablet. En el grid mobile todas las áreas nombradas terminan en la misma posición implícita.
- `768x1024`: el shell activa al mismo tiempo un aside de 280 px y dos columnas; los placeholders de password quedan comprimidos.
- `1440x900`: el formulario ya no se superpone, pero conserva el logo SVG legacy, una gran zona vacía y lenguaje visual/copy no alineado con el branding vigente.

## Gate de corrección

La validación posterior debe cubrir `320x568`, `360x800`, `390x844`, `412x915`, `768x1024`, `1366x768` y `1440x900`, ES/EN, teclado y 200% zoom. Las assertions mínimas son: ningún rectángulo de campo se superpone, `scrollWidth <= clientWidth`, signin dentro del viewport o con un único scroll vertical interno, CTA alcanzable, foco contenido y retorno al trigger.

Las capturas fueron renderizadas e inspeccionadas en la sesión de Chrome
DevTools. No se incorporaron binarios al repositorio; la evidencia persistida
conserva únicamente geometría, comportamiento y resultados sanitizados.
