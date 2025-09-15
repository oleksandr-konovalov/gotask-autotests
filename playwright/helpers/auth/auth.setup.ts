import { BrowserContext, Page, test as setup } from '@playwright/test';

import { Constants } from '@gt-test-data/constants/constants.ts';
import { User } from '@gt-models/user.ts';
import { UsersFactory } from '@gt-factories/users-factory.ts';
import { prepareRegisteredRandomUser } from '@gt-helpers/auth/auth.helper.ts';

const user: User = UsersFactory.randomUser();
const authFilePath: string = Constants.DEFAULT_STORAGE_STATE_PATH;

// TODO: Replace with signUpOrLoadStorage() if logout is not needed or with login to existing test admin user
setup(
  '🔐 Initial prepare of random user',
  async ({ page, context }: { page: Page; context: BrowserContext }): Promise<void> => {
    await prepareRegisteredRandomUser({ user, authFilePath, page, context });
  },
);
