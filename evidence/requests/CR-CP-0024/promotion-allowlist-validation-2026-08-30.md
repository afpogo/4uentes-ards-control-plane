# Validación de allowlists de promoción

## Resultado

Las tres fuentes limpias disponibles para validación expanden exactamente a
las rutas declaradas en el manifest. No se evaluaron como promovibles los
repositorios cuyo origen sigue dirty, ausente o pendiente de extracción por
request.

| Repositorio | Base observada | Fuente inmutable | Rutas | Resultado |
|---|---|---|---:|---|
| `4uentes-auth` | `13ebe6ffd57b909a01dceaf78e8d42698094f6a8` | `f9fe6b523c4946d96360d280c6420956faba3690` | 20 | coincidencia exacta |
| `sst-bend` | merge-base `dc67203c77bb91804db888ad57c4f2a174b3d6b8` | `2a0de56bdfadbbfdd6f586e97b5300f5fc7e9bdf` | 51 | coincidencia exacta |
| `sst-chatbot` | `5b96bbb` (`origin/develop`) | `99ecc162b101e36ee7d91dbff485d4008c5e8bb7` (`origin/main`) | 6 | coincidencia exacta |

La primera comparación de Backend detectó cuatro nombres de path incorrectos
en el borrador del manifest: dos repositories, el provider de integración y
el middleware de verificación. Se corrigieron contra el árbol Git; no se
amplió el contenido promovible.

## Método reproducible

En cada worktree fuente limpio se ejecutó `git diff --name-only <base>
<source>`. Para Chatbot se usó además `--name-status` para confirmar que la
reconciliación contiene cinco modificaciones y una adición. Las salidas se
ordenaron y compararon como conjuntos contra `promotion_path_allowlist` en:

`evidence/requests/CR-CP-0024/promotion-disposition-manifest.yaml`

Reglas aplicadas:

- una ruta declarada sin match bloquea el gate;
- una ruta cambiada fuera de la allowlist bloquea el gate;
- los paths futuros de `CR-SST-0233` no forman parte de la fuente HPT;
- el diff Backend parte de su merge-base porque `origin/develop` ya incorporó
  `CR-HPT-0027` y divergió de la fuente HPT;
- ninguna fuente dirty fue abierta como candidato de promoción.

## Límites

Esta evidencia valida identidad y cobertura de paths. No autoriza mutación de
repositorios owner, publicación de imágenes, merge, despliegue ni Jira. Los
hunks mixtos, idioma humano, contratos, tests owner y efectos automáticos de
CI se revisarán en cada gate de ejecución enumerado después del readback de
este plan.
