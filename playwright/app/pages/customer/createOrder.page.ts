import { ContentType, Language, LineSpacing, PanelType, ServiceType, SizeType } from '@gt-types/enums/createOrder.ts';
import { Locator, expect } from '@playwright/test';

import { AppPage } from '@gt-app/abstractClass.ts';
import { CreateOrderForm } from '@gt-app/components/forms/createOrderForm.component.ts';
import { CreateOrderHeader } from '@gt-app/components/headers/createOrderHeader.component.ts';
import { DateIntervals } from '@gt-types/dates.ts';
import { DepositDialog } from '@gt-app/components/dialogs/depositDialog.component.ts';
import { PageTitle } from '@gt-types/enums/pageTitles.ts';
import { getDateWithFormat } from '@gt-helpers/base.ts';

export class CreateOrder extends AppPage {
  protected pagePath: string = `${process.env.BASE_URL}/customer/draft/new`;
  public depositDialog: DepositDialog = new DepositDialog(this.page, this.context);
  private createOrderForm: CreateOrderForm = new CreateOrderForm(this.page, this.context);
  private mainBlock: Locator = this.page.locator('create-order-outlet');
  private header: CreateOrderHeader = new CreateOrderHeader(
    this.page,
    this.context,
    this.page.locator('create-order-header'),
  );
  private paymentResult: Locator = this.page.locator('nz-result');

  public async expectLoaded(message: string = 'Expected Create Order page opened'): Promise<void> {
    await expect(this.mainBlock, message).toBeVisible();
    await this.header.expectTitle(PageTitle.CREATE_NEW_ORDER);
  }

  public async selectContentType(contentType: ContentType): Promise<void> {
    await this.createOrderForm.contentTypeSelect.chooseOptionByText(contentType);
    await this.createOrderForm.expectPanelHasValue(PanelType.CONTENT_TYPE, contentType);
  }

  public async setServiceRadio(service: ServiceType): Promise<void> {
    await this.createOrderForm.serviceRadio.check({ labelText: service, isVisible: false, exact: true });
    await this.createOrderForm.expectPanelHasValue(PanelType.SERVICE, service);
  }

  public async setLanguageRadio(language: Language): Promise<void> {
    await this.createOrderForm.languageRadio.check({ labelText: language, isVisible: false });
    await this.createOrderForm.expectPanelHasValue(PanelType.LANGUAGE, language);
  }

  public async setSize(data: { sizeType: SizeType; quantity: number; lineSpacing: LineSpacing }): Promise<void> {
    const wordsQuantity: string =
      data.lineSpacing === LineSpacing.DOUBLE ? String(data.quantity * 275) : String(data.quantity * 550);

    await this.createOrderForm.sizeTypeRadio.check({ labelText: data.sizeType, isVisible: false });
    await this.createOrderForm.quantityInput.fill({ text: String(data.quantity) });
    await this.createOrderForm.lineSpacingSelect.chooseOptionByText(data.lineSpacing);
    await this.createOrderForm.nextButton.click();
    await this.createOrderForm.expectPanelHasValue(
      PanelType.SIZE,
      `${data.quantity} ${data.sizeType.toLowerCase()} (~ ${wordsQuantity} words), ${data.lineSpacing.toLowerCase()} spacing`,
    );
  }

  public async setDeadline(
    date: DateIntervals,
    time?: { minutes: string; hours: string; meridiem: string },
  ): Promise<void> {
    await this.createOrderForm.datepicker.selectDate(date);

    if (time) {
      await this.createOrderForm.datepicker.selectTime(time.minutes, time.hours, time.meridiem);
    }

    await this.createOrderForm.nextButton.click();
    await this.createOrderForm.expectPanelHasValue(
      PanelType.DEADLINE,
      `${getDateWithFormat(date, 'MMMM dd')} ${time.hours}:${time.minutes} ${time.meridiem}`,
    );
  }

  public async setTopic(topic: string): Promise<void> {
    await this.createOrderForm.topicInput.fill({ text: topic });
    await this.createOrderForm.nextButton.click();
    await this.createOrderForm.expectPanelHasValue(PanelType.TOPIC, topic);
  }

  public async setThemeViaRadio(theme: string): Promise<void> {
    await this.createOrderForm.themeRadio.check({ labelText: theme });
    await this.createOrderForm.nextButton.click();
    await this.createOrderForm.expectPanelHasValue(PanelType.THEME, theme);
  }

  public async setContentRequirements(requirements: string): Promise<void> {
    await this.createOrderForm.contentRequirementsInput.fillTextArea({ text: requirements });
    await this.createOrderForm.nextButton.click();
    await this.createOrderForm.expectPanelHasValue(PanelType.CONTENT_REQUIREMENTS, requirements);
  }

  public async expectEstimatedPrice(price: string): Promise<void> {
    const estimatedPrice: string = await this.createOrderForm.estimatedPrice.innerText();
    expect(estimatedPrice.replace('\n', ' ')).toEqual(`Estimated price: ${price}`);
  }

  public async submitOrder(): Promise<void> {
    await this.createOrderForm.confirmButton.expectEnabled();
    await this.createOrderForm.confirmButton.click();
    await expect(this.createOrderForm.formPanel).not.toBeVisible();
  }

  public async expectPaymentResult(text: string): Promise<void> {
    await expect(this.paymentResult, `Expected payment result to contain: ${text}`).toContainText(text);
  }
}
