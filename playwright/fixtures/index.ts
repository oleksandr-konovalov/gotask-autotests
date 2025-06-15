import {
  BrowserContext,
  Page,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
  test,
} from '@playwright/test';
import { Customer, NLI } from '@gt-app/index.ts';

import { PageType } from '@gt-types/pageType.ts';

export const baseFixture: TestType<
  PlaywrightTestArgs & PlaywrightTestOptions & PageType,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = test.extend<PageType>({
  nli: async ({ page, context }: { page: Page; context: BrowserContext }, use: (nli: NLI) => Promise<void>) => {
    await use(new NLI(page, context));
  },
  customer: async (
    { page, context }: { page: Page; context: BrowserContext },
    use: (customer: Customer) => Promise<void>,
  ) => {
    await use(new Customer(page, context));
  },
});
