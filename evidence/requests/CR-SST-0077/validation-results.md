# CR-SST-0077 Resultados De Validacion

- Request: `CR-SST-0077`
- Validado en: `2026-06-13`

- `4uentes-ards-core: npm.cmd run mcp:build` -> `passed`
- `4uentes-ards-core: npm.cmd run mcp:smoke` -> `failed`
- `4uentes-ards-core: npm.cmd run check` -> `failed`
- `4uentes-auth: npm.cmd run check` -> `passed`
- `sst-fend: npm.cmd run check` -> `failed`
- `sst-bend: npm.cmd run check` -> `failed`
- `sst-extension: pnpm.cmd run check` -> `failed`
- `sst-chatbot: .\\.venv\\Scripts\\python.exe scripts\\check.py` -> `failed`
- `sst-4uentes-infra: npm.cmd run check` -> `passed`
- `4uentes-orchestor: npm.cmd run check` -> `passed`
