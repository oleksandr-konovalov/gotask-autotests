import {
  APIRequestContext,
  Browser,
  BrowserContext,
  Cookie,
  Locator,
  Page,
  chromium,
  expect,
  request,
} from '@playwright/test';

import { Constants } from '@gt-test-data/constants/constants.ts';
import { Landing } from '@gt-pages/nli/landing.page.ts';
import { Login } from '@gt-pages/nli/login.page.ts';
import { MyOrders } from '@gt-pages/customer/myOrder.page.ts';
import { SignUp } from '@gt-pages/nli/signUp.page.ts';
import { User } from '@gt-models/user.ts';
import fs from 'fs';

export async function signUpOrLoadStorage(data: {
  user: User;
  authFilePath: string;
  page: Page;
  context: BrowserContext;
}): Promise<string> {
  const signUpPage: SignUp = new SignUp(data.page, data.context);
  const landingPage: Landing = new Landing(data.page, data.context);

  // TODO: Uncomment if existing user will be used
  // if (isTokenExistAndValidByTime(data.authFilePath)) {
  //   console.info('✅ Token is valid. Will use saved session and skip signup.');
  //   setAccessCookieAsEnv(data.authFilePath);
  //   return;
  // }

  const newBrowser: Browser = await chromium.launch();
  const newContext: BrowserContext = await newBrowser.newContext();
  const newPage: Page = await newContext.newPage();
  const tempEmail: string = await _generateTempEmail(newPage);

  await landingPage.open();
  await landingPage.openSignUp();
  await signUpPage.signUpWithSavingStorage({
    email: tempEmail,
    password: data.user.password,
    authFilePath: data.authFilePath,
  });

  await _confirmEmail(newPage);

  setAccessCookieAsEnv(data.authFilePath);

  return tempEmail;
}

export async function prepareRegisteredRandomUser(data: {
  user: User;
  authFilePath: string;
  page: Page;
  context: BrowserContext;
}): Promise<void> {
  const login: Login = new Login(data.page, data.context);

  const tempEmail: string = await signUpOrLoadStorage(data);
  await logoutViaApi();
  await login.loginWithSavingStorage({
    email: tempEmail,
    password: data.user.password,
    authFilePath: data.authFilePath,
  });
  setAccessCookieAsEnv(data.authFilePath);
  await data.context.storageState({ path: data.authFilePath });
}

export async function logoutViaApi(): Promise<void> {
  /* TODO: Create api service for sending requests
            it can use generic for any returned type, checking of response, etc.
            create a general wrapper for API requests and separate wrappers for different request types (GET, POST, etc.)
        */
  const context: APIRequestContext = await request.newContext();

  await context.fetch('https://app.gotaskme.com/api/auth/logout/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `sessionid=${process.env.sessionid}`,
    },
  });
  await context.dispose();
}

async function _generateTempEmail(page: Page): Promise<string> {
  await page.goto(Constants.TEMP_MAIL_URL);
  const loader: Locator = page.locator('.bg-white', { has: page.locator('#email') }).locator('[data-qa="loader"]');
  await expect(loader).not.toBeVisible();
  return await page.locator('input#email').inputValue();
}

async function _confirmEmail(page: Page): Promise<void> {
  const myOrders: MyOrders = new MyOrders(page, page.context());

  await expect(page.locator('ul.email-list li.message')).toBeVisible({ timeout: Constants.SIXTY_SECONDS });
  await page.locator('ul.email-list li.message').click();
  const verifyLink: string = await page.locator('table a.es-button').getAttribute('href');
  if (verifyLink) {
    await page.goto(verifyLink);
  } else {
    throw new Error('🧨No confirmation email found🧨');
  }

  await myOrders.expectLoaded();
  await logoutViaApi();
  await page.context().close();
}

function getSessionIdCookie(path: string): Cookie {
  const cookiesData: string = fs.readFileSync(path, 'utf8');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed: any = JSON.parse(cookiesData);
  const storedCookies: Cookie[] = parsed.cookies as Cookie[];
  const sessionId: Cookie | undefined = storedCookies.find((cookie: Cookie) => cookie.name === 'sessionid');

  if (!sessionId) {
    throw new Error(`🧨No access cookie in ${path}🧨`);
  }

  return sessionId;
}

function setAccessCookieAsEnv(pathToFileWithCookies: string): void {
  const sessionid: Cookie = getSessionIdCookie(pathToFileWithCookies);
  process.env.sessionid = sessionid.value;
  console.info('🛠SessionId set as env variable🛠️');
}

// function isTokenExistAndValidByTime(path: string): boolean {
//   if (!fs.existsSync(path)) {
//     console.info('🧨File with storage state not exist🧨');
//     return false;
//   }
//
//   return isValidByTime(path);
// }

// will be used for existing users, now mostly for demonstration purposes
// function isValidByTime(path: string): boolean {
//   const stats: fs.Stats = fs.statSync(path);
//   const threeHoursAgo: number = new Date().getTime() - 3 * 60 * 60 * 1000;
//
//   return stats.ctimeMs > threeHoursAgo;
// }
