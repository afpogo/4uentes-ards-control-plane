# Disposición del merge Auth

## Decisión

Se acepta el merge de código ya existente de Auth como integración en
`develop` sin rollout. La instrucción humana del 2026-08-31 autoriza crear y
fusionar los PRs necesarios para completar las tareas respetando las policies.
Aplicada al incidente ya contenido, permite conservar el merge
`ff5605c67d412e3e363d58de14a5b6b98b38c4ad` en lugar de crear un revert
innecesario.

Esta disposición no amplía los gates de side effects. Permanecen prohibidos
hasta una autorización enumerada posterior:

- reejecutar el workflow de push Auth `33452558381`;
- publicar o retaggear la imagen Auth;
- modificar el pin Auth en Infra;
- desplegar el runtime;
- promover Auth hacia `main`;
- escribir en Jira.

## Fundamento

- el candidato cubre exactamente las 20 rutas allowlisted;
- el check completo de Auth y los tres harness HTTP pasaron;
- el Markdown humano quedó en español y los contratos técnicos en inglés;
- el secret scan no encontró credenciales;
- el PR `#15` conserva el SHA esperado `4b20fe5`;
- el workflow de push fue cancelado y no mutó Infra;
- Infra permaneció en `develop@6058967` durante el readback de contención.

## Estado resultante

Auth queda `integrated-in-develop-without-rollout`. El siguiente owner no se
habilita automáticamente: requiere su propio preflight, lifecycle running,
allowlist, owner docs y validaciones. Los releases estables siguen bloqueados
por el gate global.
