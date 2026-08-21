const {pbkdf2Sync, randomBytes} = require('node:crypto');
const http = require('node:http');

const saltWords = [2802594667, 2344753102, 1667501565, 4266176519];

function deriveLegacyCredential(password, email) {
  const salt = Buffer.alloc(saltWords.length * 4);
  saltWords.forEach((word, index) => salt.writeUInt32BE(word, index * 4));
  const material = `${password}${email.toLowerCase().split('').reverse().join('')}`;
  return pbkdf2Sync(material, salt, 1000, 64, 'sha256').toString('hex');
}

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

async function main() {
  const suffix = randomBytes(8).toString('hex');
  const email = `migration.${suffix}@example.invalid`;
  const password = `${randomBytes(24).toString('base64url')}-Ma1!`;
  const legacyMaterial = deriveLegacyCredential(password, email);
  const statuses = {
    legacy_register: await request('/api/auth/register', {name: 'Synthetic Migration', email, password: legacyMaterial}),
    migration_login_raw_v2: await request('/api/auth/login', {email, password, credential_version: 'raw-v2'}),
    post_migration_login_raw_v2: await request('/api/auth/login', {email, password, credential_version: 'raw-v2'}),
    rollback_login_legacy: await request('/api/auth/login', {email, password: legacyMaterial}),
    no_downgrade_raw_v2_with_legacy_material: await request('/api/auth/login', {email, password: legacyMaterial, credential_version: 'raw-v2'}),
  };
  const expected = {legacy_register: 200, migration_login_raw_v2: 200, post_migration_login_raw_v2: 200, rollback_login_legacy: 200, no_downgrade_raw_v2_with_legacy_material: 401};
  console.log(JSON.stringify({result: JSON.stringify(statuses) === JSON.stringify(expected) ? 'pass' : 'fail', statuses}));
  if (JSON.stringify(statuses) !== JSON.stringify(expected)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
