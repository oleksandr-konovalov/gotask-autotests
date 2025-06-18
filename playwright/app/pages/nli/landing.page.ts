import { Locator, expect } from '@playwright/test';

import { AppPage } from '@gt-app/abstractClass.ts';
import { Dialog } from '@gt-app/components/dialog.component.ts';
import { NLIHeader } from '@gt-app/components/headers/nliHeader.component.ts';

export class Landing extends AppPage {
  protected pagePath: string = `${process.env.BASE_NLI_URL}`;
  private header: NLIHeader = new NLIHeader(this.page, this.context, this.page.locator('header'));
  private primarySection: Locator = this.page.locator('section.overflow-hidden').first();
  private locationWarningDialog: Dialog = new Dialog(this.page, this.context);

  public async expectLoaded(message: string = 'Expected Landing page opened'): Promise<void> {
    await expect(this.primarySection, message).toBeVisible();
  }

  public async openSignUp(): Promise<void> {
    await this.header.signUpButton.click();
  }

  public async open(): Promise<void> {
    await this.page.goto(this.pagePath);
    await this.expectLoaded();

    if (process.env.CI) {
      try {
        await Promise.race([
          this.locationWarningDialog.closeLocationWarningDialog(),
          // eslint-disable-next-line
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout: no dialog in 3s')), 3000)),
        ]);
      } catch (e) {
        console.warn('Could not close location warning dialog (not present):', e.message);
      }
    }
  }
}
