const {randomBytes, randomUUID} = require('node:crypto');
const http = require('node:http');
const {io} = require(process.env.QA_SOCKET_IO_CLIENT || 'socket.io-client');

const baseUrl = (process.env.QA_BASE_URL || 'http://127.0.0.1:8088').replace(/\/$/, '');
const socketPath = process.env.QA_SOCKET_PATH || '/4uentes/realtime/socket.io';
const terminalEvent = 'chat:conversation:terminated';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, {method = 'GET', token, headers = {}, body} = {}) {
  const url = new URL(`${baseUrl}${path}`);
  const payload = body === undefined ? undefined : JSON.stringify(body);
  const response = await new Promise((resolve, reject) => {
    const outgoing = http.request(
      url,
      {
        method,
        headers: {
          host: 'localhost',
          accept: 'application/json',
          ...(payload === undefined ? {} : {'content-type': 'application/json', 'content-length': Buffer.byteLength(payload)}),
          ...(token ? {authorization: `Bearer ${token}`} : {}),
          ...headers,
        },
      },
      (incoming) => {
        let text = '';
        incoming.setEncoding('utf8');
        incoming.on('data', (chunk) => {
          text += chunk;
        });
        incoming.on('end', () => resolve({status: incoming.statusCode, text}));
      }
    );
    outgoing.on('error', reject);
    outgoing.end(payload);
  });
  let json;
  try {
    json = response.text ? JSON.parse(response.text) : undefined;
  } catch {
    json = undefined;
  }
  return {status: response.status, json};
}

function waitFor(socket, event, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(event, handler);
      reject(new Error(`${event} timeout`));
    }, timeoutMs);
    const handler = (payload) => {
      clearTimeout(timer);
      socket.off(event, handler);
      resolve(payload);
    };
    socket.on(event, handler);
  });
}

