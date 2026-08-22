# Configuración moderna de contraseñas: raw-v2, TLS, TTL y scrypt

## Propósito y contexto

Esta guía explica el diseño que acompaña la adopción web de `raw-v2` en development. Está dirigida a una persona senior fullstack que necesita razonar sobre el contrato completo: navegador, transporte, Auth, almacenamiento de verificadores, sesiones, antiabuso, despliegue y rollback.

No es una afirmación de cierre. Distingue el diseño objetivo de las brechas encontradas durante QA. Tampoco describe criptografía poscuántica: `raw-v2`, TLS convencional y scrypt resuelven problemas actuales de transporte y almacenamiento de contraseñas, pero no constituyen por sí mismos un esquema post-cuántico.

## Modelo mental en una frase

Con `raw-v2`, el navegador envía la contraseña original una sola vez a Auth por un transporte permitido; Auth normaliza y valida la entrada, calcula un verificador scrypt salado y guarda sólo ese verificador. Los tokens y la familia de sesión tienen TTLs separados, por lo que “cuánto vive una sesión” no es una única cifra.

```text
Formulario -> validación cliente -> TLS/loopback controlado -> Auth
                                                        |
                                                        +-> control de abuso y concurrencia KDF
                                                        +-> normalización y política de password
                                                        +-> scrypt(password, salt aleatoria)
                                                        +-> verificador almacenado
                                                        +-> access/refresh + familia de sesión
```

## Qué es `raw-v2`

`raw-v2` es la versión del **protocolo de credenciales** entre el cliente y Auth. No es un algoritmo de hash, una versión general de la API ni una señal de que la contraseña se guarde en claro.

Una request `raw-v2` lleva transitoriamente:

- la contraseña que escribió el usuario;
- `credential_version=raw-v2`.

La ausencia de `credential_version` identifica el contrato legacy. Un valor `null`, vacío o desconocido debe rechazarse: inferir el protocolo por la longitud o forma del campo sería ambiguo y permitiría degradaciones accidentales.

La motivación es devolver al servidor la autoridad sobre la política del verificador. En el esquema legacy, el cliente deriva primero un material opaco mediante PBKDF2 y el servidor verifica luego el material legado. Ese valor derivado puede convertirse en un “equivalente de contraseña” reutilizable si se captura. Además, repartir la política criptográfica entre bundles de cliente hace más difícil cambiar parámetros, normalizar de forma coherente o migrar cuentas.

Con `raw-v2`:

- el servidor selecciona y actualiza la KDF;
- cada cuenta recibe una salt aleatoria;
- el servidor puede aplicar normalización y controles de contraseñas comprometidas de manera uniforme;
- el cliente no realiza downgrade automático ni reenvía la contraseña bajo otro protocolo después de un `401`.

Ese último punto importa: un retry silencioso legacy duplicaría envíos y abriría una superficie de downgrade. La compatibilidad se decide por cuenta y por flags del servidor, no probando protocolos con la contraseña del usuario.

## Qué protege TLS y qué no

TLS es el protocolo que proporciona confidencialidad e integridad en tránsito y autentica al servidor mediante certificados. Para orígenes remotos, `raw-v2` exige HTTPS. La contraseña existe en memoria del navegador y llega en claro a la aplicación Auth **después** de que el endpoint TLS la descifra, pero no debe ser legible para intermediarios de red si TLS y la confianza de certificados están correctamente configurados.

El frontend admite HTTP sólo en development, con un flag explícito, y únicamente para loopback exacto: `localhost`, `127.0.0.1` o `[::1]`. Una URL HTTP remota o con `userinfo` debe fallar antes de transmitir credenciales.

TLS no protege contra:

- XSS, keyloggers o extensiones maliciosas en el navegador;
- un host o proceso de Auth comprometido;
- logging de cuerpos de request, traces o dumps de memoria inseguros;
- una terminación TLS o cadena de confianza mal administrada;
- engaño al usuario antes de llegar al origen legítimo.

Si TLS termina en un Ingress, desde ese punto comienza una frontera de infraestructura confiable. Debe evaluarse también la protección del salto interno. En cualquier capa, los cuerpos de autenticación, passwords, JWT, cookies y CSRF deben quedar fuera de logs y evidencia.

## Qué es scrypt

scrypt es una función de derivación de clave para contraseñas, o KDF. Convierte una contraseña y una salt aleatoria en un verificador costoso de calcular. Es deliberadamente intensiva en memoria y CPU para encarecer intentos offline después de una filtración.

No es cifrado: no hay una clave que permita “descifrar” el password. La salt no es secreta; evita que dos passwords iguales produzcan el mismo verificador y dificulta tablas precalculadas.

El perfil implementado para `raw-v2` es:

