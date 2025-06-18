import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Button } from '@gt-app/components/button.component.ts';
import { Dialog } from '@gt-app/components/dialog.component.ts';

export class ConfirmationDialog extends Dialog {
  protected dialog: Locator = this.page.locator('nz-modal-confirm-container');
  private deleteButton: Button;

  public constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.deleteButton = new Button(page, context, this.dialog.locator('button', { hasText: 'Delete' }));
  }

  public async expectLoaded(message: string = 'Expected Confirmation Dialog opened'): Promise<void> {
    await expect(this.dialog, message).toBeVisible();
  }

  public async delete(): Promise<void> {
    await this.deleteButton.click();
    await expect(this.dialog).not.toBeVisible();
  }
}
