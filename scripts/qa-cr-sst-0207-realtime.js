const {randomBytes, randomUUID} = require('node:crypto');
const http = require('node:http');
const {io} = require(process.env.QA_SOCKET_IO_CLIENT || 'socket.io-client');

const baseUrl = (process.env.QA_BASE_URL || 'http://127.0.0.1:8088').replace(/\/$/, '');
const socketPath = process.env.QA_SOCKET_PATH || '/4uentes/realtime/socket.io';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, {method = 'GET', token, headers = {}, body} = {}) {
  const url = new URL(`${baseUrl}${path}`);
  const payload = body === undefined ? undefined : JSON.stringify(body);
  const response = await new Promise((resolve, reject) => {
    const outgoing = http.request(url, {
      method,
      headers: {
        host: 'localhost',
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
  let json;
  try { json = response.text ? JSON.parse(response.text) : undefined; } catch { json = undefined; }
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

async function main() {
  const suffix = randomBytes(10).toString('hex');
  const identity = {
    email: `retention.realtime.${suffix}@example.invalid`,
    password: `${randomBytes(24).toString('base64url')}-Qa1!`,
  };
  const registration = await request('/api/auth/register', {method: 'POST', body: {name: 'Synthetic Retention Realtime', ...identity, credential_version: 'raw-v2'}});
  assert(registration.status === 200, `registration returned ${registration.status}`);
  const loginBody = {...identity, credential_version: 'raw-v2'};
  const [login1, login2] = await Promise.all([
    request('/api/auth/login', {method: 'POST', body: loginBody}),
    request('/api/auth/login', {method: 'POST', body: loginBody}),
  ]);
  assert(login1.status === 200 && login2.status === 200, `login statuses ${login1.status},${login2.status}`);
  const token1 = login1.json?.token;
  const token2 = login2.json?.token;
  assert(token1 && token2, 'login omitted token');
  const created = await request('/api/chat/conversations', {method: 'POST', token: token1});
  assert(created.status === 201 && created.json?.id, `create returned ${created.status}`);
  const conversationId = created.json.id;
  const seen1 = [];
  const seen2 = [];
  const options = (token) => ({
    path: socketPath,
    auth: {token},
    transports: ['websocket'],
    reconnection: false,
    timeout: 8_000,
    extraHeaders: {Host: 'localhost'},
  });
  const socket1 = io(`${baseUrl}/sst-chat/v1`, options(token1));
  const socket2 = io(`${baseUrl}/sst-chat/v1`, options(token2));
  socket1.onAny((event) => seen1.push(event));
  socket2.onAny((event) => seen2.push(event));
  try {
    await Promise.all([waitFor(socket1, 'connect', 10_000), waitFor(socket2, 'connect', 10_000)]);
    const joins = await Promise.all([
      emitAck(socket1, 'chat:join', {conversation_id: conversationId, last_seen_sequence: 0}),
      emitAck(socket2, 'chat:join', {conversation_id: conversationId, last_seen_sequence: 0}),
    ]);
    assert(joins.every((ack) => ack?.ok), `join failed ${JSON.stringify(joins)}`);

    const completion = waitFor(socket1, 'chat:assistant:completed', 90_000);
    const messageAck = await emitAck(socket1, 'chat:message', {
      conversation_id: conversationId,
      client_message_id: randomUUID(),
      correlation_id: randomUUID(),
      text: `synthetic-retention-turn-${randomBytes(6).toString('hex')}`,
    }, 90_000);
    assert(messageAck?.ok, `message failed ${messageAck?.code || 'unknown'}`);
    await completion;

    const resumed = waitFor(socket2, 'chat:session:resumed', 10_000);
    const replayAck = await emitAck(socket2, 'chat:join', {conversation_id: conversationId, last_seen_sequence: 0});
    assert(replayAck?.ok, `replay join failed ${replayAck?.code || 'unknown'}`);
    const replay = await resumed;
    const replayTypes = Array.isArray(replay?.events) ? replay.events.map((event) => event.type) : [];
    assert(replayTypes.includes('chat:message:accepted') && replayTypes.includes('chat:assistant:completed'), 'second session did not recover the completed turn');

    const beforeFinish1 = seen1.length;
    const beforeFinish2 = seen2.length;
    const finish = await request(`/api/chat/conversations/${conversationId}/finish`, {method: 'POST', token: token1});
    assert(finish.status === 204, `finish returned ${finish.status}`);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const afterFinishEvents = [...seen1.slice(beforeFinish1), ...seen2.slice(beforeFinish2)];
    const terminalEvents = afterFinishEvents.filter((event) => /finish|delete|terminal/i.test(event));
    const postFinish = await request(`/api/chat/conversations/${conversationId}/messages`, {token: token2});
    assert(postFinish.status === 404, `post-finish history returned ${postFinish.status}`);
    console.log(JSON.stringify({
      result: terminalEvents.length ? 'pass' : 'finding',
      shared_turn_recovered_by_second_session: true,
      replay_event_types: [...new Set(replayTypes)].sort(),
      volatile_http_state_removed: true,
      terminal_event_received_by_active_sessions: terminalEvents.length > 0,
      observed_terminal_event_names: [...new Set(terminalEvents)].sort(),
    }));
  } finally {
    socket1.disconnect();
    socket2.disconnect();
    identity.email = undefined;
    identity.password = undefined;
  }
}

main().catch((error) => {
  console.error(JSON.stringify({result: 'fail', message: error.message}));
  process.exitCode = 1;
});
