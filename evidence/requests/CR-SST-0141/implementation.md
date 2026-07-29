# Implementación CR-SST-0141

Fecha: 2026-07-12.

El builder de creación Web nativa de `sst-fend` exige una URL canónica no
vacía y envía el mismo valor en `url` top-level y en
`payload:{kind:web,data:{url}}`. El fallback de respuesta sólo preserva
payloads nativos Web/Text solicitados cuando la respuesta válida los omite.

`node-auth` ya preservaba URL y payload explícitos, no sintetizaba Web desde
URL y mapeaba la respuesta como `payloadKind=web`; no requirió cambio runtime.
Text, transcript, extensión, updates e históricos quedaron fuera de alcance.

