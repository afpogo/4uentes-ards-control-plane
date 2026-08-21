const {randomBytes} = require('node:crypto');
const http = require('node:http');
const {spawnSync} = require('node:child_process');

const minuteMs = Number(process.env.QA_OBSERVATION_MINUTE_MS || 60000);
const totalMinutes = 30;

function request(path, body) {
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = http.request({hostname: '127.0.0.1', port: 8088, path, method: 'POST', headers: {host: 'localhost', 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload)}}, (res) => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.end(payload);
  });
}

function clusterWindow() {
  const logs = spawnSync('kubectl', ['logs', '-n', '4uentes-sst', 'deployment/node-auth', '--since=15m'], {encoding: 'utf8'}).stdout || '';
  const status = spawnSync('kubectl', ['get', 'deployment', 'node-auth', '-n', '4uentes-sst', '-o', 'json'], {encoding: 'utf8'});
  const deployment = status.status === 0 ? JSON.parse(status.stdout) : {};
  return {
    auth_5xx: (logs.match(/statusCode["': ]+5\d\d|Unhandled application error/gi) || []).length,
    kdf_saturation: (logs.match(/kdf[^\n]*(?:saturat|overload)|(?:saturat|overload)[^\n]*kdf/gi) || []).length,
    protocol_failures: (logs.match(/credential[^\n]*(?:protocol|version)[^\n]*(?:fail|reject|invalid)/gi) || []).length,
    ready: deployment.status?.readyReplicas === deployment.status?.replicas && deployment.status?.readyReplicas === 1,
    restarts: Number(spawnSync('kubectl', ['get', 'pods', '-n', '4uentes-sst', '-l', 'app=node-auth', '-o', 'jsonpath={.items[0].status.containerStatuses[0].restartCount}'], {encoding: 'utf8'}).stdout || -1),
  };
}

async function main() {
  const suffix = randomBytes(8).toString('hex');
  const email = `observe.${suffix}@example.invalid`;
  const password = `${randomBytes(24).toString('base64url')}-Wa1!`;
  const registration = await request('/api/auth/register', {name: 'Synthetic Observation', email, password, credential_version: 'raw-v2'});
  if (registration !== 200) throw new Error(`registration status ${registration}`);
  const probeStatuses = [];
  for (let minute = 0; minute <= totalMinutes; minute += 1) {
    if (minute % 5 === 0) probeStatuses.push(await request('/api/auth/login', {email, password, credential_version: 'raw-v2'}));
    if (minute === 15 || minute === 30) {
      const window = clusterWindow();
      const windowStatuses = minute === 15 ? probeStatuses.slice(0, 4) : probeStatuses.slice(4);
      console.log(JSON.stringify({event: 'window', number: minute / 15, minutes: 15, raw_v2_statuses: windowStatuses, ...window}));
      if (windowStatuses.some((status) => status !== 200) || window.auth_5xx || window.kdf_saturation || window.protocol_failures || !window.ready || window.restarts !== 0) process.exitCode = 1;
    } else {
      console.log(JSON.stringify({event: 'heartbeat', minute, probes_completed: probeStatuses.length}));
    }
    if (minute < totalMinutes) await new Promise((resolve) => setTimeout(resolve, minuteMs));
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
