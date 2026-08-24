const {randomBytes, randomUUID} = require('node:crypto');
const http = require('node:http');
const https = require('node:https');

const baseUrl = (process.env.QA_BASE_URL || 'http://127.0.0.1:8088').replace(/\/$/, '');
const ttlSeconds = Number(process.env.QA_TEMPORARY_TTL_SECONDS || 120);
const ttlGraceSeconds = Number(process.env.QA_TTL_GRACE_SECONDS || 8);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, {method = 'GET', token, headers = {}, body} = {}) {
  const url = new URL(`${baseUrl}${path}`);
  const payload = body === undefined ? undefined : JSON.stringify(body);
  const response = await new Promise((resolve, reject) => {
    const transport = url.protocol === 'https:' ? https : http;
    const outgoing = transport.request(url, {
      method,
      headers: {
        ...(url.hostname === '127.0.0.1' ? {host: 'localhost'} : {}),
        accept: 'application/json',
        ...(payload === undefined ? {} : {'content-type': 'application/json', 'content-length': Buffer.byteLength(payload)}),
        ...(token ? {authorization: `Bearer ${token}`} : {}),
        ...headers,
      },
    }, (incoming) => {
      let text = '';
      incoming.setEncoding('utf8');
      incoming.on('data', (chunk) => { text += chunk; });
      incoming.on('end', () => resolve({status: incoming.statusCode, text}));
    });
    outgoing.on('error', reject);
    outgoing.end(payload);
  });
  const text = response.text;
  let json;
  try { json = text ? JSON.parse(text) : undefined; } catch { json = undefined; }
  return {status: response.status, json};
}

async function createIdentity(label) {
  const suffix = randomBytes(10).toString('hex');
  const email = `retention.${label}.${suffix}@example.invalid`;
  const password = `${randomBytes(24).toString('base64url')}-Qa1!`;
  const registration = await request('/api/auth/register', {
    method: 'POST',
    body: {name: `Synthetic Retention ${label}`, email, password, credential_version: 'raw-v2'},
  });
  assert(registration.status === 200, `${label} registration returned ${registration.status}`);
  return {email, password};
}

async function login(identity, label) {
  const response = await request('/api/auth/login', {
    method: 'POST',
    body: {...identity, credential_version: 'raw-v2'},
  });
  assert(response.status === 200, `${label} login returned ${response.status}`);
  assert(typeof response.json?.token === 'string', `${label} login omitted access token`);
  return response.json.token;
}

async function createTemporary(token, label) {
  const response = await request('/api/chat/conversations', {method: 'POST', token});
  assert(response.status === 201, `${label} create returned ${response.status}`);
  assert(typeof response.json?.id === 'string', `${label} create omitted id`);
  assert(response.json?.retentionMode === 'temporary', `${label} was not temporary`);
  return response.json.id;
}

async function list(token, mode) {
  const response = await request(`/api/chat/conversations?retention_mode=${mode}&limit=100`, {token});
  assert(response.status === 200, `list ${mode} returned ${response.status}`);
  assert(Array.isArray(response.json?.items), `list ${mode} omitted items`);
  return response.json.items;
}

