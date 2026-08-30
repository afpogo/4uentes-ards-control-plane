#!/usr/bin/env node

const { createHash } = require('crypto');
const { writeFileSync } = require('fs');
const { resolve } = require('path');
const { spawnSync } = require('child_process');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function parseArguments(argv) {
  const options = {
    repos: [],
    governedWorktrees: new Set(),
    output: null,
    requestId: null,
    observedAt: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];

    if (argument === '--repo') {
      if (!value || !value.includes('=')) fail('--repo expects alias=absolute-path');
      const separator = value.indexOf('=');
      options.repos.push({ alias: value.slice(0, separator), path: value.slice(separator + 1) });
      index += 1;
    } else if (argument === '--governed-worktree') {
      if (!value) fail('--governed-worktree expects an absolute path');
      options.governedWorktrees.add(normalizePath(value));
      index += 1;
    } else if (argument === '--output') {
      options.output = value;
      index += 1;
    } else if (argument === '--request-id') {
      options.requestId = value;
      index += 1;
    } else if (argument === '--observed-at') {
      options.observedAt = value;
      index += 1;
    } else {
      fail(`unknown argument: ${argument}`);
    }
  }

  if (options.repos.length === 0) fail('at least one --repo is required');
  if (!options.output) fail('--output is required');
  if (!options.requestId) fail('--request-id is required');
  if (!options.observedAt) fail('--observed-at is required');
  return options;
}

function normalizePath(value) {
  return resolve(value).replaceAll('\\', '/');
}

function git(cwd, args, allowFailure = false) {
  const result = spawnSync('git', ['-C', cwd, ...args], {
    encoding: 'utf8',
    windowsHide: true,
  });

  if (result.status !== 0 && !allowFailure) {
    fail(`git ${args.join(' ')} failed in ${cwd}: ${(result.stderr || '').trim()}`);
  }

  return {
    ok: result.status === 0,
    stdout: (result.stdout || '').replaceAll('\r\n', '\n').trimEnd(),
  };
}

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function worktreeRecords(repoPath) {
  return git(repoPath, ['worktree', 'list', '--porcelain']).stdout
    .split(/\n\n+/)
    .filter(Boolean)
    .map((record) => {
      const fields = record.split('\n');
      const valueFor = (prefix) => {
        const line = fields.find((candidate) => candidate.startsWith(prefix));
        return line ? line.slice(prefix.length) : null;
      };
      return {
        path: normalizePath(valueFor('worktree ')),
        listedHead: valueFor('HEAD '),
        listedBranch: (valueFor('branch ') || 'DETACHED').replace(/^refs\/heads\//, ''),
        prunableReason: valueFor('prunable '),
      };
    });
}

function inspectWorktree(repository, record, governedWorktrees) {
  const worktreePath = record.path;
  if (record.prunableReason) {
    return {
      repository,
      worktree_path: worktreePath,
      head_sha: record.listedHead,
      branch: record.listedBranch,
      dirty: null,
      status_entry_count: null,
      sanitized_status_sha256: null,
      registration_state: 'prunable-path-unavailable',
      prunable_reason: record.prunableReason,
      disposition: 'preserve-registration-pending-explicit-review',
    };
  }

  const head = git(worktreePath, ['rev-parse', 'HEAD']).stdout;
  const branchResult = git(worktreePath, ['symbolic-ref', '-q', 'HEAD'], true);
  const branch = branchResult.ok
    ? branchResult.stdout.replace(/^refs\/heads\//, '')
    : 'DETACHED';
  const status = git(worktreePath, ['status', '--porcelain=v1', '--untracked-files=normal']).stdout;
  const statusEntries = status === '' ? 0 : status.split('\n').length;
  const governedSupport = governedWorktrees.has(worktreePath);
  const dirty = statusEntries > 0;

  return {
    repository,
    worktree_path: worktreePath,
    head_sha: head,
    branch,
    dirty,
    status_entry_count: statusEntries,
    sanitized_status_sha256: sha256(status),
    registration_state: 'available',
    disposition: dirty
      ? 'quarantine-preserve'
      : governedSupport
        ? 'governed-support-preserve-until-readback'
        : 'preserve-pending-explicit-disposition',
  };
}

const options = parseArguments(process.argv.slice(2));
const seen = new Set();
const worktrees = [];

for (const repository of options.repos) {
  for (const record of worktreeRecords(repository.path)) {
    const key = record.path.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    worktrees.push(inspectWorktree(repository.alias, record, options.governedWorktrees));
  }
}

worktrees.sort((left, right) =>
  left.repository.localeCompare(right.repository) ||
  left.worktree_path.localeCompare(right.worktree_path),
);

const governedSupportCount = worktrees.filter((item) =>
  item.disposition === 'governed-support-preserve-until-readback',
).length;
const dirtyCount = worktrees.filter((item) => item.dirty).length;
const unavailableCount = worktrees.filter((item) => item.registration_state !== 'available').length;
const manifest = {
  schema_version: '1.0',
  kind: 'sanitized_worktree_inventory',
  request_id: options.requestId,
  observed_at: options.observedAt,
  privacy_boundary: {
    status_paths_published: false,
    file_contents_read: false,
    file_contents_published: false,
    hash_input: 'git status --porcelain=v1 --untracked-files=normal output',
  },
  summary: {
    total_worktrees: worktrees.length,
    preexisting_worktrees: worktrees.length - governedSupportCount,
    governed_support_worktrees: governedSupportCount,
    dirty_worktrees: dirtyCount,
    clean_worktrees: worktrees.length - dirtyCount - unavailableCount,
    unavailable_registrations: unavailableCount,
  },
  repository_summary: options.repos.map(({ alias }) => {
    const repositoryWorktrees = worktrees.filter((item) => item.repository === alias);
    return {
      repository: alias,
      worktrees: repositoryWorktrees.length,
      dirty: repositoryWorktrees.filter((item) => item.dirty).length,
      unavailable_registrations: repositoryWorktrees.filter(
        (item) => item.registration_state !== 'available',
      ).length,
    };
  }),
  worktrees,
};

const canonicalJson = JSON.stringify(manifest);
manifest.sanitized_manifest_sha256 = sha256(canonicalJson);
writeFileSync(options.output, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  output: normalizePath(options.output),
  ...manifest.summary,
  sanitized_manifest_sha256: manifest.sanitized_manifest_sha256,
}));
