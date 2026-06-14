# CR-SST-0077 Validation Results

- Request: `CR-SST-0077`
- Checked at: `2026-06-13`

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
