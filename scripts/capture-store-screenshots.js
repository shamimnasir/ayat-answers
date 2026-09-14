const puppeteer = require('puppeteer-core');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = process.argv[2];

const clickByText = (re) => new Function('re', `
  const b=[...document.querySelectorAll('button')].find(x=>new RegExp(${JSON.stringify(re)},'i').test(x.innerText));
  if(b) b.click(); return !!b;`);

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'shell',
    args: ['--no-sandbox','--hide-scrollbars','--font-render-hinting=none'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluateHandle('document.fonts.ready');
  const settle = (ms=1400) => new Promise(r => setTimeout(r, ms));
  await settle(2000);

  // 1. Home
  await page.screenshot({ path: `${OUT}/shot-1-home.png` });

  // 2. Surah list
  await page.evaluate(() => {
    const b=[...document.querySelectorAll('button')].find(x=>/^Surahs$/i.test(x.innerText.trim()));
    if(b) b.click();
  });
  await settle();
  await page.screenshot({ path: `${OUT}/shot-2-surahs.png` });

  // 3. Reader with pronunciation
  await page.evaluate(() => {
    const b=[...document.querySelectorAll('button')].find(x=>/Al-Fatiha/i.test(x.innerText));
    if(b) b.click();
  });
  await page.waitForFunction(() => document.body.innerText.includes('Bismillaahir'), { timeout: 30000 });
  await settle();
  await page.screenshot({ path: `${OUT}/shot-3-reader.png` });

  // 4. AI search
  await page.evaluate(() => {
    const b=[...document.querySelectorAll('button')].find(x=>/AI Search/i.test(x.innerText));
    if(b) b.click();
  });
  await settle(1800);
  await page.screenshot({ path: `${OUT}/shot-4-ai.png` });

  console.log('captured 4 screens');
  await browser.close();
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