function emitAck(socket, event, payload, timeoutMs = 10_000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${event} ack timeout`)), timeoutMs);
    socket.emit(event, payload, (ack) => {
      clearTimeout(timer);
      resolve(ack);
    });
  });
}

function socketOptions(token) {
  return {
    path: socketPath,
    auth: {token},
    transports: ['websocket'],
    reconnection: false,
    timeout: 8_000,
    extraHeaders: {Host: 'localhost'},
  };
}

function assertTerminalPayload(payload, conversationId, reason) {
  assert(payload && typeof payload === 'object', 'terminal event omitted payload');
  assert(payload.conversationId === conversationId, 'terminal event conversationId mismatch');
  assert(payload.reason === reason, 'terminal event reason mismatch');
  assert(
    JSON.stringify(Object.keys(payload).sort()) === JSON.stringify(['conversationId', 'reason']),
    'terminal event exposed fields outside the allowlist'
  );
}

async function createConversation(token) {
  const response = await request('/api/chat/conversations', {method: 'POST', token});
  assert(response.status === 201 && typeof response.json?.id === 'string', `conversation create returned ${response.status}`);
  return response.json.id;
}

async function join(socket, conversationId) {
  const resumed = waitFor(socket, 'chat:session:resumed', 10_000);
  const ack = await emitAck(socket, 'chat:join', {conversation_id: conversationId, last_seen_sequence: 0});
  assert(ack?.ok, `chat:join failed with ${ack?.code || 'unknown'}`);
  await resumed;
}

async function assertCannotRejoin(socket, conversationId) {
  const ack = await emitAck(socket, 'chat:join', {conversation_id: conversationId, last_seen_sequence: 0});
  assert(ack?.ok === false && ack?.code === 'conversation_not_found', 'terminated conversation unexpectedly rejoined');
}

async function runTemporaryFinish({token1, token2, socket1, socket2, cleanup}) {
  const conversationId = await createConversation(token1);
  cleanup.push({id: conversationId, mode: 'temporary'});
  await Promise.all([join(socket1, conversationId), join(socket2, conversationId)]);

  const received1 = [];
  const received2 = [];
  const onTerminal1 = (payload) => received1.push(payload);
  const onTerminal2 = (payload) => received2.push(payload);
  socket1.on(terminalEvent, onTerminal1);
  socket2.on(terminalEvent, onTerminal2);
  const terminal1 = waitFor(socket1, terminalEvent, 10_000);
  const terminal2 = waitFor(socket2, terminalEvent, 10_000);
  const finish = await request(`/api/chat/conversations/${conversationId}/finish`, {method: 'POST', token: token1});
  assert(finish.status === 204, `finish returned ${finish.status}`);
  const [payload1, payload2] = await Promise.all([terminal1, terminal2]);
  assertTerminalPayload(payload1, conversationId, 'temporary_finished');
  assertTerminalPayload(payload2, conversationId, 'temporary_finished');
  await new Promise((resolve) => setTimeout(resolve, 300));
  assert(received1.length === 1 && received2.length === 1, 'temporary termination was not single-delivery per active socket');
  assert((await request(`/api/chat/conversations/${conversationId}/messages`, {token: token2})).status === 404, 'finished conversation remained readable');
  await Promise.all([assertCannotRejoin(socket1, conversationId), assertCannotRejoin(socket2, conversationId)]);
  cleanup.pop();
  socket1.off(terminalEvent, onTerminal1);
  socket2.off(terminalEvent, onTerminal2);
  return {row: 'finish-temporary-terminal', result: 'pass', active_sessions: 2, delivery_per_session: 1, history_status: 404};
}

async function runSavedDeleteRace({token1, token2, socket1, socket2, cleanup}) {
  const conversationId = await createConversation(token1);
  cleanup.push({id: conversationId, mode: 'temporary'});
  const saved = await request(`/api/chat/conversations/${conversationId}/save`, {
    method: 'POST',
    token: token1,
    headers: {'idempotency-key': randomUUID()},
  });
  assert(saved.status === 200, `save returned ${saved.status}`);
  cleanup[cleanup.length - 1].mode = 'saved';
  await Promise.all([join(socket1, conversationId), join(socket2, conversationId)]);

  const received1 = [];
  const received2 = [];
  const completed = [];
  const onTerminal1 = (payload) => received1.push({payload, at: Date.now()});
  const onTerminal2 = (payload) => received2.push({payload, at: Date.now()});
  const onCompleted = () => completed.push(Date.now());
  socket1.on(terminalEvent, onTerminal1);
  socket2.on(terminalEvent, onTerminal2);
  socket1.on('chat:assistant:completed', onCompleted);
  socket2.on('chat:assistant:completed', onCompleted);

  const accepted = waitFor(socket1, 'chat:message:accepted', 15_000);
  const turnAck = emitAck(
    socket1,
    'chat:message',
    {
      conversation_id: conversationId,
      client_message_id: randomUUID(),
      correlation_id: randomUUID(),
      text: `synthetic-retention-race-${randomBytes(6).toString('hex')}`,
    },
    90_000
  );
  await accepted;
  assert(completed.length === 0, 'assistant completed before the active-turn race could be exercised');

  const terminal1 = waitFor(socket1, terminalEvent, 15_000);
  const terminal2 = waitFor(socket2, terminalEvent, 15_000);
  const deletion = await request(`/api/chat/conversations/${conversationId}`, {method: 'DELETE', token: token2});
  assert(deletion.status === 204, `saved delete returned ${deletion.status}`);
  const [payload1, payload2, ack] = await Promise.all([terminal1, terminal2, turnAck]);
  assertTerminalPayload(payload1, conversationId, 'saved_deleted');
  assertTerminalPayload(payload2, conversationId, 'saved_deleted');
  assert(ack?.ok === false, 'active turn unexpectedly completed successfully after deletion');
  await new Promise((resolve) => setTimeout(resolve, 750));
  assert(received1.length === 1 && received2.length === 1, 'saved deletion was not single-delivery per active socket');
  assert(completed.length === 0, 'assistant completion was emitted after the terminal fence');
  assert((await request(`/api/chat/conversations/${conversationId}/messages`, {token: token1})).status === 404, 'deleted conversation history resurrected');
  const listed = await request('/api/chat/conversations?retention_mode=saved&limit=100', {token: token2});
  assert(listed.status === 200 && Array.isArray(listed.json?.items), `saved list returned ${listed.status}`);
  assert(!listed.json.items.some((item) => item.id === conversationId), 'deleted conversation resurrected in saved list');
  await Promise.all([assertCannotRejoin(socket1, conversationId), assertCannotRejoin(socket2, conversationId)]);
  cleanup.pop();
  socket1.off(terminalEvent, onTerminal1);
  socket2.off(terminalEvent, onTerminal2);
  socket1.off('chat:assistant:completed', onCompleted);
  socket2.off('chat:assistant:completed', onCompleted);
  return {
    row: 'delete-saved-active-turn-race',
    result: 'pass',
    active_sessions: 2,
    active_turn_cancelled: true,
    assistant_completion_after_fence: false,
    delivery_per_session: 1,
    history_status: 404,
    list_resurrection: false,
  };
}

async function main() {
  const suffix = randomBytes(10).toString('hex');
  const identity = {
    email: `retention.realtime.${suffix}@example.invalid`,
    password: `${randomBytes(24).toString('base64url')}-Qa1!`,
  };
  const cleanup = [];
  let token1;
  let token2;
  let socket1;
  let socket2;
  try {
    const registration = await request('/api/auth/register', {
      method: 'POST',
      body: {name: 'Synthetic Retention Realtime', ...identity, credential_version: 'raw-v2'},
    });
    assert(registration.status === 200, `registration returned ${registration.status}`);
    const loginBody = {...identity, credential_version: 'raw-v2'};
    const [login1, login2] = await Promise.all([
      request('/api/auth/login', {method: 'POST', body: loginBody}),
      request('/api/auth/login', {method: 'POST', body: loginBody}),
    ]);
    assert(login1.status === 200 && login2.status === 200, `login statuses ${login1.status},${login2.status}`);
    token1 = login1.json?.token;
    token2 = login2.json?.token;
    assert(token1 && token2, 'login omitted token');

    socket1 = io(`${baseUrl}/sst-chat/v1`, socketOptions(token1));
    socket2 = io(`${baseUrl}/sst-chat/v1`, socketOptions(token2));
    await Promise.all([waitFor(socket1, 'connect', 10_000), waitFor(socket2, 'connect', 10_000)]);

    const rows = [];
    rows.push(await runTemporaryFinish({token1, token2, socket1, socket2, cleanup}));
    rows.push(await runSavedDeleteRace({token1, token2, socket1, socket2, cleanup}));
    console.log(JSON.stringify({result: 'pass', surface: 'localhost', event: terminalEvent, payload_fields: ['conversationId', 'reason'], rows}));
  } finally {
    if (token1) {
      for (const item of cleanup.reverse()) {
        const path = `/api/chat/conversations/${item.id}${item.mode === 'temporary' ? '/finish' : ''}`;
        await request(path, {method: item.mode === 'temporary' ? 'POST' : 'DELETE', token: token1}).catch(() => undefined);
      }
    }
    socket1?.disconnect();
    socket2?.disconnect();
    identity.email = undefined;
    identity.password = undefined;
    token1 = undefined;
    token2 = undefined;
  }
}

main().catch((error) => {
  console.error(JSON.stringify({result: 'fail', message: error.message}));
  process.exitCode = 1;
});
