const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const FEATURE_DIR = path.join(ROOT, 'state', 'features');

function readFeatureStates() {
  return fs
    .readdirSync(FEATURE_DIR)
    .filter((file) => file.endsWith('.current.yaml'))
    .map((file) => {
      const fullPath = path.join(FEATURE_DIR, file);
      const text = fs.readFileSync(fullPath, 'utf8');
      return {
        file: path.relative(ROOT, fullPath).replace(/\\/g, '/'),
        id: topLevel(text, 'id'),
        title: topLevel(text, 'title'),
        status: topLevel(text, 'status'),
        updatedAt: topLevel(text, 'updated_at'),
        affectedServices: listUnder(text, 'affected_services'),
        requestIds: listUnder(text, 'request_ids'),
        capabilityRefs: listUnder(text, 'capability_refs'),
        specRefs: listUnder(text, 'spec_refs'),
        evidenceRefs: listUnder(text, 'evidence_refs'),
        validationRefs: listUnder(text, 'validation_refs'),
        openGaps: listUnder(text, 'open_gaps'),
      };
    });
}

function readNonDoneFeatureStates() {
  return readFeatureStates()
    .filter((state) => state.status !== 'done')
    .sort(compareFeatureStates);
}

function compareFeatureStates(left, right) {
  const leftRank = statusRank(left.status);
  const rightRank = statusRank(right.status);
  if (leftRank !== rightRank) return leftRank - rightRank;

  if (left.openGaps.length !== right.openGaps.length) {
    return right.openGaps.length - left.openGaps.length;
  }

  if (left.affectedServices.length !== right.affectedServices.length) {
    return right.affectedServices.length - left.affectedServices.length;
  }

  return left.id.localeCompare(right.id);
}

function statusRank(status) {
  const order = [
    'runtime-partial',
    'implemented-local',
    'ards-documented',
    'validated-local',
    'validated-live',
  ];
  const index = order.indexOf(status);
  return index === -1 ? order.length : index;
}

function topLevel(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)\\s*$`, 'm'));
  return match ? strip(match[1]) : null;
}

function listUnder(text, section) {
  const inline = text.match(new RegExp(`^${section}:\\s*\\[(.*)\\]\\s*$`, 'm'));
  if (inline) {
    const body = inline[1].trim();
    if (!body) return [];
    return body.split(',').map((item) => strip(item.trim())).filter(Boolean);
  }

  const lines = text.split(/\r?\n/);
  const values = [];
  let inSection = false;

  for (const line of lines) {
    if (line.startsWith(`${section}:`)) {
      inSection = true;
      continue;
    }
    if (!inSection) continue;
    if (/^[A-Za-z0-9_-]+:/.test(line)) break;

    const match = line.match(/^\s+-\s+(.+)\s*$/);
    if (match) values.push(strip(match[1]));
  }

  return values;
}

function strip(value) {
  return value.replace(/^['"]|['"]$/g, '').trim();
}

module.exports = {
  readFeatureStates,
  readNonDoneFeatureStates,
};
