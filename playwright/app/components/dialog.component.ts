import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Button } from '@gt-app/components/button.component.ts';
import { Component } from '@gt-app/abstractClass.ts';

export class Dialog extends Component {
  protected dialog: Locator;
  private closeButton: Button;

  public constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.dialog = page.locator('nz-modal-container');
    this.closeButton = new Button(page, context, this.dialog.locator('button[nz-modal-close]'));
  }

  public async expectLoaded(message: string = 'Expected dialog is visible'): Promise<void> {
    await expect(this.dialog, message).toBeVisible();
  }

  public async close(): Promise<void> {
    await this.closeButton.click();
    await expect(this.dialog).not.toBeVisible();
  }
}
