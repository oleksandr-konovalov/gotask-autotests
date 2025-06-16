import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Component } from '@gt-app/abstractClass.ts';

export class Tab extends Component {
  private tab: Locator;

  public constructor(page: Page, context: BrowserContext, text?: string) {
    super(page, context);
    this.tab = text ? page.getByRole('tab', { name: text }) : page.getByRole('tab');
  }

  public async expectLoaded(message: string = 'Expected tab is visible'): Promise<void> {
    await expect(this.tab, message).toBeVisible();
  }

  public async expectSelected(): Promise<void> {
    await expect(this.tab, `Expect tab to be selected`).toHaveAttribute('aria-selected', 'true');
  }

  public async select(): Promise<void> {
    await this.tab.click();
    await this.expectSelected();
    await this.page.waitForTimeout(100);
  }
}
