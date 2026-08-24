const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const RULE_ID = "execution-publication-and-tracker-closure-rule";
const SPEC = "specs/requests/execution-publication-rule.yaml";
const DOC = "docs/requests/execution-publication-rule.md";
const STATES = ["planned", "queued", "running", "done", "rejected"];

function rootBlock(text) {
  const lines = text.replaceAll("\r\n", "\n").split("\n");
  const start = lines.findIndex((line) => line.trim() === "execution_publication_rule:");
  if (start === -1) return null;
  const collected = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line && !/^\s/.test(line)) break;
    collected.push(line);
  }
  return collected.join("\n");
}

function nestedBlock(block, key) {
  const lines = block.split("\n");
  const start = lines.findIndex((line) => line.trim() === `${key}:` && /^  \S/.test(line));
  if (start === -1) return null;
  const collected = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^  \S/.test(line)) break;
    collected.push(line);
  }
  return collected.join("\n");
}

function hasValue(block, key, value) {
  return new RegExp(`^\\s+${key}:\\s+["']?${value}["']?\\s*$`, "m").test(block || "");
}

function validateAdoption(text, state, file = "fixture.yaml") {
  const errors = [];
  const block = rootBlock(text);
  if (!block) return errors;

  const fail = (message) => errors.push(`${file}: ${message}`);
  if (!hasValue(block, "rule_id", RULE_ID)) fail(`rule_id must be ${RULE_ID}`);
  if (!hasValue(block, "adoption_status", "trial") && !hasValue(block, "adoption_status", "adopted")) fail("adoption_status must be trial or adopted");

  const git = nestedBlock(block, "git_publication");
  const tracker = nestedBlock(block, "tracker_mirror");
  const cleanup = nestedBlock(block, "cleanup");
  if (!git) fail("git_publication block is required");
  if (!tracker) fail("tracker_mirror block is required");
  if (!cleanup) fail("cleanup block is required");

  if (git) {
    if (!hasValue(git, "applicable", "true") && !hasValue(git, "applicable", "false")) fail("git_publication.applicable must be boolean");
    if (!hasValue(git, "plan_merge_required", "true")) fail("git_publication.plan_merge_required must be true");
    if (!hasValue(git, "terminal_merge_required", "true")) fail("git_publication.terminal_merge_required must be true");
  }
  if (tracker) {
    const applicable = hasValue(tracker, "applicable", "true");
    const notApplicable = hasValue(tracker, "applicable", "false");
    if (!applicable && !notApplicable) fail("tracker_mirror.applicable must be boolean");
    if (applicable && !/^    provider:\s+["']?.+[^"'\s]["']?\s*$/m.test(tracker)) fail("tracker_mirror true requires provider");
    if (notApplicable && !/^    not_applicable_reason:\s+["']?.+[^"'\s]["']?\s*$/m.test(tracker)) {
      fail("tracker_mirror false requires not_applicable_reason");
    }
  }
  if (cleanup && !hasValue(cleanup, "remote_readback_required", "true")) fail("cleanup.remote_readback_required must be true");

  if (state === "done") {
    const result = nestedBlock(block, "trial_result");
    if (!result) {
      fail("done adoption requires trial_result");
    } else {
      const required = [
        ["status", "passed"],
        ["plan_publication", "merged-and-read-back"],
        ["implementation_publication", "merged-and-read-back|not-applicable"],
        ["tracker_reconciliation", "merged-and-read-back|not-applicable"],
        ["terminal_publication_contract", "merge-and-readback-before-cleanup"],
        ["cleanup_gate", "remote-readback-required"],
      ];
      for (const [key, values] of required) {
        if (!new RegExp(`^\\s+${key}:\\s+["']?(?:${values})["']?\\s*$`, "m").test(result)) fail(`trial_result.${key} is invalid or missing`);
      }
    }
  }
  return errors;
}

function selfTest() {
  const common = `execution_publication_rule:\n  rule_id: "${RULE_ID}"\n  adoption_status: "trial"\n  git_publication:\n    applicable: true\n    plan_merge_required: true\n    terminal_merge_required: true\n  tracker_mirror:\n    applicable: false\n    not_applicable_reason: "no tracker mapping"\n  cleanup:\n    remote_readback_required: true\n`;
  const validDone = `${common}  trial_result:\n    status: "passed"\n    plan_publication: "merged-and-read-back"\n    implementation_publication: "not-applicable"\n    tracker_reconciliation: "not-applicable"\n    terminal_publication_contract: "merge-and-readback-before-cleanup"\n    cleanup_gate: "remote-readback-required"\n`;
  const cases = [
    ["valid-running", common, "running", 0],
    ["valid-adopted-running", common.replace('adoption_status: "trial"', 'adoption_status: "adopted"'), "running", 0],
    ["invalid-cleanup", common.replace("remote_readback_required: true", "remote_readback_required: false"), "running", 1],
    ["invalid-tracker-reason", common.replace('    not_applicable_reason: "no tracker mapping"\n', ""), "running", 1],
    ["invalid-tracker-provider", common.replace('    applicable: false\n    not_applicable_reason: "no tracker mapping"', "    applicable: true"), "running", 1],
    ["valid-done", validDone, "done", 0],
    ["invalid-done", common, "done", 1],
  ];
  for (const [name, text, state, minimumErrors] of cases) {
    const errors = validateAdoption(text, state, name);
    if (minimumErrors === 0 && errors.length !== 0) throw new Error(`${name} should pass: ${errors.join("; ")}`);
    if (minimumErrors > 0 && errors.length < minimumErrors) throw new Error(`${name} should fail`);
  }
  console.log(`PASS ${RULE_ID} self-test: ${cases.length} positive/negative cases`);
}

