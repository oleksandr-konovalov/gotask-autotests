import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { ActionOptions } from '@gt-types/actionOptions.ts';
import { Component } from '@gt-app/abstractClass.ts';
import { Constants } from '@gt-test-data/constants/constants.ts';

export class Button extends Component {
  private button: Locator;
  private spinner: Locator;
  private spinnerSelector: string;

  public constructor(page: Page, context: BrowserContext, button: Locator, buttonSpinnerSelector?: string) {
    super(page, context);
    this.button = button;
    if (buttonSpinnerSelector) {
      this.spinnerSelector = buttonSpinnerSelector;
      this.spinner = this.button.locator(buttonSpinnerSelector);
    }
  }

  public async expectLoaded(message: string = 'Expected button is visible'): Promise<void> {
    await expect(this.button, message).toBeVisible();
  }

  public async click(options: Partial<ActionOptions> & { withLoading?: boolean } = {}): Promise<void> {
    // Set default value for withLoading if it's not provided
    const { withLoading = false } = options;
    if (withLoading && Boolean(this.spinnerSelector)) {
      await this._buttonSpinnerCheck(options);
    } else {
      await this.button
        .nth(options.index ?? 0)
        .click({ timeout: options?.timeout ?? Constants.THIRTY_SECONDS, force: options.force ?? false });
    }
  }

  private async _buttonSpinnerCheck(options: Partial<ActionOptions>): Promise<void> {
    const buttonSpinner: Locator = this.spinner;
    await this.button.nth(options.index ?? 0).click();
    await expect(buttonSpinner, 'Expect button spinner to be visible').toBeVisible();
    await expect(buttonSpinner, 'Expect button spinner NOT to be visible').not.toBeVisible({
      timeout: Constants.SIXTY_SECONDS,
    });
  }
}
