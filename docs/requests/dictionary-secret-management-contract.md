# CR-SST-0084 - Contrato de gestion documental de secretos

## Proposito

Agregar al Diccionario una capacidad para que el usuario documente secretos
propios como conocimiento operativo, sin exponer valores sensibles por defecto.

La capacidad no reemplaza un vault empresarial. El objetivo v1 es guardar
valores cifrados, documentarlos, asociarlos a perfiles de conexion y permitir
acciones controladas de copiar o revelar con auditoria.

## Modelo conceptual

- `DictionarySecretEntry`: metadata visible, proposito, categoria,
  plataforma, notas de uso, instrucciones de rotacion, dependencias y estado.
- `ProtectedSecretValue`: valor cifrado, versionado, con metadata de algoritmo
  y clave, nunca devuelto por endpoints de lista o busqueda.
- `ConnectionProfile`: plataforma, URL o host, usuario, puerto, protocolo,
  tipo de conexion y relacion opcional con password, API key o token.
- `SecretAccessEvent`: auditoria de `create`, `update`, `delete`, `reveal`,
  `copy`, `rotate` y `revoke`.

## Reglas de seguridad

- Los valores deben cifrarse antes de persistirse.
- Lista, busqueda, export y documentacion devuelven solo metadata.
- `reveal` y `copy` son endpoints separados, autenticados, account-scoped y
  auditados.
- No crear full-text index sobre valores secretos.
- No enviar valores a prompts, analytics, logs, evidencia ni exports.
- No registrar payloads que contengan valores secretos.
- Bloquear o declarar no soportado `seed_phrase` y material equivalente de
  recuperacion extrema.

## Rutas esperadas

- Backend producer: `/4uentes/v1/diccionario/secrets/*`.
- BFF autenticado: `/api/diccionario/secrets/*`.

## Superficie v1

- Crear secreto con metadata y valor protegido.
- Editar metadata sin revelar el valor.
- Buscar y filtrar por categoria, plataforma, tipo de conexion y estado.
- Copiar valor mediante endpoint explicito y auditado.
- Revelar valor temporalmente mediante endpoint explicito y auditado.
- Rotar valor creando una nueva version.
- Revocar o desactivar entrada sin borrar auditoria.

## Semantica UI De Acceso

La UI puede mostrar acciones compactas con iconos, siempre que conserve labels
accesibles y no cambie el modelo de seguridad.

- `Ver secreto`: llama al endpoint `reveal` solo cuando el valor no esta
  visible localmente.
- `Ocultar secreto`: borra el valor visible desde estado local efimero y no
  llama al backend.
- `Copiar secreto`: llama al endpoint `copy` y escribe al clipboard sin
  persistir el valor en Redux, localStorage, sessionStorage, logs ni evidencia.
- `Revocar secreto`: requiere confirmacion explicita y deja la entrada no
  activa sin borrar auditoria.
- Secretos no activos no permiten reveal, copy, rotate ni revoke desde la UI.
- Los tooltips y `aria-label` deben conservar significado equivalente aunque el
  texto visible del boton desaparezca.

## Fuera de alcance v1

- `sst-extension`.
- Exportar valores secretos.
- Vault empresarial completo.
- Seed phrases, recovery phrases o material equivalente de custodia extrema.

## Extension Futura: CredentialedWebSource

`DictionarySecret` puede evolucionar a recurso vivo para adquirir contenido web
privado, pero no debe hacerlo entregando plaintext secrets a la UI o a agentes.

Regla futura:

- el secreto gobierna acceso;
- el contenido adquirido se modela como `CredentialedWebSource`;
- el valor secreto no se convierte en contenido;
- backend o worker solo reciben `SecretRef` bajo politica y auditoria;
- el frontend nunca recibe el plaintext para captura automatizada;
- cualquier contenido privado entra primero como preview y requiere aceptacion
  explicita antes de llegar a `LearningWorkspace` o contexto IA.

El modo recomendado para el primer corte es `browser-session`: el usuario ya
esta autenticado en su navegador y `sst-extension` captura pestañas de forma
explicita. Ese modo no usa secretos del Diccionario, pero prepara el contrato de
contenido privado gobernado.

La captura multi-pestaña depende de corregir el flujo `sessions` de
`sst-extension` para activar, estabilizar, capturar, clasificar y restaurar cada
pestaña. Ver `CR-SST-0093`.
