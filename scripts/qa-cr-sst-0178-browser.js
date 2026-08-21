const {randomBytes} = require('node:crypto');
const http = require('node:http');
const path = require('node:path');

const playwright = require(process.env.QA_PLAYWRIGHT_CORE || 'playwright-core');

const baseUrl = process.env.QA_BASE_URL || 'http://localhost:8088';
const chromePath = process.env.QA_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const evidenceDir = process.env.QA_EVIDENCE_DIR || path.resolve(process.cwd(), 'evidence/requests/CR-SST-0178');

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

async function main() {
  const suffix = randomBytes(8).toString('hex');
  const email = `browser.${suffix}@example.invalid`;
  const password = `${randomBytes(24).toString('base64url')}-Qa1!`;
  const message = `synthetic-chat-${randomBytes(6).toString('hex')}`;

  const registrationBody = JSON.stringify({name: 'Synthetic Browser QA', email, password, credential_version: 'raw-v2'});
  const registrationStatus = await new Promise((resolve, reject) => {
    const request = http.request(
      {
        hostname: '127.0.0.1',
        port: 8088,
        path: '/api/auth/register',
        method: 'POST',
        headers: {host: 'localhost', 'content-type': 'application/json', 'content-length': Buffer.byteLength(registrationBody)},
      },
      (response) => {
        response.resume();
        response.on('end', () => resolve(response.statusCode));
      }
    );
    request.on('error', reject);
    request.end(registrationBody);
  });
  assert(registrationStatus === 200, `synthetic registration returned ${registrationStatus}`);

  const browser = await playwright.chromium.launch({headless: true, executablePath: chromePath});
  const context = await browser.newContext({viewport: {width: 1440, height: 1000}});
  const page = await context.newPage();
  const observed = {login: [], refresh: 0, logout: 0, authenticatedAfterLogout: 0, socket: 0, authStatuses: [], chatStatuses: []};
  let logoutStarted = false;
  let stage = 'browser-start';

  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.endsWith('/auth/login')) {
      const body = request.postDataJSON();
      observed.login.push({version: body?.credential_version, hasPassword: typeof body?.password === 'string'});
    }
    if (url.pathname.endsWith('/auth/refresh')) observed.refresh += 1;
    if (url.pathname.endsWith('/auth/logout')) {
      observed.logout += 1;
      logoutStarted = true;
      return;
    }
    if (logoutStarted && (url.pathname.includes('/api/chat') || url.pathname.endsWith('/auth/refresh') || url.pathname.includes('/realtime/socket.io'))) {
      observed.authenticatedAfterLogout += 1;
    }
    if (url.pathname.includes('/realtime/socket.io')) observed.socket += 1;
  });
  page.on('response', (response) => {
    const pathname = new URL(response.url()).pathname;
    if (pathname.includes('/auth/')) observed.authStatuses.push({endpoint: pathname.split('/').pop(), status: response.status()});
    if (pathname.includes('/api/chat')) observed.chatStatuses.push({endpoint: pathname, status: response.status()});
  });

  try {
    stage = 'open-login';
    await page.goto(`${baseUrl}/?auth=login`, {waitUntil: 'networkidle'});
    const loginForm = page.locator('form').filter({has: page.locator('input[name="email"]')});
    await loginForm.locator('input[name="email"]').fill(email);
    await loginForm.locator('input[name="password"]').fill(password);
    stage = 'submit-login';
    await loginForm.locator('button[type="submit"]').click();
    await page.getByRole('button', {name: 'Chat', exact: true}).waitFor({timeout: 20000});
    assert(observed.login.length === 1, `expected one login request, observed ${observed.login.length}`);
    assert(observed.login[0].version === 'raw-v2', 'login did not use raw-v2');
    assert(observed.login[0].hasPassword, 'login raw-v2 payload did not contain a password field');
    await page.screenshot({path: path.join(evidenceDir, 'localhost-authenticated-dashboard.png'), fullPage: true});
    stage = 'post-login-settle';
    await page.waitForTimeout(5000);
    await page.getByRole('button', {name: 'Chat', exact: true}).waitFor({timeout: 5000});

    stage = 'hard-reload';
    await page.reload({waitUntil: 'networkidle'});
    await page.getByRole('button', {name: 'Chat', exact: true}).waitFor({timeout: 20000});
    await page.getByRole('button', {name: 'Chat', exact: true}).click();
    stage = 'chat-connect';
    await page.waitForURL('**/chat');
    await page.getByText('online', {exact: true}).waitFor({timeout: 30000});
    await page.waitForFunction(() => Boolean(sessionStorage.getItem('sst.chat.conversation_id')), undefined, {timeout: 30000});
    const input = page.locator('#sst-chat-message[name="message"][aria-label="Mensaje"]');
    await input.waitFor();
    assert(await input.isEnabled(), 'chat message input is disabled while online');
    await input.fill(message);
    stage = 'chat-send';
    await page.getByRole('button', {name: 'Enviar', exact: true}).click();
    await page.getByText(message, {exact: false}).waitFor({timeout: 10000});
    await page.locator('section[aria-live="polite"] p').filter({hasText: 'SST:'}).waitFor({timeout: 90000});
    await page.screenshot({path: path.join(evidenceDir, 'localhost-chat-completed.png'), fullPage: true});

    stage = 'chat-reload-history';
    await page.reload({waitUntil: 'networkidle'});
    await page.getByText('online', {exact: true}).waitFor({timeout: 30000});
    await page.locator('section[aria-live="polite"] p').filter({hasText: `Vos: ${message}`}).first().waitFor({timeout: 30000});

    stage = 'logout';
    await page.getByRole('button', {name: 'Synthetic Browser QA', exact: true}).click();
    await page.getByRole('button', {name: /Cerrar sesi.n|Log out/i}).click();
    await page.waitForTimeout(2500);
    assert(observed.logout === 1, `expected one logout request, observed ${observed.logout}`);
    assert(observed.authenticatedAfterLogout === 0, `observed ${observed.authenticatedAfterLogout} authenticated requests after logout`);
    await page.getByRole('button', {name: /iniciar sesi.n|Log in|Sign in/i}).first().waitFor({timeout: 10000});

    console.log(JSON.stringify({
      result: 'pass',
      login_requests: observed.login.length,
      login_protocol: observed.login[0].version,
      refresh_requests_after_reload: observed.refresh,
      socket_requests: observed.socket,
      logout_requests: observed.logout,
      authenticated_requests_after_logout: observed.authenticatedAfterLogout,
      chat_online: true,
      chat_completed: true,
      history_recovered_after_reload: true,
    }));
  } catch (error) {
    console.error(JSON.stringify({result: 'fail', stage, auth_statuses: observed.authStatuses, chat_statuses: observed.chatStatuses}));
    await page.screenshot({path: path.join(evidenceDir, 'localhost-browser-failure.png'), fullPage: true}).catch(() => undefined);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
