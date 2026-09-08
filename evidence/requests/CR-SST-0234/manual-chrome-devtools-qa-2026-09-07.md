# QA manual read-only de Learning con Chrome DevTools

## Alcance autorizado

El 2026-09-07 el usuario autorizó avanzar con QA manual mediante un Chrome
DevTools MCP independiente y fijó dos límites explícitos: no usar seeders y no
modificar la base de datos. En consecuencia, este gate se limitó a navegación,
snapshot de accesibilidad, captura visual, consola y red.

No se ejecutaron acciones `preview`, `accept` ni `reject`: el preview vigente
persiste estado técnico y habría contradicho el límite de no modificar la base
de datos. Tampoco se ingresaron credenciales, secretos ni datos de negocio.

## Aislamiento del navegador

La instancia Chrome DevTools por defecto informó que su perfil ya estaba en
uso. No se cerró, seleccionó ni modificó esa ventana. La prueba se abrió en el
servidor Chrome DevTools nominal independiente `chrome_devtools_cr_sst_0159`,
en una página nueva de background y con el contexto aislado
`cr-sst-0234-learning-qa-20260907`.

## Observación

| Control | Resultado |
|---|---|
| URL solicitada | `http://localhost:8088/learning` |
| Request de documento | `GET /learning` → `200` |
| URL visible luego del bootstrap | `http://localhost:8088/` |
| Estado de sesión aislada | no autenticada |
| Comportamiento | el cliente presenta el home público y acciones `Sign in` |
| Consola | sin mensajes |
| Red | nueve solicitudes `GET`; ninguna mutación observada |
| Captura visual | emitida por Chrome DevTools en la sesión de QA |

El resultado confirma que `/learning` no expone el workspace protegido a un
contexto aislado sin autenticación. No demuestra todavía el flujo positivo de
resolver y snapshots, ni la UX futura de inbox: `CR-SST-0235` y `CR-SST-0236`
siguen sin adopción y la validación E2E pertenece a `CR-SST-0237`.

## Dictamen

`PASS` para el control manual negativo y no mutante de acceso. `PENDING` para
QA positiva protegida. Bajo el límite actual no es válido crear fixtures ni
invocar endpoints que persistan estado, por lo que este resultado no habilita
el cierre terminal de `CR-SST-0234`.

El próximo gate de QA debe elegir explícitamente un mecanismo reversible y
acotado que no dependa de seeders ni de datos preexistentes, o mantener la QA
positiva pendiente hasta `CR-SST-0237`.
