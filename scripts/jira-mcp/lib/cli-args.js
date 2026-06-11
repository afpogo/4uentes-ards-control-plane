function parseArgs(argv, options = {}) {
  const valueOptions = new Set(options.valueOptions || []);
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) continue;

    const key = arg.slice(2);
    const next = argv[index + 1];
    const hasValue = next && !next.startsWith('--');

    if (valueOptions.has(key) && !hasValue) {
      throw new Error(`El argumento --${key} requiere un valor.`);
    }

    if (!hasValue) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }

  return args;
}

function applyEvidenceArgs(config, args) {
  return {
    ...config,
    evidence: {
      ...config.evidence,
      requestId: stringArg(args, 'request-id', config.evidence.requestId),
      outputDir: stringArg(args, 'output-dir', config.evidence.outputDir),
    },
  };
}

function requireEvidenceArgs(args) {
  const requestId = stringArg(args, 'request-id', null);
  const outputDir = stringArg(args, 'output-dir', null);

  if (!requestId) {
    throw new Error('El argumento --request-id es obligatorio para comandos Jira operativos.');
  }
  if (!/^CR-SST-\d{4}$/.test(requestId)) {
    throw new Error('El argumento --request-id debe tener formato CR-SST-****.');
  }
  if (!outputDir) {
    throw new Error('El argumento --output-dir es obligatorio para comandos Jira operativos.');
  }
  if (!outputDir.includes(requestId)) {
    throw new Error('El argumento --output-dir debe apuntar a la evidencia del request indicado.');
  }
}

function stringArg(args, key, fallback) {
  const value = args[key];
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`El argumento --${key} requiere un valor de texto.`);
  }
  return value;
}

module.exports = {
  applyEvidenceArgs,
  parseArgs,
  requireEvidenceArgs,
};
