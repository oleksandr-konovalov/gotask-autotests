import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { AppPage } from '@gt-app/abstractClass.ts';
import { ConfirmationDialog } from '@gt-app/components/dialogs/confirmationDialog.component.ts';
import { Header } from '@gt-app/components/headers/header.component.ts';
import { OrderItem } from '@gt-app/components/orderItem.component.ts';
import { PageTitle } from '@gt-types/enums/pageTitles.ts';
import { Tab } from '@gt-app/components/tab.component.ts';
import { TabNames } from '@gt-types/enums/tabs.ts';

export class MyOrders extends AppPage {
  protected pagePath: string = `${process.env.BASE_URL}/customer/orders`;
  public draftsTab: Tab;
  public orderItem: OrderItem = new OrderItem(this.page, this.context);
  public confirmationDialog: ConfirmationDialog = new ConfirmationDialog(this.page, this.context);
  private header: Header = new Header(this.page, this.context);
  private ordersBlock: Locator;

  public constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.ordersBlock = page.locator('customer-orders-ant');
    this.draftsTab = new Tab(page, context, TabNames.DRAFTS);
  }

  public async expectLoaded(message: string = 'Expected My Orders page opened'): Promise<void> {
    await expect(this.ordersBlock, message).toBeVisible();
    await this.header.expectTitle(PageTitle.MY_ORDERS);
  }
}
