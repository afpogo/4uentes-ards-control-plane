# CR-SST-0239: preflight del gate de completitud

## Readback previo

El PR `#300` fue fusionado y el commit `099a60c` quedó alcanzable desde
`origin/main`. El control plane conserva el `PARTIAL PASS`, el comentario Jira
`10438` y los pendientes cross-principal y browser/realtime. No corresponde
cerrar CR-SST-0239, CR-SST-0207 ni SST-117.

## Corrección del límite de identidades

La identidad sintética de la corrida parcial permanece en el identity store,
pero sus credenciales y tokens aleatorios se descartaron deliberadamente luego
del cleanup. No puede reutilizarse y la identidad real del operador no debe
participar como principal de prueba.

El gate de completitud necesita exactamente dos identidades sintéticas nuevas:

1. principal A, reutilizado en HTTP, dos sesiones activas, browser y realtime;
2. principal B, usado solamente para verificar que las operaciones ajenas no
   enumeran, leen, promueven, finalizan ni eliminan recursos del principal A.

## Presupuesto runtime propuesto

El máximo autorizado debe quedar acotado a:

- dos identidades sintéticas nuevas;
- seis conversaciones entre temporales y guardadas;
- dos mensajes con contenido sintético aleatorio;
- dos sesiones activas del principal A;
- cleanup de todas las conversaciones por APIs del producto en un bloque
  `finally`;
- descarte en memoria de emails, passwords, tokens e identificadores al cerrar.

Las dos identidades pueden quedar como residuo porque no existe contrato de
producto para eliminarlas. Este costo debe ser aceptado explícitamente antes de
crear las cuentas.

## Evidencia y límites

La evidencia final debe contener sólo filas, estados, cantidades y códigos de
resultado. Debe excluir dominio reservado, identidad del operador, emails,
passwords, bearer, cookies, headers, IDs y mensajes.

No se autoriza todavía la corrida. Continúan prohibidos Jira, bypass o cambio
de OAuth, configuración o reinicio de ngrok, repos hijos, deployment, cluster,
producción y acceso directo a Redis, PostgreSQL o identity store.
