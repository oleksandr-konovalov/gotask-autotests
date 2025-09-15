import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Button } from '@gt-app/components/button.component.ts';
import { Component } from '@gt-app/abstractClass.ts';
import { DateTimePicker } from '@gt-app/components/dateTimePicker.component.ts';
import { Input } from '@gt-app/components/input.component.ts';
import { OptionControl } from '@gt-app/components/optionControl.component.ts';
import { PanelType } from '@gt-types/enums/createOrder.ts';
import { Select } from '@gt-app/components/select.component.ts';

export class CreateOrderForm extends Component {
  public contentTypeSelect: Select;
  public serviceRadio: OptionControl;
  public languageRadio: OptionControl;
  public sizeTypeRadio: OptionControl;
  public quantityInput: Input;
  public lineSpacingSelect: Select;
  public nextButton: Button;
  public datepicker: DateTimePicker;
  public topicInput: Input;
  public themeRadio: OptionControl;
  public contentRequirementsInput: Input;
  public estimatedPrice: Locator;
  public confirmButton: Button;
  public formPanel: Locator;
  private form: Locator;

  public constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.form = this.page.locator('create-order-form');
    this.formPanel = this.form.locator('nz-collapse-panel');
    this.contentTypeSelect = new Select(
      this.page,
      this.context,
      this.formPanel.locator('product-input-adaptive').locator('nz-select'),
    );
    this.serviceRadio = new OptionControl(
      this.page,
      this.context,
      this.formPanel.locator('create-order-services-tags').locator('[nz-radio-button]'),
    );
    this.languageRadio = new OptionControl(
      this.page,
      this.context,
      this.formPanel.locator('create-order-language-tags').locator('[nz-radio-button]'),
    );
    this.sizeTypeRadio = new OptionControl(
      this.page,
      this.context,
      this.formPanel.locator('create-order-pages').locator('nz-segmented').locator('label'),
    );
    this.quantityInput = new Input(
      this.page,
      this.context,
      this.formPanel.locator('create-order-quantity').locator('input'),
    );
    this.lineSpacingSelect = new Select(
      this.page,
      this.context,
      this.formPanel.locator('create-order-space').locator('nz-select'),
    );
    this.nextButton = new Button(
      this.page,
      this.context,
      this.formPanel.locator('create-order-form-input-card').locator('button[nztype="primary"]'),
    );
    this.datepicker = new DateTimePicker(this.page, this.context);
    this.topicInput = new Input(this.page, this.context, this.formPanel.locator('create-order-topic').locator('input'));
    this.themeRadio = new OptionControl(
      this.page,
      this.context,
      this.formPanel.locator('create-order-subject-tags').locator('[nz-radio-button]'),
    );
    this.contentRequirementsInput = new Input(this.page, this.context, this.formPanel.locator('#wysiwyg-editor'));
    this.estimatedPrice = this.formPanel.locator('create-order-price');
    this.confirmButton = new Button(
      this.page,
      this.context,
      this.formPanel.locator('confirm-button').locator('button'),
    );
  }

  public async expectLoaded(message: string = 'Expected form is visible'): Promise<void> {
    await expect(this.form, message).toBeVisible();
  }

  public async expectPanelHasValue(panelName: PanelType, text: string): Promise<void> {
    await expect(
      this.formPanel.filter({ hasText: panelName }),
      `Expected ${panelName} panel to have ${text} text`,
    ).toContainText(text);
  }
}
