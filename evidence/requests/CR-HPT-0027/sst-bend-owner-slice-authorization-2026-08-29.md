# Autorización del slice owner SST Bend de CR-HPT-0027

Fecha: 2026-08-29.

## Fuente

Después de publicar el plan y recomendar como siguiente paso el slice de SST
Bend, el operador indicó: `ok avancemos al siguiente paso`.

La autorización se interpreta únicamente sobre el paso enumerado inmediatamente
anterior. No amplía el resto de `CR-HPT-0027`.

## Operaciones autorizadas

1. Crear un worktree limpio de `sst-bend` desde `origin/develop` refrescado.
2. Reemplazar credenciales de desarrollo embebidas en Compose por archivos
   secretos locales ignorados y un generador CSPRNG owner.
3. Parametrizar los puertos host con variables prefijadas `SST_*`.
4. Limitar bindings locales a loopback y proponer `5051` como default de
   pgAdmin.
5. Actualizar documentación, specs, ejemplos, scripts y checks owner que sean
   necesarios para que el contrato sea reproducible.
6. Validar con material sintético: parser, revisión estática, Compose config y
   check completo del owner.
7. Publicar, releer y registrar el resultado owner; después agregar un único
   comentario sanitizado de avance a `HPT-19`.

## Operaciones no autorizadas

- Leer o copiar `.env`, secretos Docker/Kubernetes, passwords existentes o
  cualquier credencial real.
- Levantar, detener o reiniciar contenedores.
- Cambiar redes, volúmenes, listeners o bases activas.
- Rotar un rol PostgreSQL inicializado.
- Modificar Phinance, Automation, infraestructura u otro owner.
- Mutar Kubernetes, staging o producción.
- Publicar valores secretos, URLs privadas o datos personales.

## Gate de cierre del slice

- Worktree owner aislado y basado en `origin/develop`.
- Valores de ejemplo no utilizables y ningún secreto embebido en Compose.
- Generador que no imprime valores y rechaza overwrite por defecto.
- Puertos configurables, únicos por default y limitados a loopback.
- Documentación owner y validación completas.
- PR owner fusionado y releído antes de reconciliar el control plane.
