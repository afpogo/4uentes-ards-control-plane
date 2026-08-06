# Revision Secret-Safe

## 2026-06-29 - Acciones Icon-Only En Secretos

El cambio frontend de acciones icon-only mantiene el modelo secret-safe vigente:

- No se modificaron backend, BFF, contratos API ni persistencia.
- No se agregaron rutas nuevas ni cambios de auditoria.
- No se agrego almacenamiento en Redux, localStorage, sessionStorage ni logs.
- `copy` sigue usando el endpoint dedicado y solo escribe al clipboard.
- `reveal` sigue usando el endpoint dedicado solo cuando el valor esta oculto.
- La nueva accion `Ocultar secreto` limpia estado React local y no llama al
  backend.
- El valor revelado sigue siendo efimero y conserva auto-hide de 60 segundos.
- La evidencia no incluye JWTs, cookies, master keys ni plaintext de secretos.

## Resultado

No se persistieron JWTs, cookies, master keys reales ni plaintext real de
secretos en los artefactos de este request.

## Controles Aplicados

- Los placeholders de `.env.example` quedan vacios o apuntan a referencias, no a
  valores reales.
- Los tests usan valores ficticios locales para validar cifrado y no registran
  plaintext en evidencia.
- La validacion Jira/MCP genero evidencia sanitizada y redacto `cloudId`.
- No se copiaron payloads HTTP con valores de secretos.
- La QA Chrome DevTools MCP uso valores ficticios y registro solo resultados
  sanitizados. La captura final muestra estado `revoked` con valor masked.
- La revalidacion Chrome DevTools MCP del `2026-06-28` uso usuario local y
  secreto ficticios. El reporte redacta valores revelados y no conserva
  plaintext, JWTs, cookies ni master keys. La master key usada para QA fue
  efimera y no se escribio en archivos.
- El cambio en `sst-bend/docker-compose.yml` solo inyecta variables desde el
  entorno (`SST_DICTIONARY_SECRETS_MASTER_KEY` y
  `SST_DICTIONARY_SECRETS_KEY_REF`); no hardcodea valores.
- El smoke HTTP autenticado uso usuario, token y secretos ficticios/efimeros.
  El resultado conserva solo estados PASS/FAIL y no registra JWTs, cookies,
  master keys ni plaintext.
- La revalidacion de master key del `2026-06-28` consulto solo metadata de
  GitHub Secrets (`gh secret list`) y no intento leer valores. Los checks Docker
  imprimieron solo presencia (`set/missing`) y `KEY_REF`, no la master key.
- El smoke Chrome DevTools MCP same-origin uso valores dummy efimeros y registro
  solo resultados booleanos/sanitizados. Tambien verifico que el dummy secret no
  quedara en DOM/localStorage/sessionStorage.
- Durante la inyeccion cluster, un error de `kubectl jsonpath` imprimio `.data`
  en base64. Se trato como exposicion de master key y se mitigo con rotacion
  inmediata en `.env`, GitHub Secret y Kubernetes Secret.
- El Secret Kubernetes final fue recreado con `kubectl create`, no `kubectl
  apply`, y se verifico `hasLastApplied=false` para evitar que
  `kubectl.kubernetes.io/last-applied-configuration` conserve data.
- La validacion final de cluster imprimio solo presencia (`set/missing`),
  metadata segura y estados PASS/FAIL; no imprimio la master key vigente.

## Gaps

- Cualquier smoke HTTP adicional con token QA efimero debe registrar solo
  estado, endpoints y resultados sanitizados.
- La lectura de clipboard desde MCP quedo bloqueada por timeout/permisos; no se
  debe registrar contenido de portapapeles en evidencia futura.
- El secret de GitHub debe conectarse al mecanismo de deploy/runtime sin
  copiarlo a evidencia ni logs.
- Evitar `kubectl get secret -o jsonpath` y cualquier comando que pueda volcar
  el objeto completo del Secret ante errores de template.
