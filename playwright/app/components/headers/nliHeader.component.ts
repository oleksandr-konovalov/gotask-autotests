import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Button } from '@gt-app/components/button.component.ts';
import { Header } from '@gt-app/components/headers/header.component.ts';

export class NLIHeader extends Header {
  public signUpButton: Button;
  public loginButton: Button;
  protected header: Locator;

  public constructor(page: Page, context: BrowserContext, header: Locator) {
    super(page, context, header);
    this.header = header;
    this.signUpButton = new Button(this.page, this.context, this.header.locator('a', { hasText: 'Sign Up' }));
    this.loginButton = new Button(this.page, this.context, this.header.locator('a', { hasText: 'Log In' }));
  }

  public async expectLoaded(message: string = 'Expected header is visible'): Promise<void> {
    await expect(this.header, message).toBeVisible();
  }
}
