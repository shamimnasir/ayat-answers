const puppeteer = require('puppeteer-core');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [,, file, out, w, h] = process.argv;
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'shell',
    args: ['--no-sandbox','--hide-scrollbars','--font-render-hinting=none'] });
  const p = await b.newPage();
  await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
  await p.goto('file://' + file, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 1200));
  await p.screenshot({ path: out, type: 'png' });
  console.log('ok', out);
  await b.close();
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