async function main() {
  const results = [];
  const cleanup = [];
  let principalA;
  let principalB;
  let tokenA1;
  let tokenA2;
  let tokenB;

  try {
    principalA = await createIdentity('a');
    principalB = await createIdentity('b');
    [tokenA1, tokenA2, tokenB] = await Promise.all([
      login(principalA, 'a-session-1'),
      login(principalA, 'a-session-2'),
      login(principalB, 'b-session-1'),
    ]);

    const unauthenticated = await request('/api/chat/conversations');
    assert(unauthenticated.status === 401, `unauthenticated facade returned ${unauthenticated.status}`);
    results.push({row: 'facade-auth-gate', result: 'pass', status: 401});

    const temporaryId = await createTemporary(tokenA1, 'shared-temporary');
    cleanup.push({id: temporaryId, mode: 'temporary'});
    assert((await list(tokenA2, 'temporary')).some((item) => item.id === temporaryId), 'second active session cannot see temporary conversation');
    assert(!(await list(tokenB, 'temporary')).some((item) => item.id === temporaryId), 'foreign principal enumerated temporary conversation');
    results.push({row: 'temporary-multi-session', result: 'pass', shared_across_active_sessions: true});

    const foreignChecks = await Promise.all([
      request(`/api/chat/conversations/${temporaryId}/messages`, {token: tokenB}),
      request(`/api/chat/conversations/${temporaryId}/save`, {method: 'POST', token: tokenB, headers: {'idempotency-key': randomUUID()}}),
      request(`/api/chat/conversations/${temporaryId}/finish`, {method: 'POST', token: tokenB}),
      request(`/api/chat/conversations/${temporaryId}`, {method: 'DELETE', token: tokenB}),
    ]);
    assert(foreignChecks.every((entry) => entry.status === 404), `foreign operations returned ${foreignChecks.map((entry) => entry.status).join(',')}`);
    results.push({row: 'cross-principal-isolation', result: 'pass', operations: 4, statuses: foreignChecks.map((entry) => entry.status)});

    const prematureDelete = await request(`/api/chat/conversations/${temporaryId}`, {method: 'DELETE', token: tokenA1});
    assert(prematureDelete.status === 409, `temporary delete returned ${prematureDelete.status}`);
    const idempotencyKey = randomUUID();
    const saved1 = await request(`/api/chat/conversations/${temporaryId}/save`, {method: 'POST', token: tokenA1, headers: {'idempotency-key': idempotencyKey}});
    const saved2 = await request(`/api/chat/conversations/${temporaryId}/save`, {method: 'POST', token: tokenA2, headers: {'idempotency-key': idempotencyKey}});
    assert(saved1.status === 200 && saved2.status === 200, `save statuses ${saved1.status},${saved2.status}`);
    cleanup[cleanup.length - 1].mode = 'saved';
    assert(saved1.json?.conversation?.id === temporaryId && saved2.json?.conversation?.id === temporaryId, 'idempotent save changed identity');
    assert(saved1.json?.duplicate === false && saved2.json?.duplicate === true, 'idempotent save did not report first/duplicate outcomes');
    const tokenA3 = await login(principalA, 'a-future-session');
    assert((await list(tokenA3, 'saved')).some((item) => item.id === temporaryId), 'future session cannot list saved conversation');
    assert((await request(`/api/chat/conversations/${temporaryId}/messages`, {token: tokenA3})).status === 200, 'future session cannot read saved history');
    results.push({row: 'saved-durability', result: 'partial-pass', promotion_idempotent: true, future_session_read: true, redis_eviction: 'not-executed-no-product-contract'});

    const deleteResponse = await request(`/api/chat/conversations/${temporaryId}`, {method: 'DELETE', token: tokenA3});
    assert(deleteResponse.status === 204, `saved delete returned ${deleteResponse.status}`);
    cleanup.pop();
    const afterDelete = await Promise.all([
      request(`/api/chat/conversations/${temporaryId}/messages`, {token: tokenA1}),
      request(`/api/chat/conversations/${temporaryId}/messages`, {token: tokenA2}),
      request(`/api/chat/conversations/${temporaryId}/messages`, {token: tokenA3}),
    ]);
    assert(afterDelete.every((entry) => entry.status === 404), `post-delete reads returned ${afterDelete.map((entry) => entry.status).join(',')}`);
    assert(!(await list(tokenA3, 'saved')).some((item) => item.id === temporaryId), 'deleted conversation resurrected in list');
    results.push({row: 'delete-from-sst', result: 'pass', session_reads_after_delete: afterDelete.map((entry) => entry.status)});

    const finishId = await createTemporary(tokenA1, 'finish-temporary');
    cleanup.push({id: finishId, mode: 'temporary'});
    const finish = await request(`/api/chat/conversations/${finishId}/finish`, {method: 'POST', token: tokenA2});
    assert(finish.status === 204, `finish returned ${finish.status}`);
    cleanup.pop();
    assert((await request(`/api/chat/conversations/${finishId}/messages`, {token: tokenA1})).status === 404, 'finished temporary conversation remained readable');
    results.push({row: 'finish-temporary', result: 'partial-pass', volatile_http_state_removed: true, realtime_terminal_event: 'pending-browser'});

    const ttlId = await createTemporary(tokenA1, 'ttl-temporary');
    cleanup.push({id: ttlId, mode: 'temporary'});
    console.log(JSON.stringify({event: 'ttl-wait-start', seconds: ttlSeconds + ttlGraceSeconds, completed_rows: results.length}));
    await new Promise((resolve) => setTimeout(resolve, (ttlSeconds + ttlGraceSeconds) * 1000));
    const expired = await request(`/api/chat/conversations/${ttlId}/messages`, {token: tokenA2});
    assert(expired.status === 404, `expired temporary read returned ${expired.status}`);
    cleanup.pop();
    assert(!(await list(tokenA1, 'temporary')).some((item) => item.id === ttlId), 'expired temporary conversation remained enumerable');
    results.push({row: 'temporary-ttl', result: 'pass', future_session_status: expired.status, ttl_seconds: ttlSeconds});

    const localSurface = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1') || baseUrl.includes('[::1]');
    console.log(JSON.stringify({result: 'pass-with-explicit-partials', surface: localSurface ? 'localhost' : 'reserved-edge', rows: results}));
  } finally {
    if (tokenA1) {
      for (const item of cleanup.reverse()) {
        const path = `/api/chat/conversations/${item.id}${item.mode === 'temporary' ? '/finish' : ''}`;
        await request(path, {method: item.mode === 'temporary' ? 'POST' : 'DELETE', token: tokenA1}).catch(() => undefined);
      }
    }
    principalA = undefined;
    principalB = undefined;
    tokenA1 = undefined;
    tokenA2 = undefined;
    tokenB = undefined;
  }
}

main().catch((error) => {
  console.error(JSON.stringify({result: 'fail', message: error.message}));
  process.exitCode = 1;
});
