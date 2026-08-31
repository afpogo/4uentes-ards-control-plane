# Autorización de ejecución owner para Auth

## Autorización consumible

- Fecha: `2026-08-30`.
- Autoridad: `4uentes`.
- Texto exacto: `Autorizo el gate owner Auth de CR-CP-0024 hasta publicar el PR, sin fusionarlo.`
- Slice: `4uentes-auth` sobre `origin/develop`.
- Límite terminal: publicar el PR owner; el merge queda prohibido.

## Acciones permitidas

1. Publicar y leer el lifecycle `running` de `CR-CP-0024` para Auth.
2. Refrescar `origin/develop` y confirmar la base esperada.
3. Crear un worktree y una rama limpios para el candidato Auth.
4. Recuperar exclusivamente las 20 rutas de la allowlist publicada.
5. Conservar commits separados por procedencia histórica y corregir el
   Markdown humano a español.
6. Ejecutar checks owner, harness técnico, revisión de secretos y diff.
7. Publicar el PR owner y leer su SHA y checks sin fusionarlo.

## Acciones prohibidas

- fusionar el PR Auth;
- publicar o desplegar una imagen de forma deliberada;
- aceptar o conservar un cambio automático de pin en Infra;
- modificar Backend, Infra u otro owner;
- usar credenciales reales o mutar datos compartidos;
- escribir, comentar o transicionar Jira;
- ampliar la allowlist o reutilizar como lifecycle la identidad canónica
  ocupada `CR-HPT-0016`.

## Consumo

La autorización se consume al publicar el PR owner. Cualquier merge o efecto
automático requiere un nuevo gate humano con PR, SHA, checks, digest y diff de
Infra enumerados.
