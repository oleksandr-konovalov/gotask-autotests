import { BrowserContext, FrameLocator, Locator, Page, expect } from '@playwright/test';

import { Button } from '@gt-app/components/button.component.ts';
import { Component } from '@gt-app/abstractClass.ts';
import { Input } from '@gt-app/components/input.component.ts';
import { LoadingState } from '@gt-app/components/loadingState.component.ts';

export class PaymentForm extends Component {
  public creditCardNumberInput: Input;
  public cardExpiryInput: Input;
  public cardCVVInput: Input;
  public nameOnCardInput: Input;
  public submitButton: Button;
  public loadingState: LoadingState;
  private iFrame: FrameLocator;
  private form: Locator;

  public constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.iFrame = page.frameLocator('iframe[name="solid-payment-form-iframe"]');
    this.form = this.iFrame.locator('[data-testid="paymentForm"]');
    this.creditCardNumberInput = new Input(page, context, this.form.locator('input#ccnumber'));
    this.cardExpiryInput = new Input(page, context, this.form.locator('input#cardExpiry'));
    this.cardCVVInput = new Input(page, context, this.form.locator('input#cvv2'));
    this.nameOnCardInput = new Input(page, context, this.form.locator('input#nameoncard'));
    this.submitButton = new Button(page, context, this.form.locator('button[data-testid="submit-button"]'));
    this.loadingState = new LoadingState(page, context, this.form);
  }

  public async expectLoaded(message: string = 'Expected Payment Form opened'): Promise<void> {
    await expect(this.form, message).toBeVisible();
  }
}
