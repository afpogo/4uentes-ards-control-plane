const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const ROOT = path.resolve(__dirname, "..");
const PROFILE_PATH = path.join(
  ROOT,
  "specs",
  "integration",
  "visual-documentation-as-code-profile.yaml",
);
const FIXTURE_ROOT = path.join(
  ROOT,
  "scripts",
  "fixtures",
  "visual-documentation",
);
const START_MARKER = "<!-- visual-map:start -->";
const END_MARKER = "<!-- visual-map:end -->";
const REQUEST_ID = /\bCR-[A-Z0-9]+-\d{4}\b/g;
const INITIATIVE_ID = /\bINIT-[A-Z0-9]+-\d{4}\b/g;

function relative(filePath) {
  return path.relative(ROOT, filePath).replaceAll("\\", "/");
}

function assertion(condition, filePath, message) {
  if (!condition) {
    throw new Error(`[VISUAL DOC] ${relative(filePath)}: ${message}`);
  }
}

function walkMarkdown(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkMarkdown(entryPath));
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(entryPath);
  }
  return files;
}

function uniqueMatches(text, regex) {
  return [...new Set(text.match(regex) || [])];
}

function unquote(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return JSON.parse(trimmed);
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replaceAll("''", "'");
  }
  return trimmed;
}

function parseInlineArray(value) {
  const quoted = [...value.matchAll(/"((?:\\.|[^"\\])*)"|'([^']*)'/g)].map(
    (match) => (match[1] !== undefined ? JSON.parse(`"${match[1]}"`) : match[2]),
  );
  if (quoted.length > 0) return quoted;
  return value
    .slice(1, -1)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseVisualMetadata(yaml, filePath) {
  const lines = yaml.replaceAll("\r\n", "\n").split("\n");
  assertion(lines.some((line) => /^visual_map:\s*$/.test(line)), filePath, "metadata root visual_map is required");
  const metadata = {};
  let activeList = null;

  for (const line of lines) {
    const keyMatch = line.match(/^  ([a-z_]+):(?:\s*(.*))?$/);
    if (keyMatch) {
      const [, key, rawValue = ""] = keyMatch;
      assertion(!(key in metadata), filePath, `duplicate metadata field: ${key}`);
      if (rawValue === "") {
        metadata[key] = [];
        activeList = key;
      } else if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
        metadata[key] = parseInlineArray(rawValue);
        activeList = null;
      } else {
        metadata[key] = unquote(rawValue);
        activeList = null;
      }
      continue;
    }

    const listMatch = line.match(/^    -\s+(.+)$/);
    if (listMatch && activeList) {
      metadata[activeList].push(unquote(listMatch[1]));
    }
  }

  return metadata;
}

function extractProfileList(profile, key) {
  const match = profile.match(new RegExp(`^  ${key}:\\r?\\n((?:    - .+\\r?\\n)+)`, "m"));
  if (!match) throw new Error(`[VISUAL DOC] profile does not declare ${key}`);
  return [...match[1].matchAll(/^    - ["']?([^"'\r\n]+?)["']?\s*$/gm)].map(
    (item) => item[1],
  );
}

function extractSupportedTypes(profile) {
  const section = profile.match(/^map_types:\r?\n([\s\S]*?)^semantic_style_contract:/m);
  if (!section) throw new Error("[VISUAL DOC] profile map_types section is missing");
  return [...section[1].matchAll(/^  ([a-z]+):\s*$/gm)].map((match) => match[1]);
}

function extractRendererContract(profile) {
  const section = profile.match(/^renderer_contract:\r?\n([\s\S]*?)^metadata_contract:/m);
  if (!section) throw new Error("[VISUAL DOC] renderer_contract is missing");
  const read = (key) => {
    const match = section[1].match(new RegExp(`^  ${key}: ["']([^"']+)["']$`, "m"));
    if (!match) throw new Error(`[VISUAL DOC] renderer_contract.${key} is missing`);
    return match[1];
  };
  return {
    engine: read("engine"),
    version: read("version"),
    domEnvironment: read("dom_environment"),
    domVersion: read("dom_version"),
  };
}

