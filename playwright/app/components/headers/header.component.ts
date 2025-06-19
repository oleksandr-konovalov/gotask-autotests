import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Component } from '@gt-app/abstractClass.ts';

export class Header extends Component {
  protected header: Locator;
  protected title: Locator;

  public constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.header = this.page.locator('nz-page-header');
    this.title = this.header.locator('nz-page-header-title');
  }

  public async expectLoaded(message: string = 'Expected header is visible'): Promise<void> {
    await expect(this.header, message).toBeVisible();
  }

  public async expectTitle(text: string): Promise<void> {
    await expect(this.title, `Expect title to contain: ${text}`).toHaveText(text);
  }
}