| Parámetro | Valor | Función |
| --- | ---: | --- |
| `N` | `32768` (`2^15`) | Factor principal de costo. |
| `r` | `8` | Tamaño de bloque interno. |
| `p` | `3` | Paralelización/costo adicional. |
| Salt | `16 bytes` aleatorios | Individualiza cada verificador. |
| Salida | `64 bytes` | Longitud de la clave derivada. |
| `maxmem` | `64 MiB` | Límite operativo por cálculo. |

El formato persistido es conceptualmente:

```text
$scrypt$n=32768,r=8,p=3$<salt-base64>$<hash-base64>
```

La verificación debe parsear parámetros admitidos y comparar con tiempo constante. Para usuarios inexistentes se utiliza un verificador dummy, reduciendo diferencias de tiempo que podrían facilitar enumeración.

### Capacidad y antiabuso

Una KDF cara protege ante ataques offline pero también puede agotarnos recursos online. Por eso Auth limita globalmente los cálculos concurrentes:

- `PASSWORD_KDF_MAX_CONCURRENCY=4`;
- `PASSWORD_KDF_MAX_QUEUE=32`.

Si la cola se agota, se rechaza antes de iniciar otro scrypt. Esto debe combinarse con el guard de intentos por cuenta e IP, cuya modalidad es `off`, `observe` o `enforce`. En `observe` se miden decisiones sin bloquear; en `enforce` puede devolverse `429` con `Retry-After`.

Las claves del guard no deben contener email o IP en claro. El fallo del storage del guard es actualmente fail-open, una decisión operativa que preserva disponibilidad pero reduce protección durante la falla. Antes de producción deben medirse latencia, memoria, throughput, cola y comportamiento bajo abuso; copiar parámetros sin benchmark no es una garantía de seguridad.

## Política del password

Para `raw-v2`, Auth normaliza a Unicode NFC y cuenta puntos de código, no bytes ni unidades UTF-16. El rango es de 15 a 128 caracteres, sin truncamiento silencioso y sin reglas arbitrarias de composición.

Esto favorece passphrases largas y evita reglas como “una mayúscula, un símbolo y un número”, que suelen producir patrones predecibles. La interfaz debe comunicar exactamente 15–128; si aún muestra 8–12, es una brecha de copy/validación visible, no un cambio del contrato del servidor.

La comprobación local de contraseñas comprometidas usa una huella SHA-256 de una forma normalizada para consultar una denylist sin registrar la contraseña. Esa huella no reemplaza scrypt como verificador persistido.

## TTL: no existe una sola duración de sesión

TTL significa *time to live*: cuánto tiempo sigue siendo válido o retenido un artefacto o estado. No es expiración periódica del password.

| Configuración | Valor de development | Qué gobierna |
| --- | ---: | --- |
| `JWT_ACCESS_TTL` | `15m` | Vida corta del access token usado por APIs. |
| `JWT_REFRESH_TTL` | `30d` | Límite criptográfico del refresh token. |
| `SESSION_IDLE_TTL` | `5h` | Ventana móvil sin actividad útil de refresh. |
| `SESSION_ABSOLUTE_TTL` | `30d` | Tope duro de la familia de sesión aunque haya actividad. |
| `SESSION_RETENTION_TTL` | `30d` | Retención de evidencia de una sesión terminal; no mantiene al usuario logueado. |
| `VITE_AUTH_IDLE_TIMEOUT_MS` | `18000000` | Barrera local/UX de cinco horas en el cliente. |

El timeout del frontend debe alinearse con la intención del idle server-side, pero no es autoridad de seguridad: cerrar una pestaña, manipular JavaScript o perder el timer no extiende la validez que controla Auth.

Access y refresh comparten un `sid` estable que identifica una familia de sesión. El refresh es de un solo uso y rota mediante compare-and-swap: ante dos refresh paralelos con el mismo token, exactamente uno debe ganar y los demás recibir `401`. El control CSRF debe validarse antes de esa mutación.

Puede haber varias familias activas para un usuario, por ejemplo en dos dispositivos. El logout normal revoca la familia actual (`userId + sid`); “logout en todos los dispositivos” es una operación diferente.

## Flags y dónde viven

### Auth: configuración runtime

| Variable | Baseline segura | Propósito |
| --- | --- | --- |
| `PASSWORD_RAW_V2_ACCEPT_ENABLED` | `false` | Permite aceptar requests `raw-v2`. |
| `PASSWORD_MIGRATE_ON_LOGIN_ENABLED` | `false` | Migra una cuenta legacy después de un login válido. |
| `PASSWORD_KDF_MAX_CONCURRENCY` | `4` | Máximo de scrypt activos. |
| `PASSWORD_KDF_MAX_QUEUE` | `32` | Espera máxima antes de rechazar. |
| `LOGIN_ATTEMPT_GUARD_MODE` | `off` | Selecciona medición o enforcement antiabuso. |

