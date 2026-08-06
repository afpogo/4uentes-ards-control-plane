# CR-SST-0093 - Boundary CredentialedWebSource

## Proposito

`CredentialedWebSource` representa contenido web privado que el usuario esta
autorizado a consultar y que SST puede transformar en un artefacto gobernado:
PDF visual, HTML preservado, texto normalizado, `KnowledgeDocument`,
`ContentBlock[]`, resumen, tags sugeridos o contexto aceptado.

No es un crawler libre. No es una exportacion de secretos. No es una ruta para
mandar credenciales a un agente IA.

## Relacion Con DictionarySecret

`DictionarySecret` debe evolucionar como recurso vivo de SST, pero con una
regla central:

El secreto gobierna acceso. El valor secreto no se convierte en contenido.

En una etapa futura, el runtime puede recibir un `SecretRef` para adquirir una
pagina privada desde backend o worker controlado. Ese flujo no debe devolver el
plaintext al frontend ni al agente. Tampoco debe persistir el valor secreto en
logs, evidencia, prompts, localStorage, sessionStorage o artifacts.

## Dos Modos Permitidos

### Modo A - Browser Session Capture

El usuario ya esta logueado en la web privada. `sst-extension` captura lo que el
usuario ve desde su navegador.

Este modo es el candidato v1 porque:

- evita transferir secretos al frontend;
- usa la sesion del navegador que el usuario controla;
- permite capturar contenido detras de login sin modelar cada mecanismo de
  autenticacion;
- mantiene una accion explicita y visible para el usuario.

Riesgo principal: la captura multi-tab debe ser robusta y transparente sobre
fallos o degradaciones.

### Modo B - Backend SecretRef Capture

Un servicio backend o worker usa un `SecretRef` de Diccionario para autenticarse
contra una web privada y traer contenido.

Este modo queda para una fase posterior porque requiere:

- allowlist de destinos;
- politica de uso por secreto;
- auditoria `use_for_web_acquisition`;
- aislamiento de navegador/headless o cliente HTTP;
- rate limits;
- controles anti exfiltracion;
- revision legal/operativa de terminos de uso cuando aplique;
- pruebas de no exposicion de secretos.

## Salidas Gobernadas

Una adquisicion puede producir:

- `rawHtml` cuando se preserve HTML;
- `visualPdf` cuando se capture la pagina renderizada;
- `readableText` cuando solo exista extraccion textual;
- `KnowledgeDocument` como unidad procesable;
- `ContentBlock[]` para uso en LearningWorkspace;
- `warnings[]` para degradaciones, permisos, contenido parcial o fallos por
  pestaña.

La salida debe registrar provenance:

```yaml
sourceType: "credentialed-web"
captureMode: "browser-session"
origin: "https://example.internal"
secretRef: null
artifactKinds:
  - "visual-pdf"
  - "readable-text"
warnings: []
acceptedByUser: false
```

Para backend `SecretRef` futuro:

```yaml
sourceType: "credentialed-web"
captureMode: "backend-secret-ref"
origin: "https://example.internal"
secretRef: "dictionary-secret:TODO"
artifactKinds:
  - "html"
  - "readable-text"
warnings: []
acceptedByUser: false
```

## Reglas De Seguridad

- Accion explicita del usuario para capturar o adquirir.
- Preview antes de persistencia durable.
- Aceptacion explicita antes de entrar a LearningWorkspace o contexto de IA.
- No ingestion automatica por crawler.
- No transferencia de plaintext secret al frontend ni al agente.
- No evidencia con cookies, JWTs, secretos o contenido privado real.
- Scope por cuenta/usuario.
- Auditoria de uso de secreto cuando exista `SecretRef`.
- Degradaciones visibles: textual fallback, captura parcial, URL no soportada,
  pagina demasiado larga, permiso denegado.

## Relacion Con LearningWorkspace

`CredentialedWebSource` puede producir material de entrada para
`LearningWorkspace`, pero no debe saltar el gate `preview-only`.

Flujo esperado:

1. Capturar o adquirir fuente privada.
2. Generar preview con artifacts y warnings.
3. Usuario revisa.
4. Usuario acepta.
5. SST consolida `KnowledgeDocument` / `ContentBlock[]`.
6. Agente IA usa solo contenido aceptado y scoping de cuenta/usuario.

## Fuera De Alcance En Este CR

- Modificar `sst-extension`.
- Modificar `sst-bend`.
- Usar secretos reales.
- Capturar paginas privadas reales para evidencia.
- Implementar browser headless backend.
- Automatizar crawler o scraping recursivo.
