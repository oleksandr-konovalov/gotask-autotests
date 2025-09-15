import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Component } from '@gt-app/abstractClass.ts';
import { Constants } from '@gt-test-data/constants/constants.ts';

export enum LoadingStatesEnum {
  BUTTON_SPINNER = 'span[nztype="loading"]',
  DIALOG_SPINNER = 'nz-spin div.ant-spin',
  THREE_D_SECURE_SPINNER = 'circle',
}

export class LoadingState extends Component {
  private parent: Locator;
  private buttonSpinner: Locator;
  private dialogSpinner: Locator;
  private threeDSecureSpinner: Locator;

  public constructor(page: Page, context: BrowserContext, parentLocator?: Locator) {
    super(page, context);
    this.parent = parentLocator ?? this.page.locator('body');
    this.buttonSpinner = this.parent.locator(LoadingStatesEnum.BUTTON_SPINNER);
    this.dialogSpinner = this.parent.locator(LoadingStatesEnum.DIALOG_SPINNER);
    this.threeDSecureSpinner = this.parent.locator(LoadingStatesEnum.THREE_D_SECURE_SPINNER);
  }

  public async expectLoaded(message: string = 'Expected loading state visible'): Promise<void> {
    await expect(this.dialogSpinner, message).toBeVisible();
  }

  public async expectButtonSpinnerLoaded(): Promise<void> {
    await expect(this.buttonSpinner, 'Expect button spinner to be visible').toBeVisible();
    await expect(this.buttonSpinner, 'Expect button spinner NOT to be visible').not.toBeVisible({
      timeout: Constants.SIXTY_SECONDS,
    });
  }

  public async expectDialogSpinnerLoaded(): Promise<void> {
    await expect(this.dialogSpinner, 'Expect dialog spinner to be visible').toBeVisible();
    await expect(this.dialogSpinner, 'Expect dialog spinner NOT to be visible').not.toBeVisible({
      timeout: Constants.SIXTY_SECONDS,
    });
  }

  public async expect3DSecureSpinnerLoaded(): Promise<void> {
    await expect(this.threeDSecureSpinner, 'Expect 3DSecure spinner to be visible').toBeVisible();
    await expect(this.threeDSecureSpinner, 'Expect 3DSecure spinner NOT to be visible').not.toBeVisible({
      timeout: Constants.SIXTY_SECONDS,
    });
  }
}
