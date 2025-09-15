import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Component } from '@gt-app/abstractClass.ts';

export class Select extends Component {
  private select: Locator;
  private option: Locator;

  public constructor(page: Page, context: BrowserContext, selectLocator: Locator) {
    super(page, context);
    this.select = selectLocator;
    this.option = page.locator('nz-option-item');
  }

  public async expectLoaded(message: string = 'Expected select is visible'): Promise<void> {
    await expect(this.select, message).toBeVisible();
  }

  public async chooseOptionByText(text: string): Promise<void> {
    await this.open();
    await this.option.getByText(text, { exact: true }).click();
  }

  private async open(): Promise<void> {
    await this.select.click();
    await expect(this.select).toHaveAttribute('class', /ant-select-open/);
  }
}
