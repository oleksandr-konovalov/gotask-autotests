import { Locator, expect, test } from '@playwright/test';

import { AppPage } from '@gt-app/abstractClass.ts';
import { Button } from '@gt-app/components/button.component.ts';
import { Constants } from '@gt-test-data/constants/constants.ts';
import { Input } from '@gt-app/components/input.component.ts';
import { Tab } from '@gt-app/components/tab.component.ts';
import { TabNames } from '@gt-types/enums/tabs.ts';

export class Login extends AppPage {
  protected pagePath: string = `${process.env.BASE_URL}/auth/login`;
  private registerBlock: Locator = this.page.locator('auth-login-component');
  private signUpTab: Tab = new Tab(this.page, this.context, TabNames.LOG_IN);
  private emailInput: Input = new Input(this.page, this.context, this.registerBlock.locator('input[type="email"]'));
  private passwordInput: Input = new Input(
    this.page,
    this.context,
    this.registerBlock.locator('input[type="password"]'),
  );
  private loginWithEmailButton: Button = new Button(
    this.page,
    this.context,
    this.registerBlock.locator('button', { hasText: 'Sign in with email' }),
  );
  private submitButton: Button = new Button(
    this.page,
    this.context,
    this.registerBlock.locator('button.ant-btn-auth'),
    true,
  );

  public async expectLoaded(message: string = 'Expected Login page opened'): Promise<void> {
    await expect(this.registerBlock, message).toBeVisible();
    await this.signUpTab.expectSelected();
  }

  public async openLoginForm(): Promise<void> {
    await this.loginWithEmailButton.click();
    await this.emailInput.expectLoaded();
    await this.passwordInput.expectLoaded();
    await this.submitButton.expectLoaded();
  }

  public async fillLoginForm(userData: { email: string; password: string }): Promise<void> {
    await this.emailInput.fill({ text: userData.email });
    await this.passwordInput.fill({ text: userData.password });
  }

  public async fillLoginFormAndSubmit(userData: { email: string; password: string }): Promise<void> {
    await this.fillLoginForm(userData);
    await this.submitButton.click({ withLoading: true });
  }

  public async loginWithSavingStorage(data: { email: string; password: string; authFilePath: string }): Promise<void> {
    await this.open();
    await this.openLoginForm();
    await this.fillLoginFormAndSubmit({ email: data.email, password: data.password });
    await this.page.waitForURL(new RegExp('customer'), { timeout: Constants.SIXTY_SECONDS });

    await test.step(`🍪Storing access token in ${data.authFilePath}🍪`, async () => {
      await this.page.context().storageState({ path: data.authFilePath });
    });
  }
}