function resolveRepoRef(sourceRef, filePath, templateMode) {
  if (templateMode && sourceRef.startsWith("TODO")) return;
  assertion(!path.isAbsolute(sourceRef), filePath, `source_ref must be repo-relative: ${sourceRef}`);
  assertion(!sourceRef.includes("\\"), filePath, `source_ref must use forward slashes: ${sourceRef}`);
  assertion(!sourceRef.split("/").includes(".."), filePath, `source_ref may not escape the repo: ${sourceRef}`);
  const resolved = path.resolve(ROOT, sourceRef);
  assertion(resolved.startsWith(`${ROOT}${path.sep}`), filePath, `source_ref escapes the repo: ${sourceRef}`);
  assertion(fs.existsSync(resolved), filePath, `source_ref does not exist: ${sourceRef}`);
  assertion(fs.statSync(resolved).isFile(), filePath, `source_ref must identify a file: ${sourceRef}`);
}

function resolveRequest(requestId) {
  for (const state of ["inbox", "planned", "queued", "running", "done", "rejected"]) {
    const directory = path.join(ROOT, "requests", state);
    if (!fs.existsSync(directory)) continue;
    const found = fs.readdirSync(directory).find((name) => name.startsWith(`${requestId}-`) && name.endsWith(".yaml"));
    if (found) return path.join(directory, found);
  }
  return null;
}

function resolvePlannedRequest(requestId) {
  const directory = path.join(ROOT, "requests", "planned");
  const found = fs
    .readdirSync(directory)
    .find((name) => name.startsWith(`${requestId}-`) && name.endsWith(".yaml"));
  return found ? path.join(directory, found) : null;
}

function resolveInitiative(initiativeId) {
  const directory = path.join(ROOT, "initiatives");
  const found = fs
    .readdirSync(directory)
    .find((name) => name.startsWith(`${initiativeId}-`) && name.endsWith(".yaml"));
  return found ? path.join(directory, found) : null;
}