function verifySurfaces() {
  const errors = [];
  const required = [SPEC, DOC, "docs/requests/execution-model.md", "docs/requests/README.md", "AGENTS.md", "package.json"];
  for (const relative of required) if (!fs.existsSync(path.join(ROOT, relative))) errors.push(`missing surface: ${relative}`);
  if (errors.length) return errors;
  const spec = fs.readFileSync(path.join(ROOT, SPEC), "utf8");
  const doc = fs.readFileSync(path.join(ROOT, DOC), "utf8");
  const execution = fs.readFileSync(path.join(ROOT, "docs/requests/execution-model.md"), "utf8");
  const readme = fs.readFileSync(path.join(ROOT, "docs/requests/README.md"), "utf8");
  const agents = fs.readFileSync(path.join(ROOT, "AGENTS.md"), "utf8");
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  if (!spec.includes(`id: "${RULE_ID}"`) || !spec.includes('status: "active-local-enforcement"')) errors.push("machine spec must declare active local enforcement");
  if (!spec.includes('id: "execution-publication-and-tracker-closure-policy"')) errors.push("machine spec must map to the canonical Core policy");
  for (const section of ["## Secuencia obligatoria", "## Cierre finito", "## Aplicabilidad y excepciones", "## Promoción canónica"]) {
    if (!doc.includes(section)) errors.push(`${DOC} missing section: ${section}`);
  }
  if (!execution.includes("execution-publication-rule.md")) errors.push("execution model does not link the rule");
  if (!readme.includes("execution-publication-rule.md")) errors.push("requests README does not link the rule");
  if (!agents.includes(SPEC)) errors.push("AGENTS.md does not expose the experimental rule");
  const command = "node scripts/verify-execution-publication-rule.js";
  if (pkg.scripts?.["check:execution-publication"] !== command) errors.push("focused package script is missing");
  if (!pkg.scripts?.check?.includes(command)) errors.push("full npm check does not enforce the rule");
  return errors;
}

function scanOptedIn() {
  const errors = [];
  const records = new Map();
  let filesChecked = 0;
  for (const state of STATES) {
    const directory = path.join(ROOT, "requests", state);
    if (!fs.existsSync(directory)) continue;
    for (const name of fs.readdirSync(directory).filter((item) => item.endsWith(".yaml"))) {
      const file = path.join(directory, name);
      const text = fs.readFileSync(file, "utf8");
      if (!text.includes(`rule_id: "${RULE_ID}"`)) continue;
      filesChecked += 1;
      errors.push(...validateAdoption(text, state, path.relative(ROOT, file).replaceAll("\\", "/")));
      const requestId = text.match(/^id:\s+["']?(CR-[A-Z0-9]+-\d{4})["']?\s*$/m)?.[1];
      if (!requestId) {
        errors.push(`${path.relative(ROOT, file)}: opted-in lifecycle requires a valid request id`);
      } else {
        if (!records.has(requestId)) records.set(requestId, []);
        records.get(requestId).push(state);
      }
    }
  }
  for (const [requestId, states] of records) {
    if (!states.includes("planned")) errors.push(`${requestId}: opted-in lifecycle requires a planned artifact`);
    const executionStates = states.filter((state) => state !== "planned");
    if (executionStates.length !== 1) errors.push(`${requestId}: expected exactly one execution state, observed ${executionStates.join(", ") || "none"}`);
  }
  return { errors, filesChecked };
}

if (process.argv.includes("--self-test")) {
  selfTest();
} else {
  const surfaceErrors = verifySurfaces();
  const { errors: adoptionErrors, filesChecked } = scanOptedIn();
  const errors = [...surfaceErrors, ...adoptionErrors];
  for (const error of errors) console.error(`FAIL: ${error}`);
  if (errors.length) process.exit(1);
  console.log(`OK: ${RULE_ID} validates ${filesChecked} opted-in lifecycle files`);
  console.log("Summary: 1 OK, 0 WARN, 0 FAIL");
}
