# CR-SST-0020 - Plan De Analisis

Observado el: 2026-05-29

## Clasificacion

- `complex-high-risk-task`

Motivos:

- expone la aplicacion a internet
- cruza frontend, backend, auth e infra
- toca `Ingress`, DNS/dominio, `ngrok`, TLS y cookies
- puede cambiar politica de branch, imagenes y GitOps

## Plan De Deployment De Subagentes

La request planificada requiere subagentes para la fase de analisis.

Roles esperados:

- `architecture-reviewer`
- `security-contract-reviewer`
- `cross-repo-impact-reviewer`
- `validation-reviewer`

Si no se pueden desplegar subagentes durante la fase de analisis, el fallback
es registrar la limitacion y ejecutar cada track de revision de forma
secuencial con el perfil de razonamiento mas alto disponible.

## Tracks De Analisis

### Estado Actual Del Cluster

Recolectar:

- contexto Kubernetes activo
- namespaces
- pods y readiness
- services y puertos
- hosts y paths de `Ingress`
- imagenes y tags desplegados
- estado de la aplicacion Argo CD si esta disponible

### Ingress Y Ngrok Edge

Recolectar:

- comportamiento actual del entrypoint local `http://localhost:8088/`
- split actual de paths de `Ingress` para UI, `/api`, JWKS y hosts de debug de
  backend
- opciones entre `ngrok tunnel` y `ngrok edge` durable
- implicancias de TLS y ruteo por hostname

### Exposicion Publica De Auth

Revisar:

- CORS
- cookies
- CSRF
- comportamiento `SameSite`/`Secure`
- superficie publica de API/JWKS
- `base URL` del frontend y comportamiento de refresh/logout de auth bajo el
  hostname publico

### Politica De Branch E Imagenes

Revisar:

- referencias actuales a `develop`/`dev`
- si `main` deberia convertirse en la fuente de build
- si un release branch, tag inmutable o digest es mas seguro que `main` mutable
- responsabilidad de CI/build para cada repo de app
- camino de consumo GitOps en infra

### Validacion Y Release Gates

Definir:

- smoke checks de `Ingress` local
- smoke checks publicos por `ngrok`
- checks de login/refresh/logout de auth
- checks de rutas frontend
- camino de rollback
- evidencia requerida antes de marcar la publicacion como lista

## Guardrail

Este plan de analisis no autoriza cambios en repos hijos. Prepara el siguiente
paso de ejecucion.