function declaredDependencies(requestId) {
  const filePath = resolvePlannedRequest(requestId);
  if (!filePath) return [];
  const raw = fs.readFileSync(filePath, "utf8");
  const dependencies = new Set();
  for (const match of raw.matchAll(/(?:predecessors|predecessor_requests):\s*\[([^\]]*)\]/g)) {
    for (const id of uniqueMatches(match[1], REQUEST_ID)) dependencies.add(id);
  }
  for (const match of raw.matchAll(/blocker_request_id:\s*["']?(CR-[A-Z0-9]+-\d{4})["']?/g)) {
    dependencies.add(match[1]);
  }
  return [...dependencies];
}

function validateFlowchart(mermaid, filePath, fallback, templateMode) {
  const aliasToRequest = new Map();
  const labels = new Map();
  const edges = [];

  for (const line of mermaid.split(/\r?\n/)) {
    const node = line.match(/^\s*([A-Za-z][\w-]*)\s*\[(.+)\]\s*$/);
    if (node) {
      labels.set(node[1], node[2]);
      const request = node[2].match(/\bCR-[A-Z0-9]+-\d{4}\b/);
      if (request) aliasToRequest.set(node[1], request[0]);
    }

    const edge = line.match(
      /^\s*([A-Za-z][\w-]*)\s*(-->|-\.->|==>)\s*(?:\|([^|]+)\|)?\s*([A-Za-z][\w-]*)\s*$/,
    );
    if (edge) {
      const label = (edge[3] || "").replaceAll('"', "").trim();
      assertion(label.length > 0, filePath, "governance edge must have a text label");
      edges.push({ from: edge[1], to: edge[4], label });
    }
  }

  for (const line of mermaid.split(/\r?\n/)) {
    const classLine = line.match(/^\s*class\s+([\w,-]+)\s+([\w-]+)\s*$/);
    if (!classLine) continue;
    for (const alias of classLine[1].split(",")) {
      const label = labels.get(alias);
      assertion(label, filePath, `class references unknown node: ${alias}`);
      assertion(
        /\[(?:authoritative|confirmed|planned|running|blocked|validated|deprecated|partial|bounded|gate)\]/i.test(label),
        filePath,
        `node ${alias} needs a non-color status cue in its label`,
      );
    }
  }

  if (templateMode) return;
  for (const edge of edges) {
    const from = aliasToRequest.get(edge.from);
    const to = aliasToRequest.get(edge.to);
    if (!from || !to) continue;
    if (!/(prerequisite|baseline reutilizable|\bblocks\b|\bdepends on\b)/i.test(edge.label)) continue;
    const dependency = /\bdepends on\b/i.test(edge.label) ? to : from;
    const dependent = /\bdepends on\b/i.test(edge.label) ? from : to;
    assertion(
      declaredDependencies(dependent).includes(dependency),
      filePath,
      `${dependency} is not declared as predecessor of ${dependent}`,
    );
  }

  for (const requestId of aliasToRequest.values()) {
    assertion(fallback.includes(requestId), filePath, `fallback omits request identity: ${requestId}`);
  }
}

function validateMermaid(mermaid, filePath, fallback, templateMode, mapType) {
  const firstLine = mermaid.trim().split(/\r?\n/, 1)[0];
  assertion(
    /^(flowchart\s+(?:TD|TB|BT|LR|RL)|sequenceDiagram|erDiagram)$/.test(firstLine),
    filePath,
    `unsupported Mermaid declaration: ${firstLine}`,
  );
  const expectedDeclaration = {
    dependency: /^flowchart\s/,
    lifecycle: /^flowchart\s/,
    sequence: /^sequenceDiagram$/,
    data: /^erDiagram$/,
  }[mapType];
  assertion(expectedDeclaration.test(firstLine), filePath, `map type ${mapType} does not match ${firstLine}`);

  if (firstLine.startsWith("flowchart")) {
    validateFlowchart(mermaid, filePath, fallback, templateMode);
  }
  if (firstLine === "sequenceDiagram") {
    const messages = mermaid.split(/\r?\n/).filter((line) => /(?:->>|-->>|->|-->)\s*[^:]+:/.test(line));
    assertion(messages.length > 0, filePath, "sequence map needs at least one labeled message");
  }
  if (firstLine === "erDiagram") {
    const relations = mermaid.split(/\r?\n/).filter((line) => /\|\||\}o|o\{|\|o|o\|/.test(line));
    assertion(relations.length > 0, filePath, "data map needs at least one relationship");
    for (const relation of relations) {
      assertion(/:\s*["'][^"']+["']\s*$/.test(relation), filePath, "data relationship needs a text label");
    }
  }
}

function validateBlock(content, filePath, requiredFields, supportedTypes, templateMode) {
  const yamlFence = content.match(/```yaml\s*\r?\n([\s\S]*?)```/);
  const mermaidFence = content.match(/```mermaid\s*\r?\n([\s\S]*?)```/);
  assertion(yamlFence, filePath, "visual_map YAML block is required");
  assertion(mermaidFence, filePath, "Mermaid block is required");
  assertion(yamlFence.index < mermaidFence.index, filePath, "metadata must precede Mermaid");

  const afterMermaid = content.slice(mermaidFence.index + mermaidFence[0].length);
  const fallbackHeading = afterMermaid.match(/^#{2,6}\s+Fallback[^\r\n]*$/im);
  const fallbackFence = afterMermaid.match(/```text\s*\r?\n([\s\S]*?)```/);
  assertion(fallbackHeading, filePath, "textual fallback heading is required after Mermaid");
  assertion(fallbackFence, filePath, "textual fallback code block is required after Mermaid");
  assertion(fallbackHeading.index < fallbackFence.index, filePath, "fallback heading must precede fallback text");

  const metadata = parseVisualMetadata(yamlFence[1], filePath);
  for (const field of requiredFields) {
    assertion(field in metadata, filePath, `missing required metadata field: ${field}`);
  }
  assertion(metadata.schema_version === "1.0", filePath, "schema_version must be 1.0");
  assertion(
    (templateMode && metadata.id.startsWith("TODO-")) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.id),
    filePath,
    "id must be kebab-case",
  );
  assertion(supportedTypes.includes(metadata.type), filePath, `unsupported map type: ${metadata.type}`);
  assertion(typeof metadata.question === "string" && metadata.question.length > 10, filePath, "question is too short");
  assertion(
    typeof metadata.abstraction_level === "string" && metadata.abstraction_level.length > 4,
    filePath,
    "abstraction_level is too short",
  );
  assertion(Array.isArray(metadata.source_refs) && metadata.source_refs.length > 0, filePath, "source_refs must be non-empty");
  for (const sourceRef of metadata.source_refs) resolveRepoRef(sourceRef, filePath, templateMode);

  if (!templateMode) {
    assertion(/^\d{4}-\d{2}-\d{2}$/.test(metadata.observed_at), filePath, "observed_at must be an ISO calendar date");
    const observed = new Date(`${metadata.observed_at}T00:00:00Z`);
    assertion(
      !Number.isNaN(observed.getTime()) && observed.toISOString().slice(0, 10) === metadata.observed_at,
      filePath,
      "observed_at is invalid",
    );
  }
  assertion(
    typeof metadata.authority_boundary === "string" &&
      /(?:derivada|derived)/i.test(metadata.authority_boundary) &&
      /(?:autoridad|authority|conserva)/i.test(metadata.authority_boundary),
    filePath,
    "authority_boundary must identify a derived view and its authority",
  );
  assertion(metadata.textual_fallback_required === true, filePath, "textual_fallback_required must be true");

  const mermaid = mermaidFence[1].trim();
  const fallback = fallbackFence[1].trim();
  const requestIds = uniqueMatches(mermaid, REQUEST_ID);
  const initiativeIds = uniqueMatches(mermaid, INITIATIVE_ID);
  if (!templateMode) {
    for (const requestId of requestIds) {
      assertion(resolveRequest(requestId), filePath, `unknown request id in Mermaid: ${requestId}`);
    }
    for (const initiativeId of initiativeIds) {
      assertion(resolveInitiative(initiativeId), filePath, `unknown initiative id in Mermaid: ${initiativeId}`);
    }
    if (Array.isArray(metadata.request_ids)) {
      const declared = [...metadata.request_ids].sort();
      const observed = [...requestIds].sort();
      assertion(JSON.stringify(declared) === JSON.stringify(observed), filePath, "request_ids must match Mermaid identities exactly");
    }
    if (Array.isArray(metadata.initiative_ids)) {
      const declared = [...metadata.initiative_ids].sort();
      const observed = [...initiativeIds].sort();
      assertion(JSON.stringify(declared) === JSON.stringify(observed), filePath, "initiative_ids must match Mermaid identities exactly");
    }
    if (metadata.type === "dependency" && /(?:request|lifecycle)/i.test(metadata.abstraction_level)) {
      for (const requestId of requestIds) {
        assertion(
          metadata.source_refs.some((sourceRef) => path.basename(sourceRef).startsWith(`${requestId}-`)),
          filePath,
          `dependency map source_refs omit lifecycle for ${requestId}`,
        );
      }
    }
  }
  for (const identity of [...requestIds, ...initiativeIds]) {
    assertion(fallback.includes(identity), filePath, `fallback omits identity: ${identity}`);
  }
  validateMermaid(mermaid, filePath, fallback, templateMode, metadata.type);

  return { metadata, mermaid };
}

function validateDocument(filePath, contract, options = {}) {
  const raw = fs.readFileSync(filePath, "utf8");
  const startCount = raw.split(START_MARKER).length - 1;
  const endCount = raw.split(END_MARKER).length - 1;
  assertion(startCount === endCount, filePath, "unbalanced visual-map markers");
  assertion(startCount > 0, filePath, "no visual-map block found");

  const blocks = [];
  const ids = new Set();
  let cursor = 0;
  for (let index = 0; index < startCount; index += 1) {
    const start = raw.indexOf(START_MARKER, cursor);
    const end = raw.indexOf(END_MARKER, start + START_MARKER.length);
    assertion(start >= 0 && end > start, filePath, "visual-map markers are out of order");
    const previousHeading = raw.slice(0, start).match(/^#{1,6}\s+[^\r\n]+$/gm);
    assertion(previousHeading && previousHeading.length > 0, filePath, "visual map needs a strong section heading");
    const content = raw.slice(start + START_MARKER.length, end);
    const block = validateBlock(
        content,
        filePath,
        contract.requiredFields,
        contract.supportedTypes,
        options.templateMode,
      );
    assertion(!ids.has(block.metadata.id), filePath, `duplicate visual map id: ${block.metadata.id}`);
    ids.add(block.metadata.id);
    blocks.push(block);
    cursor = end + END_MARKER.length;
  }
  return blocks;
}

function activeDocuments() {
  const files = ["docs", "evidence", "templates"].flatMap((directory) =>
    walkMarkdown(path.join(ROOT, directory)),
  );
  return files.filter((filePath) => fs.readFileSync(filePath, "utf8").includes(START_MARKER));
}

async function createRenderer(moduleRoot, rendererContract) {
  assertion(path.isAbsolute(moduleRoot), PROFILE_PATH, "renderer module root must be absolute");
  const nodeModules = path.join(moduleRoot, "node_modules");
  const mermaidPackage = path.join(nodeModules, rendererContract.engine, "package.json");
  const domPackage = path.join(nodeModules, rendererContract.domEnvironment, "package.json");
  assertion(fs.existsSync(mermaidPackage), PROFILE_PATH, "pinned Mermaid package is missing");
  assertion(fs.existsSync(domPackage), PROFILE_PATH, "pinned jsdom package is missing");
  const mermaidVersion = JSON.parse(fs.readFileSync(mermaidPackage, "utf8")).version;
  const domVersion = JSON.parse(fs.readFileSync(domPackage, "utf8")).version;
  assertion(mermaidVersion === rendererContract.version, PROFILE_PATH, `Mermaid version drift: ${mermaidVersion}`);
  assertion(domVersion === rendererContract.domVersion, PROFILE_PATH, `jsdom version drift: ${domVersion}`);

  const { JSDOM } = await import(pathToFileURL(path.join(nodeModules, "jsdom", "lib", "api.js")).href);
  const dom = new JSDOM("<!doctype html><html><body></body></html>");
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
  globalThis.DOMParser = dom.window.DOMParser;
  globalThis.HTMLElement = dom.window.HTMLElement;
  globalThis.Element = dom.window.Element;
  globalThis.SVGElement = dom.window.SVGElement;
  if (!globalThis.SVGElement.prototype.getBBox) {
    globalThis.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 120, height: 30 });
  }
  if (!globalThis.SVGElement.prototype.getComputedTextLength) {
    globalThis.SVGElement.prototype.getComputedTextLength = () => 120;
  }

  const mermaid = (
    await import(pathToFileURL(path.join(nodeModules, "mermaid", "dist", "mermaid.esm.mjs")).href)
  ).default;
  mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });
  return async (diagram, id) => {
    await mermaid.parse(diagram, { suppressErrors: false });
    const result = await mermaid.render(id, diagram);
    if (!result.svg || !result.svg.includes("<svg")) throw new Error(`Mermaid render produced no SVG: ${id}`);
  };
}

