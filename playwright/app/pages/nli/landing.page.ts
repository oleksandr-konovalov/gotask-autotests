import { Locator, expect } from '@playwright/test';

import { AppPage } from '@gt-app/abstractClass.ts';
import { NLIHeader } from '@gt-app/components/headers/nliHeader.component.ts';

export class Landing extends AppPage {
  protected pagePath: string = `${process.env.BASE_NLI_URL}`;
  private header: NLIHeader = new NLIHeader(this.page, this.context, this.page.locator('header'));
  private primarySection: Locator = this.page.locator('section.overflow-hidden').first();

  public async expectLoaded(message: string = 'Expected Landing page opened'): Promise<void> {
    await expect(this.primarySection, message).toBeVisible();
  }

  public async openSignUp(): Promise<void> {
    await this.header.signUpButton.click();
  }
}
