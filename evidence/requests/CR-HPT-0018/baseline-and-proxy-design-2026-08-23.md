# Baseline Y Diseño Del Proxy Integrado De CR-HPT-0018

Fecha: 2026-08-23.

## Hechos Observados

- `sst-bend origin/develop@8e2eeb3` contiene el shell, el productor de
  `TrustedSstPrincipal` y el consumidor M2M, pero todas las rutas financieras
  de negocio terminan en `503 PHINANCE_FACADE_UNAVAILABLE`.
- `4uentes-auth origin/develop@0be811f` publica el tuple exacto
  `sst-bend -> phinance-api / finance:invoke` con TTL máximo de 300 segundos.
- Phinance `main@c81e114` verifica RS256/JWKS y acepta contexto SST sólo después
  de autenticar ese caller.
- Los roots locales de los tres repos contienen trabajo ajeno o baselines
  históricos. No se usarán para mutación.

## Decisión De Seguridad

El único repo mutable es `sst-bend`. El proxy queda detrás de
`PHINANCE_PROXY_ENABLED=false` por defecto. SST genera IDs opacos nuevos,
reemplaza cualquier header SST enviado por el navegador y nunca reenvía el
bearer del usuario. Los writes no tienen retry automático.

La secuencia verifica primero el bearer del navegador y la membership activa;
luego deriva entitlements, genera trazas SST y obtiene el bearer M2M. Sólo
entonces Phinance verifica al caller y resuelve el perfil local. Los contratos
owner y los requests predecesores conservan autoridad. La QA positiva no
equivale a despliegue ni autoriza secretos o infraestructura.

## Unidades Y Definition Of Done

1. Publicar el lifecycle y validar el control plane.
2. Implementar forwarding acotado con timeout y allowlist de headers.
3. Probar negativos de credencial, membership, rol, spoofing y upstream.
4. Ejecutar smoke integrado de trust e aislamiento por cuenta.
5. Publicar owner docs, hacer readback y cerrar con `npm run check` completo.
