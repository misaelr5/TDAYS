## Historial y publicación en GitHub

- Conservar todos los commits individuales: no usar squash, rebase ni force-push para publicar el trabajo.
- Cada commit creado como parte de una entrega autorizada debe enviarse a GitHub; no dejarlo solo en local. Respetar pedidos explícitos de auditoría, trabajo local o no publicación.
- Para que el historial aparezca en la vista principal y pueda contar como contribución, integrar los cambios terminados en la rama predeterminada `main`. Preferir fast-forward cuando sea posible; si las ramas divergieron, revisar e integrar sin reescribir commits.
- Usar la identidad Git asociada a la cuenta del usuario. No cambiar autorías históricas ni inventar fechas o contribuciones.
- Antes de publicar: validar los cambios, revisar el diff y excluir originales privados, secretos y artefactos generados. Después del push: comprobar hash remoto, rama y estado de trabajo.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
