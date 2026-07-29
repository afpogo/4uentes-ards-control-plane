# Decision Funcional Posterior A SST-33

## Estado De SST-33

`CR-SST-0101 / SST-33` sigue cerrado. Su entrega es una definicion de
`CredentialedWebSource v1` sobre la captura que una persona inicia desde su
navegador ya autenticado. No agrega un crawler, ni envio de contrasenas, ni una
importacion automatica a LearningWorkspace o a IA.

Esta decision no reabre ni amplia la implementacion cerrada. Ordena el
crecimiento futuro y mantiene separados los permisos que una persona da, el
contenido que revisa y los secretos que administra.

## Que Puede Crecer Y Bajo Que Regla

| Necesidad futura | Situacion actual | Regla para avanzar | Seguimiento |
| --- | --- | --- | --- |
| Importar material a LearningWorkspace | Existe el camino de preview/aceptacion para otros materiales; la entrega desde sesiones de extension sigue pendiente | Mostrar preview, advertencias y decision explicita antes de guardar como contexto aceptado | `CR-SST-0102`; coherencia con `CR-SST-0125` |
| Usar material como contexto de IA | Solo puede partir de contenido que el usuario acepto y que esta acotado a su cuenta | Crear un contrato de consumo de IA con trazabilidad, alcance por cuenta/usuario y retiro del contexto; nunca enviar borradores o capturas sin aceptar | Nuevo CR de contrato IA, aun no reservado |
| Iniciar sesion por su cuenta | No existe | Si se evalua, el backend/worker recibe solo una referencia a secreto, con destinos permitidos, auditoria, limites y aislamiento | Nuevo CR de adquisicion `SecretRef`; corresponde al modo B de `CR-SST-0093` |
| Guardar o revelar contrasenas | `DictionarySecret` ya gobierna guardar, revelar y copiar de modo auditado; no forma parte de la extension | Una contrasena no se convierte en contenido ni se envia a la extension o IA. El uso futuro para adquirir una pagina usa referencia, no plaintext | Contrato `dictionary-secret-management`; cualquier ampliacion requiere CR de seguridad |
| Capturar HTML completo | Excluido de `CredentialedWebSource v1` | Definir artefacto acotado, sanitizacion, tamanos, retencion, acceso y evidencia antes de capturarlo | Nuevo CR de contrato de artefacto HTML |
| Procesar pagina privada sin iniciar captura | No aprobado | Requiere consentimiento separado, programacion explicita, permisos, limites antiabuso y revocacion. No es un efecto secundario de estar logueado | Nuevo CR de automatizacion consentida, posterior a los controles anteriores |

## Invariantes Que No Cambian

- La persona inicia y ve la captura privada v1.
- Los secretos abren acceso; no se vuelven contenido, prompts ni evidencia.
- Todo material privado se revisa antes de pasar a LearningWorkspace o a IA.
- Las fallas parciales y los limites se muestran como advertencias, no se
  esconden ni revierten silenciosamente una sesion valida.
- Jira y la evidencia no reciben contenido privado, URLs privadas completas,
  cookies, JWT ni contrasenas.

## Orden Recomendado

1. Ejecutar `CR-SST-0103 / SST-35` con la estrategia de QA preparada, usando
   fixtures ficticios.
2. Resolver la entrega preview-only de sesiones hacia LearningWorkspace en
   `CR-SST-0102`.
3. Establecer, en CRs independientes, la aceptacion/lectura de contexto por IA,
   el contrato de HTML y, solo despues, una posible adquisicion con `SecretRef`.
4. Evaluar automatizacion de paginas privadas al final, nunca como habilitacion
   implícita de la captura manual actual.
