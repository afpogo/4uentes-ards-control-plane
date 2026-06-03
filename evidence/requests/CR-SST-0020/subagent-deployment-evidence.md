# CR-SST-0020 - Evidencia De Subagentes

Observado el: 2026-05-31

## Clasificacion

- `task_weight`: `complex-high-risk-task`
- `model_selection.primary_profile`: `gpt-5.5`
- Policy: `docs/ai/model-selection-policy.md`

Motivos:

- exposicion publica desde cluster local;
- autenticacion, cookies, CSRF, JWKS y `Authorization: Bearer`;
- Ingress, `ngrok`, TLS, DNS/hostnames;
- GitOps, branch policy e image promotion;
- riesgo cross-repo sobre `sst-fend`, `sst-bend`, `4uentes-auth` y
  `sst-4uentes-infra`.

## Deployment

El runtime permitio desplegar subagentes. Se ejecutaron cuatro tracks:

| Rol | Resultado |
|---|---|
| `architecture-reviewer` | Completo |
| `security-contract-reviewer` | Completo |
| `cross-repo-impact-reviewer` | Completo |
| `validation-reviewer` | Completo |

Los subagentes trabajaron en modo analisis y no editaron archivos ni repos
hijos.

## Sintesis Por Rol

`architecture-reviewer`:

- confirmo `Ingress` `sst-ingress`, hosts locales y ausencia de TLS en Ingress;
- recomendo dominio reservado de `ngrok`;
- marco rewrite a `localhost` como smoke temporal;
- recomendo agregar el host publico al Ingress para estado durable.

`security-contract-reviewer`:

- identifico que cookies `Secure` dependen de `NODE_ENV=production`;
- marco que el overlay actual usa `NODE_ENV=development`;
- recomendo un solo origin publico para evitar CORS cross-origin;
- confirmo que OAuth de `ngrok` no deberia interferir con
  `Authorization: Bearer`;
- recomendo no usar Basic Auth de edge.

`cross-repo-impact-reviewer`:

- confirmo `targetRevision: develop` en Argo CD versionado;
- confirmo tags `ghcr.io/afpogo/*:develop`;
- recomendo no usar `main` como tag runtime mutable;
- recomendo promocion por tag/digest inmutable.

`validation-reviewer`:

- confirmo que el orquestador tiene `npm run check` con `0 FAIL`;
- definio matriz local/publica de smoke;
- marco la necesidad de rollback exacto;
- recomendo decision humana antes de ejecucion.

## Fallback

No se uso fallback secuencial como reemplazo principal porque el runtime si
permitio subagentes. Si en una fase posterior el runtime no permite
subagentes, debe registrarse la limitacion y ejecutar los cuatro tracks con el
perfil de mayor razonamiento disponible.
