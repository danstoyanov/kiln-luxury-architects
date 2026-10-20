import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';
const [kind, url, output, mode] = process.argv.slice(2);
if (!['k11', 'k09'].includes(kind) || !url || !output) throw new Error('Expected kind, URL and output');
const { Browser, Page } = await import(pathToFileURL(resolve('.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs')));
let skipped = 0;
Page.prototype.screenshot = async function () { skipped++; };
if (mode === '--auth') {
  const token = await new Promise((resolveInput, reject) => {
    let input = '';
    const terminal = process.stdin.isTTY;
    function finish() {
      process.stdin.off('data', data);
      if (terminal) process.stdin.setRawMode(false);
      process.stdin.pause();
      try { resolveInput(JSON.parse(input).token); } catch { reject(new Error('Invalid auth input')); }
    }
    function data(chunk) { input += chunk; if (/[\r\n]/.test(input)) finish(); }
    if (terminal) process.stdin.setRawMode(true);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', data);
    process.stdin.resume();
    process.stderr.write('Ready for hosted QA auth on hidden stdin.\n');
  });
  if (typeof token !== 'string' || !token) throw new Error('Missing hosted auth');
  const origin = new URL(url).origin;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (input, options = {}) => {
    const headers = new Headers(options.headers);
    if (new URL(input instanceof Request ? input.url : input).origin === origin) headers.set('OAI-Sites-Authorization', 'Bearer ' + token);
    return originalFetch(input, { ...options, headers });
  };
  const newPage = Browser.prototype.newPage;
  Browser.prototype.newPage = async function (...args) {
    const page = await newPage.apply(this, args);
    await page.send('Network.enable');
    await page.send('Network.setExtraHTTPHeaders', { headers: { 'OAI-Sites-Authorization': 'Bearer ' + token } });
    return page;
  };
}
process.argv = [process.execPath, resolve('scripts/check-' + kind + '.mjs'), url, '--out', output];
await import(pathToFileURL(resolve('scripts/check-' + kind + '.mjs')));
writeFileSync(resolve(output, 'no-images-runner.json'), JSON.stringify({ kind, url, screenshotsDisabled: true, screenshotCallsSkipped: skipped, authentication: mode === '--auth' ? 'owner token in memory' : 'local' }, null, 2) + '\n');
