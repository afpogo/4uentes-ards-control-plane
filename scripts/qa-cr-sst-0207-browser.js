const {randomBytes} = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {chromium} = require(process.env.QA_PLAYWRIGHT_CORE || 'playwright-core');

const baseUrl = process.env.QA_BASE_URL || 'http://localhost:8088';
const chromePath = process.env.QA_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const evidenceDir = process.env.QA_EVIDENCE_DIR || path.resolve(process.cwd(), 'evidence/requests/CR-SST-0207');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function api(pathname, {method = 'GET', token, body} = {}) {
  const payload = body === undefined ? undefined : JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: '127.0.0.1',
      port: 8088,
      path: pathname,
      method,
      headers: {
        host: 'localhost',
        accept: 'application/json',
        ...(payload === undefined ? {} : {'content-type': 'application/json', 'content-length': Buffer.byteLength(payload)}),
        ...(token ? {authorization: `Bearer ${token}`} : {}),
      },
    }, (response) => {
      let text = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { text += chunk; });
      response.on('end', () => resolve({status: response.statusCode, text}));
    });
    request.on('error', reject);
    request.end(payload);
  });
}

async function main() {
  fs.mkdirSync(evidenceDir, {recursive: true});
  const suffix = randomBytes(10).toString('hex');
  const email = `retention.browser.${suffix}@example.invalid`;
  const password = `${randomBytes(24).toString('base64url')}-Qa1!`;
  const syntheticMessage = `synthetic-retention-ui-${randomBytes(6).toString('hex')}`;
  const registration = await api('/api/auth/register', {method: 'POST', body: {name: 'Synthetic Retention Browser', email, password, credential_version: 'raw-v2'}});
  assert(registration.status === 200, `registration returned ${registration.status}`);

  const browser = await chromium.launch({headless: true, executablePath: chromePath});
  const context = await browser.newContext({viewport: {width: 1440, height: 1000}});
  const page = await context.newPage();
  const observed = {chatStatuses: [], socketRequests: 0};
  let accessToken;
  const cleanup = [];
  let stage = 'start';
  page.on('request', (request) => {
    const pathname = new URL(request.url()).pathname;
    if (pathname.includes('/realtime/socket.io')) observed.socketRequests += 1;
  });
  page.on('response', async (response) => {
    const pathname = new URL(response.url()).pathname;
    if (pathname.includes('/api/chat')) observed.chatStatuses.push({endpoint: pathname, status: response.status()});
    if (pathname.endsWith('/api/auth/login') && response.status() === 200) {
      const payload = await response.json().catch(() => undefined);
      if (payload?.token) accessToken = payload.token;
    }
  });

  try {
    stage = 'login';
    await page.goto(`${baseUrl}/?auth=login`, {waitUntil: 'networkidle'});
    const loginForm = page.locator('form').filter({has: page.locator('input[name="email"]')});
    await loginForm.locator('input[name="email"]').fill(email);
    await loginForm.locator('input[name="password"]').fill(password);
    await loginForm.locator('button[type="submit"]').click();
    await page.getByRole('button', {name: 'Chat', exact: true}).waitFor({timeout: 20_000});
    assert(accessToken, 'login token was not observed');

    stage = 'open-chat';
    await page.getByRole('button', {name: 'Chat', exact: true}).click();
    await page.waitForURL('**/chat');
    await page.getByText('online', {exact: true}).waitFor({timeout: 30_000});
    await page.getByText('Temporal', {exact: true}).waitFor({timeout: 10_000});
    await page.getByRole('button', {name: 'Guardar en SST', exact: true}).waitFor();
    await page.getByRole('button', {name: 'Finalizar temporal', exact: true}).waitFor();
    await page.getByRole('button', {name: 'Limpiar este dispositivo', exact: true}).waitFor();
    const initialConversationId = await page.evaluate(() => sessionStorage.getItem('sst.chat.conversation_id'));
    assert(initialConversationId, 'temporary conversation reference was not created');
    cleanup.push({id: initialConversationId, mode: 'temporary'});
    await page.screenshot({path: path.join(evidenceDir, 'localhost-retention-consent.png'), fullPage: true});

    stage = 'send-message';
    const input = page.locator('#sst-chat-message[name="message"][aria-label="Mensaje"]');
    await input.fill(syntheticMessage);
    await page.getByRole('button', {name: 'Enviar', exact: true}).click();
    await page.locator('section[aria-live="polite"] p').filter({hasText: 'SST:'}).waitFor({timeout: 90_000});

    stage = 'save';
    await page.getByRole('button', {name: 'Guardar en SST', exact: true}).click();
    await page.getByText('Conversación guardada en SST.', {exact: true}).waitFor({timeout: 15_000});
    await page.getByText('Guardada en SST', {exact: true}).waitFor();
    cleanup[0].mode = 'saved';

    stage = 'clear-local';
    await page.getByRole('button', {name: 'Limpiar este dispositivo', exact: true}).click();
    await page.getByText('Vista local limpiada. No se eliminó contenido guardado en SST.', {exact: true}).waitFor({timeout: 10_000});
    await page.waitForFunction((previous) => {
      const current = sessionStorage.getItem('sst.chat.conversation_id');
      return Boolean(current && current !== previous);
    }, initialConversationId, {timeout: 10_000});
    const clearLocalConversationId = await page.evaluate(() => sessionStorage.getItem('sst.chat.conversation_id'));
    cleanup.push({id: clearLocalConversationId, mode: 'temporary'});
    await page.getByRole('button', {name: 'Recuperar guardadas', exact: true}).click();
    await page.getByRole('heading', {name: 'Conversaciones guardadas', exact: true}).waitFor({timeout: 10_000});
    await page.screenshot({path: path.join(evidenceDir, 'localhost-clear-local-saved-list.png'), fullPage: true});
    const savedChoice = page.locator('aside[aria-labelledby="saved-conversations-title"] li button');
    assert(await savedChoice.count() === 1, 'expected exactly one saved synthetic conversation');
    await savedChoice.click();
    await page.getByText('Conversación guardada recuperada desde SST.', {exact: true}).waitFor({timeout: 10_000});
    const recoveredUserMessage = page.locator('section[aria-live="polite"] p').filter({hasText: `Vos: ${syntheticMessage}`});
    await recoveredUserMessage.waitFor({timeout: 20_000});
    assert(await recoveredUserMessage.count() === 1, 'saved user turn was not uniquely recovered');

    stage = 'delete-saved';
    await page.getByRole('button', {name: 'Eliminar de SST', exact: true}).click();
    await page.getByRole('alertdialog').waitFor();
    await page.getByRole('button', {name: 'Confirmar', exact: true}).click();
    await page.getByText('La conversación guardada fue eliminada de SST.', {exact: true}).waitFor({timeout: 15_000});
    cleanup.shift();
    await page.screenshot({path: path.join(evidenceDir, 'localhost-saved-delete-confirmed.png'), fullPage: true});

    await page.waitForFunction((previous) => {
      const current = sessionStorage.getItem('sst.chat.conversation_id');
      return Boolean(current && current !== previous);
    }, initialConversationId, {timeout: 10_000});
    const postDeleteConversationId = await page.evaluate(() => sessionStorage.getItem('sst.chat.conversation_id'));
    if (!cleanup.some((item) => item.id === postDeleteConversationId)) cleanup.push({id: postDeleteConversationId, mode: 'temporary'});
    console.log(JSON.stringify({
      result: 'pass',
      retention_consent_visible: true,
      explicit_save_visible: true,
      clear_local_preserved_saved_history: true,
      saved_delete_confirmed: true,
      socket_requests_observed: observed.socketRequests,
      chat_statuses: observed.chatStatuses,
      screenshots: ['localhost-retention-consent.png', 'localhost-clear-local-saved-list.png', 'localhost-saved-delete-confirmed.png'],
    }));
  } catch (error) {
    await page.screenshot({path: path.join(evidenceDir, 'localhost-browser-failure.png'), fullPage: true}).catch(() => undefined);
    console.error(JSON.stringify({result: 'fail', stage, message: error.message, chat_statuses: observed.chatStatuses}));
    process.exitCode = 1;
  } finally {
    if (accessToken) {
      for (const item of cleanup.reverse()) {
        const suffix = item.mode === 'temporary' ? '/finish' : '';
        await api(`/api/chat/conversations/${item.id}${suffix}`, {method: item.mode === 'temporary' ? 'POST' : 'DELETE', token: accessToken}).catch(() => undefined);
      }
    }
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(JSON.stringify({result: 'fail', stage: 'bootstrap', message: error.message}));
  process.exitCode = 1;
});
