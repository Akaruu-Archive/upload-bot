import { chromium, Route, Request } from 'playwright';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default async function upload(media: string) {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    userAgent: process.env.USER_AGENT as string,
  });
  const page = await context.newPage();

  context.setDefaultTimeout(0);
  page.setDefaultTimeout(0);

  await page.context().clearCookies();

  await page.route('**/*', async (route: Route, request: Request) => {
    await route.continue({
      headers: {
        ...request.headers(),
        'Cache-Control': 'no-store',
      },
    });
  });

  await page.goto('https://archive.org/account/login');

  await page.waitForSelector('input[name="username"]');
  await page.fill('input[name="username"]', process.env.EMAIL as string);
  await page.waitForSelector('input[name="password"]');
  await page.fill('input[name="password"]', process.env.PASSWORD as string);
  await page.click('input[name="submit-to-login"]');

  await page.waitForTimeout(5000);

  await page.goto('https://archive.org/upload');

  const fileInput = await page.$('input[type="file"]');
  if (!fileInput) {
    console.error("L'input de fichier est introuvable.");
    await browser.close();
    return;
  }

  await fileInput.setInputFiles(media);

  await page.waitForTimeout(10000);

  await page.click('span[id="subjects"]');
  
  const inputHandle = await page.waitForSelector('input[class="input_field"]');
  await inputHandle.type('Akaruu');

  await page.click('div[id="description_row"]');

  await page.waitForSelector('#description_editor-wysiwyg-iframe');

  const frame = await page.frameLocator('#description_editor-wysiwyg-iframe');

  await frame.locator('body').evaluate((body) => {
    body.innerHTML = 'Akaruu Archive';
  });

  await page.click("button[id='upload_button']");

  await page.waitForNavigation();

  const href = await page.$eval('a.format-summary.download-pill', (element) => {
    return (element as HTMLAnchorElement).href;
  });

  await browser.close();

  return href;
};