Estas variables pertenecen al despliegue de Auth y deben cambiarse de forma auditable mediante GitOps. Aceptación y migración se separan para poder desplegar capacidad sin mutar cuentas inmediatamente.

### Fend: configuración de build

| Variable | Default segura | Development objetivo |
| --- | --- | --- |
| `VITE_AUTH_CREDENTIAL_PROTOCOL` | `legacy` | `raw-v2` |
| `VITE_ALLOW_INSECURE_LOOPBACK_CREDENTIALS` | `false` | `true`, sólo para el build local/development |
| `VITE_AUTH_REQUEST_TIMEOUT_MS` | `15000` | Según baseline medida. |
| `VITE_AUTH_IDLE_TIMEOUT_MS` | `18000000` | Cinco horas. |

Las variables `VITE_*` se incrustan en el bundle. No son secretos ni configuración runtime dinámica: cambiarlas exige reconstruir y publicar otra imagen. El Dockerfile conserva defaults seguros; el workflow de development opta explícitamente por `raw-v2` y loopback inseguro.

## Compatibilidad y migración

La adopción gradual separa cuatro momentos:

1. desplegar Auth capaz de aceptar `raw-v2`, con migración apagada y legacy todavía válido;
2. validar clientes sintéticos legacy y `raw-v2`, errores de versión, capacidad KDF y telemetría sin secretos;
3. publicar Fend compilado para `raw-v2`, sin downgrade automático;
4. tras ventanas estables, habilitar migración oportunista de cuentas legacy.

Una cuenta legacy se migra sólo después de demostrar conocimiento de su credencial mediante un login válido. La escritura debe usar compare-and-swap para resolver carreras. Durante la ventana de rollback puede conservarse el verificador legacy; una cuenta ya marcada `raw-v2` verifica exclusivamente V2 y una contraseña incorrecta no cae a legacy.

El rollback ordenado empieza por restaurar un Fend legacy y confirmar que todavía inicia sesión. Después se apaga migración y sólo se desactiva aceptación `raw-v2` cuando ningún cliente development la utiliza. Desactivar primero el servidor rompería clientes ya compilados.

## Estado actual y brechas que no deben ocultarse

`CR-SST-0201` quedó cerrado como `validated-live`: `raw-v2`, scrypt server-side, migración/rollback, login y refresh por el origen HTTPS protegido pasaron sin downgrade ni saturación KDF observada. Esto cierra la adopción web de ese protocolo en development, no el programa completo de password y sesión.

Las brechas integradas más recientes pertenecen a `CR-SST-0200`:

- la interfaz de signup conserva copy 8–12 aunque el contrato `raw-v2` sea 15–128;
- register → hard navigation → refresh → `/chat` no mantiene todavía la continuidad esperada en el QA manual;
- logout devolvió `401` en la superficie pública y fue seguido por una carga autenticada rechazada, por lo que el teardown debe corregirse y repetirse;
- password recovery continúa como gap independiente de `CR-SST-0159` y no queda resuelto por adoptar `raw-v2`.

Por lo tanto, “el chat funciona” o “el login respondió una vez” no demuestra por sí solo que la sesión SPA o el lifecycle completo de password estén cerrados.

## Lo que esto no convierte en post-cuántico

El nombre `raw-v2` no significa “post-cuántico”. scrypt es una KDF de password diseñada para resistencia práctica a cracking, y TLS protege el canal con la suite negociada por la plataforma. Ninguno declara automáticamente una transición a algoritmos poscuánticos.

Una estrategia post-cuántica real tendría que definir al menos algoritmos híbridos o PQC, soporte de clientes y proxies, certificados, rotación, inventario criptográfico, interoperabilidad, métricas y rollback. Debe tratarse como una iniciativa distinta y no como una propiedad implícita de esta configuración.

## Checklist de revisión fullstack

- El browser transmite `raw-v2` una sola vez y nunca hace downgrade automático.
- HTTPS es obligatorio fuera de loopback; HTTP remoto y URL con `userinfo` fallan antes del envío.
- Passwords, tokens, cookies y CSRF no aparecen en logs, analytics, traces ni evidencia.
- Frontend y Auth coinciden en NFC, 15–128 y mensajes de error.
- El servidor guarda un scrypt salado, no la contraseña ni el valor raw.
- Los límites KDF y el guard de intentos fueron probados con capacidad real.
- Access, refresh, idle, absolute y retention TTL tienen semánticas y observabilidad separadas.
- Refresh single-use, CSRF, logout actual y logout-all se prueban como contratos distintos.
- Aceptación, emisión y migración pueden activarse y revertirse independientemente.
- Los flags de build de Fend se verifican en la imagen publicada; los flags runtime de Auth se reconcilian por GitOps.
- Legacy permanece sólo durante la ventana documentada de compatibilidad y rollback.
- Las brechas abiertas conservan owner, CR y evidencia; no se maquillan como aceptación.
