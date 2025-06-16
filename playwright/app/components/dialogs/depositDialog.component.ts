import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Button } from '@gt-app/components/button.component.ts';
import { Dialog } from '@gt-app/components/dialog.component.ts';
import { DialogTitle } from '@gt-types/enums/dialogTitles.ts';
import { LoadingState } from '@gt-app/components/loadingState.component.ts';
import { OptionControl } from '@gt-app/components/optionControl.component.ts';
import { PaymentForm } from '@gt-app/components/forms/paymentForm.component.ts';

export class DepositDialog extends Dialog {
  private headerTitle: Locator;
  private depositAmount: Locator;
  private agreementCheckbox: OptionControl;
  private proceedButton: Button;
  private loadingState: LoadingState;
  private paymentForm: PaymentForm;

  public constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.dialog = this.dialog.locator('deposit-dialog-component');
    this.headerTitle = this.dialog.locator('span.ng-star-inserted', { hasText: DialogTitle.DEPOSIT });
    this.depositAmount = this.dialog.locator('deposit-amount').locator('input[name="amount"]');
    this.agreementCheckbox = new OptionControl(this.page, this.context, this.dialog.locator('deposit-agreement'));
    this.proceedButton = new Button(this.page, this.context, this.dialog.locator('#deposit-proceed-button'));
    this.loadingState = new LoadingState(this.page, this.context, this.dialog);
    this.paymentForm = new PaymentForm(this.page, this.context);
  }

  public async expectLoaded(message: string = 'Expected Deposit dialog opened'): Promise<void> {
    await expect(this.dialog, message).toBeVisible();
    await expect(this.headerTitle, `Expect Deposit dialog title be visible`).toBeVisible();
    await this.loadingState.expectDialogSpinnerLoaded();
  }

  public async expectDepositAmount(amount: string): Promise<void> {
    await expect(this.depositAmount, `Expect deposit amount to be: ${amount}`).toHaveValue(amount);
  }

  public async proceedToPaymentDetails(): Promise<void> {
    await this.agreementCheckbox.check();
    await this.proceedButton.expectEnabled();
    await this.proceedButton.click();
    await this.loadingState.expectDialogSpinnerLoaded();
    await this.paymentForm.expectLoaded();
  }

  public async fillCardDetailsAndProceed(data: {
    cardNumber: string;
    cardHolderName: string;
    expiryDate: string;
    cvv: string;
  }): Promise<void> {
    await this.paymentForm.creditCardNumberInput.fill({ text: data.cardNumber });
    await this.paymentForm.cardExpiryInput.fill({ text: data.expiryDate });
    await this.paymentForm.cardCVVInput.fill({ text: data.cvv });
    await this.paymentForm.nameOnCardInput.fill({ text: data.cardHolderName });
    await this.paymentForm.submitButton.click();
    await this.paymentForm.loadingState.expect3DSecureSpinnerLoaded();
  }
}
