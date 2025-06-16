import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Button } from '@gt-app/components/button.component.ts';
import { Component } from '@gt-app/abstractClass.ts';
import { Constants } from '@gt-test-data/constants/constants.ts';
import { DateIntervals } from '@gt-types/dates.ts';
import { Response } from '@playwright/test';
import { getDateWithFormat } from '@gt-helpers/base.ts';

export class DateTimePicker extends Component {
  private datepicker: Locator;
  private datepickerPopup: Locator;
  private yearButton: Button;
  private monthButton: Button;
  private dateCell: Locator;
  private timePicker: Locator;
  private timePickerPopup: Locator;
  private hoursOption: Locator;
  private minutesOption: Locator;
  private meridiemOption: Locator;

  public constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.datepicker = page.locator('nz-date-picker');
    this.datepickerPopup = page.locator('date-range-popup');
    this.yearButton = new Button(page, context, this.datepickerPopup.locator('button.ant-picker-header-year-btn'));
    this.monthButton = new Button(page, context, this.datepickerPopup.locator('button.ant-picker-header-month-btn'));
    this.dateCell = this.datepickerPopup.locator('td[role="gridcell"]');
    this.timePicker = page.locator('nz-time-picker');
    this.timePickerPopup = page.locator('nz-time-picker-panel');
    this.hoursOption = this.timePickerPopup.locator('ul').nth(0).locator('li');
    this.minutesOption = this.timePickerPopup.locator('ul').nth(1).locator('li');
    this.meridiemOption = this.timePickerPopup.locator('ul').nth(2).locator('li');
  }

  public async expectLoaded(message: string = 'Expected datepicker is visible'): Promise<void> {
    await expect(this.datepickerPopup, message).toBeVisible();
  }

  public async selectDate(date: DateIntervals): Promise<void> {
    const formattedCellDate: string = getDateWithFormat(date, 'M/dd/yyyy');
    const formattedDate: string = getDateWithFormat(date, 'MMM dd, yyyy');
    const year: string = getDateWithFormat(date, 'yyyy');
    const month: string = getDateWithFormat(date, 'MMM');

    await this.datepicker.click();
    await this.expectLoaded();

    if (!(await this._checkButtonText(this.yearButton, year))) {
      await this.yearButton.click();
      await this._selectCell(year);
      await this._checkButtonText(this.yearButton, year);
    }

    if (!(await this._checkButtonText(this.monthButton, month))) {
      await this.monthButton.click();
      await this._selectCell(month);
      await this._checkButtonText(this.monthButton, month);
    }

    await this._selectCell(formattedCellDate);
    const responsePromise: Promise<Response> = this.page.waitForResponse(
      (resp: Response) =>
        resp.url().includes('/api/order/draft') && ['POST', 'PATCH'].includes(resp.request().method()),
    );
    await this._focusOut();
    await responsePromise;
    await expect(this.datepicker.locator('input')).toHaveValue(formattedDate);
  }

  public async selectTime(minutes: string, hours: string, meridiem: string): Promise<void> {
    await this.timePicker.click();
    await this.hoursOption.getByText(hours).click();
    await this.minutesOption.getByText(minutes).click();
    await this.meridiemOption.getByText(meridiem).click();
    const responsePromise: Promise<Response> = this.page.waitForResponse(
      (resp: Response) => resp.url().includes('/api/order/draft') && resp.request().method() === 'PATCH',
    );
    await this._focusOut();
    await responsePromise;
    await expect(this.timePicker.locator('input')).toHaveValue(`${hours}:${minutes} ${meridiem}`);
  }

  private async _selectCell(value: string): Promise<void> {
    await this.dateCell.locator(`:scope[title="${value}"]`).click();
  }

  private async _checkButtonText(button: Button, text: string): Promise<boolean> {
    try {
      await expect(button.button, `Expected button to contain text "${text}"`).toContainText(text, {
        timeout: Constants.FIVE_SECONDS,
      });
      return true;
    } catch (_error) {
      return false;
    }
  }

  private async _focusOut(): Promise<void> {
    await this.page.locator('body').click();
  }
}
