const {randomBytes, randomUUID} = require("node:crypto");
const http = require("node:http");
const {io} = require(process.env.QA_SOCKET_IO_CLIENT || "socket.io-client");

const baseUrl = new URL(process.env.QA_BASE_URL || "http://127.0.0.1:8088");
const basePath = baseUrl.pathname === "/" ? "" : baseUrl.pathname.replace(/\/$/, "");
const socketPath = process.env.QA_SOCKET_PATH || "/4uentes/realtime/socket.io";
const cacheHeader = "x-sst-chat-history-cache";
const allowedHosts = new Set(["127.0.0.1", "localhost", "[::1]"]);

let stage = "preflight";

function assert(condition, code) {
  if (!condition) {
    const error = new Error(code);
    error.code = code;
    throw error;
  }
}

assert(baseUrl.protocol === "http:", "non_http_surface_rejected");
assert(allowedHosts.has(baseUrl.hostname), "non_localhost_surface_rejected");

async function request(path, {method = "GET", token, headers = {}, body} = {}) {
  const url = new URL(`${baseUrl.origin}${basePath}${path}`);
  const payload = body === undefined ? undefined : JSON.stringify(body);
  const response = await new Promise((resolve, reject) => {
    const outgoing = http.request(url, {
      method,
      headers: {
        ...(url.hostname === "127.0.0.1" ? {host: "localhost"} : {}),
        accept: "application/json",
        ...(payload === undefined ? {} : {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(payload),
        }),
        ...(token ? {authorization: `Bearer ${token}`} : {}),
        ...headers,
      },
    }, (incoming) => {
      let text = "";
      incoming.setEncoding("utf8");
      incoming.on("data", (chunk) => { text += chunk; });
      incoming.on("end", () => resolve({
        status: incoming.statusCode,
        headers: incoming.headers,
        text,
      }));
    });
    outgoing.on("error", () => reject(Object.assign(new Error("network_error"), {code: "network_error"})));
    outgoing.end(payload);
  });
  let json;
  try {
    json = response.text ? JSON.parse(response.text) : undefined;
  } catch {
    json = undefined;
  }
  return {status: response.status, headers: response.headers, json};
}

function waitFor(socket, event, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(event, handler);
      reject(Object.assign(new Error(`${event}_timeout`), {code: `${event}_timeout`}));
    }, timeoutMs);
    const handler = (payload) => {
      clearTimeout(timer);
      socket.off(event, handler);
      resolve(payload);
    };
    socket.on(event, handler);
  });
}

function emitAck(socket, event, payload, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(Object.assign(new Error(`${event}_ack_timeout`), {code: `${event}_ack_timeout`})),
      timeoutMs
    );
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
    transports: ["websocket"],
    reconnection: false,
    timeout: 8_000,
    extraHeaders: {Host: "localhost"},
  };
}

function historyShape(response, expectedOutcome) {
  assert(response.status === 200, `history_${expectedOutcome}_status`);
  assert(response.headers[cacheHeader] === expectedOutcome, `history_${expectedOutcome}_header`);
  assert(Array.isArray(response.json?.messages), `history_${expectedOutcome}_messages_shape`);
  assert(Array.isArray(response.json?.events), `history_${expectedOutcome}_events_shape`);
  assert(!Object.hasOwn(response.json, "cacheOutcome"), `history_${expectedOutcome}_body_metadata_leak`);
  return response.json;
}

async function readPair(token, conversationId) {
  const missResponse = await request(`/api/chat/conversations/${conversationId}/messages`, {token});
  const missBody = historyShape(missResponse, "miss");
  const hitResponse = await request(`/api/chat/conversations/${conversationId}/messages`, {token});
  const hitBody = historyShape(hitResponse, "hit");
  assert(JSON.stringify(missBody) === JSON.stringify(hitBody), "history_body_changed_between_miss_and_hit");
  return missBody;
}

async function join(socket, conversationId) {
  const resumed = waitFor(socket, "chat:session:resumed", 10_000);
  const ack = await emitAck(socket, "chat:join", {
    conversation_id: conversationId,
    last_seen_sequence: 0,
  }, 10_000);
  assert(ack?.ok === true, "chat_join_failed");
  await resumed;
}

