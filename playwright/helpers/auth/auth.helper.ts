import { APIRequestContext, BrowserContext, Page, request } from '@playwright/test';

import { Constants } from '@gt-test-data/constants/constants.ts';
import { Cookie } from 'playwright';
import { Landing } from '@gt-pages/nli/landing.page.ts';
import { Login } from '@gt-pages/nli/login.page.ts';
import { SignUp } from '@gt-pages/nli/signUp.page.ts';
import { User } from '@gt-models/user.ts';
import fs from 'fs';

export async function signUpOrLoadStorage(data: {
  user: User;
  authFilePath: string;
  page: Page;
  context: BrowserContext;
}): Promise<void> {
  const signUpPage: SignUp = new SignUp(data.page, data.context);
  const landingPage: Landing = new Landing(data.page, data.context);

  if (isTokenExistAndValidByTime(data.authFilePath)) {
    console.info('✅ Token is valid. Will use saved session and skip signup.');
    setAccessCookieAsEnv(data.authFilePath);
    return;
  }

  await landingPage.open();
  await landingPage.openSignUp();
  await signUpPage.signUpWithSavingStorage({
    email: data.user.email,
    password: data.user.password,
    authFilePath: data.authFilePath,
  });

  setAccessCookieAsEnv(data.authFilePath);
}

export async function prepareRegisteredRandomUser(data: {
  user: User;
  authFilePath: string;
  page: Page;
  context: BrowserContext;
}): Promise<void> {
  const login: Login = new Login(data.page, data.context);

  await signUpOrLoadStorage(data);
  await logoutViaApi(data.authFilePath);
  await login.loginWithSavingStorage({
    email: data.user.email,
    password: data.user.password,
    authFilePath: data.authFilePath,
  });
  setAccessCookieAsEnv(data.authFilePath);
  await data.context.storageState({ path: data.authFilePath });
}

export async function logoutViaApi(authFilePath?: string): Promise<void> {
  if (!authFilePath) {
    authFilePath = Constants.DEFAULT_STORAGE_STATE_PATH;
  }
  if (!fs.existsSync(authFilePath)) {
    return;
  }

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

  fs.unlinkSync(authFilePath);
}

export function getSessionIdCookie(path: string): Cookie {
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

export function setAccessCookieAsEnv(pathToFileWithCookies: string): void {
  const sessionid: Cookie = getSessionIdCookie(pathToFileWithCookies);
  process.env.sessionid = sessionid.value;
  console.info('🛠SessionId set as env variable🛠️');
}

export function isTokenExistAndValidByTime(path: string): boolean {
  if (!fs.existsSync(path)) {
    console.info('🧨File with storage state not exist🧨');
    return false;
  }

  return isValidByTime(path);
}

// will be used for existing users, now mostly for demonstration purposes
export function isValidByTime(path: string): boolean {
  const stats: fs.Stats = fs.statSync(path);
  const threeHoursAgo: number = new Date().getTime() - 3 * 60 * 60 * 1000;

  return stats.ctimeMs > threeHoursAgo;
}
