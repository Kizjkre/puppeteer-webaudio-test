import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';
// @ts-ignore
import htmlContent from './src/index.html';

(async (): Promise<void> => {
  const browser: Browser = await puppeteer.launch({
    ignoreDefaultArgs: ['--mute-audio', '--autoplay-policy=no-user-gesture-required']
  });
  const page: Page = await browser.newPage();

  await page.setContent(htmlContent);

  const res: any = await page.evaluate(fs.readFileSync('src/script.js', 'utf8'));
  console.log(res);

  await browser.close();
})();
