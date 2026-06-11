const { loadConfig } = require('./lib/config');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');
const { readFeatureStates, readNonDoneFeatureStates } = require('./lib/feature-state-reader');
const { buildIssuePayloads } = require('./lib/jira-payloads');
const { writeDryRunEvidence } = require('./lib/evidence');

const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
requireEvidenceArgs(args);
const config = applyEvidenceArgs(loadConfig(), args);
const allStates = readFeatureStates();
const nonDoneStates = readNonDoneFeatureStates();
const payloads = buildIssuePayloads(nonDoneStates, config);
const outputPath = writeDryRunEvidence(config, allStates.filter((state) => state.status !== 'done'), payloads);

console.log(`OK: Config source: ${config.source}`);
console.log(`OK: Jira board: ${config.jira.boardName}`);
console.log(`OK: Jira project key: ${config.jira.projectKey}`);
console.log(`OK: Issue type: ${config.jira.issueType}`);
console.log(`OK: Non-done feature states: ${nonDoneStates.length}`);
console.log(`OK: Dry-run evidence written: ${outputPath}`);