async function appendNormalTurn(socket, conversationId) {
  const accepted = waitFor(socket, "chat:message:accepted", 15_000);
  const completed = waitFor(socket, "chat:assistant:completed", 90_000);
  const ackPromise = emitAck(socket, "chat:message", {
    conversation_id: conversationId,
    client_message_id: randomUUID(),
    correlation_id: randomUUID(),
    text: `synthetic-cache-invalidation-${randomBytes(6).toString("hex")}`,
  }, 90_000);
  await accepted;
  const [, ack] = await Promise.all([completed, ackPromise]);
  assert(ack?.ok === true, "chat_turn_failed");
}

async function main() {
  const identity = {
    email: `retention.cache.${randomBytes(10).toString("hex")}@example.invalid`,
    password: `${randomBytes(24).toString("base64url")}-Qa1!`,
  };
  let token;
  let conversationId;
  let conversationMode;
  let socket;

  try {
    stage = "register";
    const registration = await request("/api/auth/register", {
      method: "POST",
      body: {name: "Synthetic Cache QA", ...identity, credential_version: "raw-v2"},
    });
    assert(registration.status === 200, "registration_status");

    stage = "login";
    const login = await request("/api/auth/login", {
      method: "POST",
      body: {...identity, credential_version: "raw-v2"},
    });
    assert(login.status === 200 && typeof login.json?.token === "string", "login_contract");
    token = login.json.token;

    stage = "create";
    const created = await request("/api/chat/conversations", {method: "POST", token});
    assert(created.status === 201 && typeof created.json?.id === "string", "create_contract");
    conversationId = created.json.id;
    conversationMode = "temporary";

    stage = "save";
    const promoted = await request(`/api/chat/conversations/${conversationId}/save`, {
      method: "POST",
      token,
      headers: {"idempotency-key": randomUUID()},
    });
    assert(promoted.status === 200 && promoted.json?.duplicate === false, "save_contract");
    conversationMode = "saved";

    stage = "initial_miss_hit";
    const initial = await readPair(token, conversationId);

    stage = "normal_turn";
    socket = io(`${baseUrl.origin}${basePath}/sst-chat/v1`, socketOptions(token));
    await waitFor(socket, "connect", 10_000);
    await join(socket, conversationId);
    await appendNormalTurn(socket, conversationId);

    stage = "invalidated_miss_hit";
    const invalidated = await readPair(token, conversationId);
    assert(invalidated.messages.length > initial.messages.length, "normal_turn_messages_not_committed");
    assert(invalidated.events.length > initial.events.length, "normal_turn_events_not_committed");

    stage = "delete";
    const deleted = await request(`/api/chat/conversations/${conversationId}`, {method: "DELETE", token});
    assert(deleted.status === 204, "delete_status");
    conversationMode = undefined;

    stage = "post_delete";
    const afterDelete = await request(`/api/chat/conversations/${conversationId}/messages`, {token});
    assert(afterDelete.status === 404, "post_delete_status");
    assert(afterDelete.headers[cacheHeader] === undefined, "post_delete_cache_header_leak");

    console.log(JSON.stringify({
      result: "pass",
      surface: "localhost",
      cache_sequence: ["miss", "hit", "miss", "hit"],
      invalidation: "normal-product-turn",
      conversation_cleanup: "pass-product-api",
      identity_cleanup: "not-available-product-contract",
      evidence_fields: ["outcomes", "statuses", "counts-only"],
    }));
  } finally {
    socket?.disconnect();
    if (conversationMode && token && conversationId) {
      const path = `/api/chat/conversations/${conversationId}${conversationMode === "temporary" ? "/finish" : ""}`;
      const method = conversationMode === "temporary" ? "POST" : "DELETE";
      const cleanup = await request(path, {method, token});
      assert([204, 404].includes(cleanup.status), "conversation_cleanup_failed");
    }
    identity.email = undefined;
    identity.password = undefined;
    token = undefined;
    conversationId = undefined;
  }
}

main().catch((error) => {
  console.error(JSON.stringify({result: "fail", stage, code: error.code || "unexpected_error"}));
  process.exitCode = 1;
});
