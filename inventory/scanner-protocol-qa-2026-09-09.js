"use strict";
// Execute over stdin in the SST container. Fixtures remain in memory.
// This validates scanner transport, not the future upload adapter or storage.
const assert = require("node:assert/strict");
const net = require("node:net");
const crypto = require("node:crypto");
const socketPath = process.env.RECEIPT_SCAN_SOCKET;
assert.equal(socketPath, "/var/run/clamav/clamd.sock");
function exchange(command, body, target = socketPath) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ path: target });
    let reply = "";
    socket.setTimeout(20000, () => socket.destroy(new Error("SCANNER_TIMEOUT")));
    socket.on("error", reject);
    socket.on("connect", () => {
      socket.write(Buffer.from(`z${command}\0`));
      if (body) {
        const length = Buffer.alloc(4); length.writeUInt32BE(body.length);
        socket.write(length); socket.write(body); socket.write(Buffer.alloc(4));
      }
    });
    socket.on("data", (chunk) => {
      reply += chunk.toString("utf8");
      if (reply.includes("\0") || reply.includes("\n")) { socket.end(); resolve(reply.replace(/\0/g, "").trim()); }
    });
    socket.on("end", () => reply ? resolve(reply.trim()) : reject(new Error("SCANNER_EMPTY_REPLY")));
  });
}
(async () => {
  assert.equal(await exchange("PING"), "PONG");
  const version = await exchange("VERSION");
  const clean = Buffer.from("CR-HPT-0024 synthetic clean stream; no document or user data.\n");
  const eicar = Buffer.from(["X5O!P%@AP[4", "\\PZX54(P^)7CC)7}$", "EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"].join(""));
  assert.equal(eicar.length, 68);
  const cleanReply = await exchange("INSTREAM", clean);
  const infectedReply = await exchange("INSTREAM", eicar);
  assert.match(cleanReply, /^stream: OK$/);
  assert.match(infectedReply, /^stream: .*EICAR.* FOUND$/i);
  await assert.rejects(exchange("INSTREAM", clean, `${socketPath}.synthetic-unavailable`), (error) => error.code === "ENOENT");
  console.log(JSON.stringify({ gate: "CR-HPT-0024-scanner-protocol", version, ping: "PONG", clean: cleanReply, eicar: infectedReply, eicar_sha256: crypto.createHash("sha256").update(eicar).digest("hex"), unavailable_socket: "ENOENT-no-verdict", files_written: 0, scope: "scanner transport only; upload/storage fail-closed remains unimplemented" }));
})().catch((error) => { console.error(`FAIL scanner protocol: ${error.message}`); process.exitCode = 1; });
