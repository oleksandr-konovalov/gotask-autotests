import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Header } from '@gt-app/components/headers/header.component.ts';

export class CreateOrderHeader extends Header {
  protected header: Locator;

  public constructor(page: Page, context: BrowserContext, header: Locator) {
    super(page, context);
    this.header = header;
    this.title = this.header.locator('.create-order-header-title');
  }

  public async expectLoaded(message: string = 'Expected header is visible'): Promise<void> {
    await expect(this.header, message).toBeVisible();
  }
}
