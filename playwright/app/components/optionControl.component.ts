import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Component } from '@gt-app/abstractClass.ts';

export class OptionControl extends Component {
  private option: Locator;

  public constructor(page: Page, context: BrowserContext, option: Locator) {
    super(page, context);
    this.option = option;
  }

  public async expectLoaded(message: string = 'Expected radiobutton to be visible'): Promise<void> {
    await expect(this.option.first(), message).toBeVisible();
  }

  public async check(
    data: { labelText?: string; isVisible?: boolean; exact?: boolean } = { isVisible: true },
  ): Promise<void> {
    const targetOption: Locator = data.labelText
      ? this.option.getByText(data.labelText, { exact: data.exact ?? false })
      : this.option;

    data.isVisible
      ? await targetOption.locator('input[type="radio"]').or(targetOption.locator('input[type="checkbox"]')).check()
      : await targetOption.click({ force: true });
  }
}
