import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Component } from '@gt-app/abstractClass.ts';

export class Header extends Component {
  protected header: Locator;

  public constructor(page: Page, context: BrowserContext, header: Locator) {
    super(page, context);
    this.header = header;
  }

  public async expectLoaded(message: string = 'Expected header is visible'): Promise<void> {
    await expect(this.header, message).toBeVisible();
  }
}
