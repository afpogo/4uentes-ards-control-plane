# Preparacion de publicacion GitHub

Fecha: 2026-07-10

## Politicas aplicadas

- `agent-delegation-policy`: se delegaron dos revisiones acotadas y de solo
  lectura para separar control-plane y repo hijo Portfolio. La decision final
  queda en el agente principal.
- `agent-architecture-boundary-policy`: no se redefinio arquitectura ni
  ownership cross-repo durante la preparacion de publicacion.
- `owner-documentation-authority-policy`: la publicacion debe conservar la
  separacion entre evidencia del control-plane y documentacion owner del repo
  hijo.
- Politica GitHub de publicacion del agente: no usar `git add -A` con worktree
  mixto; crear rama, commitear scope explicito, pushear con tracking y abrir PR
  draft.

## Resultado del analisis delegado

### Control-plane

El control-plane esta en `main` con staging previo masivo y cambios no
relacionados. No es seguro ejecutar un commit general desde el indice actual.

El subagente recomendo un PR de sincronizacion de profesionalizacion de
Portfolio si CR-0033, CR-0034 y CR-0035 todavia no estan publicados, porque
CR-0036 referencia la iniciativa `INIT-PORTFOLIO-0003` y depende de ese
contexto.

Scope recomendado:

- `evidence/requests/CR-4UENTES-0033/`
- `evidence/requests/CR-4UENTES-0034/`
- `evidence/requests/CR-4UENTES-0035/`
- `evidence/requests/CR-4UENTES-0036/`
- `requests/done/CR-4UENTES-0033-portfolio-professionalization-intake-reconciliation.yaml`
- `requests/done/CR-4UENTES-0034-portfolio-home-hero-positioning-cta-clarity.yaml`
- `requests/done/CR-4UENTES-0035-portfolio-projects-evidence-system.yaml`
- `requests/done/CR-4UENTES-0036-portfolio-experience-readable-impact.yaml`
- `initiatives/INIT-PORTFOLIO-0003-portfolio-professionalization.yaml`
- indices de `initiatives/`, `state/` y capability links solo con hunks
  relacionados a Portfolio.

Rama sugerida: `agent/portfolio-professionalization-sync`

Commit sugerido: `chore(control-plane): sync portfolio professionalization lifecycle`

### Portfolio

El repo hijo Portfolio esta en `develop` con un working tree amplio. No es
seguro publicar todo en un unico PR.

El subagente recomendo un PR pequeno para CR-0036 centrado en Experience, con
dependencia Sass minima si el build la requiere.

Scope recomendado:

- `src/pages/Dashboard/screens/Experience/Experience.i18n.ts`
- `src/pages/Dashboard/screens/Experience/constants.ts`
- `src/pages/Dashboard/screens/Experience/index.tsx`
- `src/pages/Dashboard/screens/Experience/styles.module.scss`
- `src/pages/Dashboard/screens/Experience/components/BackCardExperience/index.tsx`
- `src/pages/Dashboard/screens/Experience/components/BackCardExperience/styles.module.scss`
- `src/pages/Dashboard/screens/Experience/components/ExpBox/index.tsx`
- `src/pages/Dashboard/screens/Experience/components/ExpBox/styles.module.scss`
- `src/pages/Dashboard/screens/Experience/components/ExperienceCard/styles.module.scss`
- `src/pages/Dashboard/screens/Experience/components/FrontCardExperience/index.tsx`
- `src/pages/Dashboard/screens/Experience/components/FrontCardExperience/styles.module.scss`
- `src/pages/Dashboard/screens/Experience/screens/ExperienceCompany/constants.tsx`
- `src/pages/Dashboard/screens/Experience/screens/ExperienceCompany/index.tsx`
- `src/pages/Dashboard/screens/Experience/screens/ExperienceCompany/styles.module.scss`
- `src/assets/sass/abstracts/_index.scss` si se confirma como dependencia de
  compilacion para los imports Sass.

Rama sugerida: `agent/cr-4uentes-0036-experience-readable-impact`

Commit sugerido: `feat(portfolio): improve experience readable impact`

## Ejecucion y bloqueo

Se verifico disponibilidad de GitHub CLI:

- `gh --version`: disponible.
- `gh auth status`: token local invalido para `afpogo`; requiere
  reautenticacion.

Se intento verificar acceso Git por SSH al remoto del control-plane:

- `git ls-remote --heads origin main`: bloqueado por acceso a `github.com:22`.
- Reintento con escalacion: timeout.

Por seguridad, no se creo commit ni push desde esta sesion. El indice actual del
control-plane contiene cambios staged previos no relacionados y publicar con ese
estado violaria la politica GitHub de scope explicito.

## Recomendacion

1. Reautenticar GitHub localmente con `gh auth login -h github.com` o habilitar
   el acceso SSH/HTTPS correspondiente.
2. Crear dos PR draft separados:
   - Control-plane: sincronizacion ARDS/SDD de la iniciativa de
     profesionalizacion Portfolio.
   - Portfolio: cambio runtime acotado de Experience para CR-0036.
3. Antes de cada push, verificar `git diff --cached --name-status` y ejecutar
   las validaciones:
   - Control-plane: `npm.cmd run check`.
   - Portfolio: `npm.cmd run build` y QA visual ya definido para Experience.

## Ejecucion posterior

Se intento ejecutar la recomendacion con ramas/worktrees limpios para evitar el
indice sucio local.

### Control-plane

Se creo un worktree limpio desde `origin/main` en una rama local
`portfolio-professionalization-sync-20260710`. Al copiar solo el scope
Portfolio/4UENTES recomendado, el gate del branch limpio fallo porque
`origin/main` no contiene varias piezas de estado que el control-plane local
actual ya usa para validar. Al agregar dependencias minimas, el scope empezo a
crecer hacia estado Dictionary/SST/infra y evidencias no relacionadas.

Decision: no commitear ese branch como publicacion Portfolio, porque dejaria de
ser un PR de Portfolio y pasaria a ser una reconciliacion general de
control-plane. Esa reconciliacion necesita un CR/PR propio.

### Portfolio

Se creo un worktree limpio desde `origin/develop` en una rama local
`cr-4uentes-0036-experience-readable-impact-20260710`. Se copio el scope
Experience recomendado y la dependencia Sass minima.

Resultados:

- `npm.cmd install`: paso con escalacion; reporto vulnerabilidades existentes
  del arbol de dependencias, sin aplicar `npm audit fix` por estar fuera de
  scope.
- `npm.cmd run build`: fallo primero por dependencia Sass faltante
  (`$color-fp-flat-flesh`).
- Al agregar Sass `lib` minimo, el build fallo por incompatibilidad global entre
  `@use` y el pipeline Webpack base (`This module and the new module both define
  a variable named "$color-fuip-clouds"`).

Decision: no commitear el PR pequeno de Experience contra `origin/develop`,
porque CR-0036 depende de la base local acumulada de Sass/Vite. Publicarlo
aislado romperia el build del repo hijo.

## Recomendacion ajustada

El siguiente paso seguro no es publicar CR-0036 aislado. Primero debe abrirse un
CR de reconciliacion/publicacion base para Portfolio que estabilice la base
runtime actual contra `origin/develop`:

- migracion Vite/Sass y estructura de build;
- docs/specs owner del repo hijo;
- validacion `npm.cmd run build`;
- QA visual de rutas principales.

Despues de esa base, CR-0036 puede publicarse como PR pequeno de Experience o
quedar incluido en un PR acumulado explicitamente nombrado como
`Portfolio publication readiness`, no como cambio aislado.
