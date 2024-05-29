import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';

(async (): Promise<void> => {
  const browser: Browser = await puppeteer.launch({
    ignoreDefaultArgs: ['--mute-audio', '--autoplay-policy=no-user-gesture-required']
  });
  const page: Page = await browser.newPage();

  await page.setRequestInterception(true);
  await page.goto('chrome://newtab');

  page.on('request', req => {
    if (req.url().startsWith('blob:')) {
      console.log(req.url());
    }
    req.continue();
  });

  const res: any = await page.evaluate(fs.readFileSync('src/script.js', 'utf8'));

  await browser.close();
})();
