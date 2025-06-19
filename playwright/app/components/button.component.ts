import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { ActionOptions } from '@gt-types/actionOptions.ts';
import { Component } from '@gt-app/abstractClass.ts';
import { Constants } from '@gt-test-data/constants/constants.ts';
import { LoadingState } from '@gt-app/components/loadingState.component.ts';

export class Button extends Component {
  public button: Locator;
  private buttonSpinner: LoadingState;

  public constructor(page: Page, context: BrowserContext, button: Locator, hasSpinner?: boolean) {
    super(page, context);
    this.button = button;
    if (hasSpinner) {
      this.buttonSpinner = new LoadingState(this.page, this.context, this.button);
    }
  }

  public async expectLoaded(message: string = 'Expected button is visible'): Promise<void> {
    await expect(this.button, message).toBeVisible();
  }

  public async click(options: Partial<ActionOptions> & { withLoading?: boolean } = {}): Promise<void> {
    // Set default value for withLoading if it's not provided
    const { withLoading = false } = options;
    if (withLoading && Boolean(this.buttonSpinner)) {
      await this.button.nth(options.index ?? 0).click();
      await this.buttonSpinner.expectButtonSpinnerLoaded();
    } else {
      await this.button
        .nth(options.index ?? 0)
        .click({ timeout: options?.timeout ?? Constants.THIRTY_SECONDS, force: options.force ?? false });
    }
  }

  public async expectEnabled(message: string = 'Expected button to be enabled'): Promise<void> {
    await expect(this.button, message).toBeEnabled();
  }
}