async function runSelfTest(contract) {
  const manifestPath = path.join(FIXTURE_ROOT, "cases.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  let passed = 0;
  for (const testCase of manifest.cases) {
    const filePath = path.join(FIXTURE_ROOT, testCase.file);
    try {
      validateDocument(filePath, contract, { templateMode: false });
      assertion(testCase.result === "pass", filePath, "negative fixture unexpectedly passed");
    } catch (error) {
      if (testCase.result === "pass") throw error;
      assertion(
        error.message.includes(testCase.errorIncludes),
        filePath,
        `expected error containing '${testCase.errorIncludes}', got '${error.message}'`,
      );
    }
    passed += 1;
    console.log(`OK: fixture ${testCase.file}`);
  }
  console.log(`OK: ${passed} visual-documentation fixtures`);
}

async function main() {
  const profile = fs.readFileSync(PROFILE_PATH, "utf8");
  const contract = {
    requiredFields: extractProfileList(profile, "required_fields"),
    supportedTypes: extractSupportedTypes(profile),
    renderer: extractRendererContract(profile),
  };
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) {
    await runSelfTest(contract);
    return;
  }

  const rendererIndex = args.indexOf("--renderer-root");
  const rendererRoot = rendererIndex >= 0 ? args[rendererIndex + 1] : null;
  assertion(rendererIndex < 0 || rendererRoot, PROFILE_PATH, "--renderer-root requires an absolute path");
  const render = rendererRoot ? await createRenderer(path.resolve(rendererRoot), contract.renderer) : null;

  const documents = activeDocuments();
  assertion(documents.length > 0, PROFILE_PATH, "no adopted visual-map documents found");
  let mapCount = 0;
  for (const filePath of documents) {
    const templateMode = relative(filePath).startsWith("templates/visual-documentation/");
    const blocks = validateDocument(filePath, contract, { templateMode });
    if (render) {
      for (let index = 0; index < blocks.length; index += 1) {
        await render(blocks[index].mermaid, `visual-map-${mapCount}-${index}`);
      }
    }
    mapCount += blocks.length;
    console.log(`OK: ${relative(filePath)} validates ${blocks.length} visual map(s)`);
  }
  console.log(`Summary: ${documents.length} documents, ${mapCount} visual maps, 0 FAIL`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
