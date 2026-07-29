# CR-4UENTES-0021 - Estructura I18N Para Experiencia

## Diagnostico

La experiencia tiene dos tipos de datos mezclados:

- Metadatos estables: `slug`, `company`, fechas, imagenes, tecnologias,
  categorias y rutas.
- Copy localizable: ubicacion visible, rol mostrado, resumen, funciones,
  logros, labels y textos de accion.

Hoy parte del copy vive en:

- `src/pages/Dashboard/screens/Experience/constants.ts`
- `src/pages/Dashboard/screens/Experience/screens/ExperienceCompany/constants.tsx`

Eso dificulta internacionalizar la narrativa sin duplicar estructura o arriesgar
inconsistencias entre ES/EN.

## Estructura Recomendada

Mantener constantes estructurales con ids estables:

```ts
export const experienceObject = [
  {
    slug: 'giresa',
    company: 'Gire S.A.',
    initDay: format(new Date(2016, 5, 6), 'dd-MM-yyyy'),
    endDay: format(new Date(2023, 1, 28), 'dd-MM-yyyy'),
    imgpath: '/assets/images/giresa.jpg',
    initiativeIds: ['rapipago-logistics', 'gire-web-systems', 'osb-services'],
  },
];
```

Mover copy visible a `Experience.i18n.ts`:

```ts
experienceItems: {
  giresa: {
    location: 'Buenos Aires, Argentina',
    role: 'Fullstack Software Engineer Ssr/Sr',
  },
},
initiatives: {
  'rapipago-logistics': {
    title: 'Entregas Rapipago - logistica',
    summary: 'Delivery fullstack para MVP logistico...',
    achievements: ['...'],
  },
}
```

## Regla De Implementacion

Los componentes deben resolver copy por `slug` o `initiativeId`:

- `ExpBox` recibe metadata estructural y usa `t(...)` para `role` y `location`.
- `ExperienceCompany` resuelve iniciativas por ids y renderiza copy desde i18n.
- Las tecnologias pueden permanecer como datos estables si los nombres son
  marcas o stacks no traducibles.

## Cortes Recomendados

Estos cortes quedan asociados a `INIT-FUENTES-0001` y al producto `Portfolio`
dentro del proyecto 4UENTES:

1. `CR-4UENTES-0022`: migrar cards de empresas a I18N.
2. `CR-4UENTES-0023`: migrar iniciativas/logros a I18N.
3. `CR-4UENTES-0024`: QA bilingue ES/EN con Chrome DevTools y snapshots.
4. `CR-4UENTES-0025`: usar narrativa bilingue como fuente del CV sanitizado.

## Criterio De Cierre Para La Mutacion Hija

- ES y EN renderizan sin fallback visible roto.
- No quedan textos narrativos de experiencia hardcodeados fuera de i18n.
- El build pasa.
- Chrome DevTools smoke cubre `/afpogo/experience` y al menos un detalle de
  empresa en ambos idiomas.
