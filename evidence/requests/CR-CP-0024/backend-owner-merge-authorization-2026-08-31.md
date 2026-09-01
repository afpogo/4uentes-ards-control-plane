# Autorización de merge y rollout acotado de Backend

## Autorización recibida

El owner indicó:

> Autorizo fusionar sst-bend PR #32 y verificar la publicación de imagen y el
> cambio acotado del pin Backend en Infra.

## Alcance consumible

Esta autorización habilita una sola ejecución contra el head validado
`de19c14f95c077a2b85a1bbdd205d01a512cbd00`:

1. fusionar `afpogo/sst-bend#32` hacia `develop` con merge commit;
2. permitir el workflow automático de publicación de la imagen Backend;
3. permitir el commit automático que actualice únicamente el pin Backend en
   `afpogo/4uentes-infra:develop`;
4. verificar workflow, imagen, diff y readback remoto de Infra.

Si el head, los checks o la base cambian antes del merge, la autorización no se
consume y el gate vuelve a revisión.

## Límites

No se autoriza:

- modificar otros manifests, imágenes o valores de Infra;
- ejecutar `argocd app sync` ni otro despliegue;
- promover Backend a `master`;
- escribir Jira;
- reejecutar workflows fallidos con un alcance distinto;
- force-push o push genérico a ramas canónicas.

Ante un diff Infra más amplio que el digest/tag esperado, se detiene la ola y
se registra la desviación sin continuar a otro owner.
