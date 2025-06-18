import { Locator, expect } from '@playwright/test';

import { Component } from '@gt-app/abstractClass.ts';

export class OrderItem extends Component {
  private ordersList: Locator = this.page.locator('orders-list-wrap');
  private orderItem: Locator = this.ordersList.locator('orders-item');
  private orderId: string = 'span.desk-order-item-block.no-display-with-chat';
  private assigmentSize: string = 'assignment-size-text';
  private contentType: string = 'span._ant-list-item-meta-description-product';
  private language: string = 'country-flag';
  private orderStatus: string = 'nz-tag';
  private orderPrice: string = 'order-item-block-price';
  private threeDotsIcon: string = '[nz-list-item-actions]';
  private rowAction: Locator = this.page.locator('[nz-menu-item]');

  public async expectLoaded(message: string = 'Expected Orders List visible'): Promise<void> {
    await expect(this.ordersList, message).toBeVisible();
  }

  public async checkOrderDetails(data: {
    title: string;
    size: string;
    contentType: string;
    language: string;
    status: string;
    price: string;
  }): Promise<void> {
    const order: Locator = this.orderItem.filter({ hasText: data.title });
    await expect(order, `Expected order with title "${data.title}" to be visible`).toBeVisible();
    await expect(order.locator(this.orderId), 'Expected order id to be visible').toBeVisible();
    await expect(order.locator(this.assigmentSize), `Expected order to have size ${data.size}`).toHaveText(data.size);
    await expect(
      order.locator(this.contentType).filter({ hasText: data.contentType }),
      `Expected order has ${data.contentType} content type`,
    ).toBeVisible();
    await expect(order.locator(this.language), `Expected order has ${data.language} language`).toHaveText(
      data.language,
    );
    await expect(order.locator(this.orderStatus), `Expected order has ${data.status} status`).toHaveText(data.status);
    await expect(order.locator(this.orderPrice), `Expected order has ${data.price} price`).toHaveText(
      `~ $${data.price}`,
    );
  }

  public async removeOrder(orderTitle: string): Promise<void> {
    const order: Locator = this.orderItem.filter({ hasText: orderTitle });
    await order.locator(this.threeDotsIcon).click();
    await this.rowAction.filter({ hasText: 'Discard draft' }).click();
  }

  public async expectNotExist(
    orderTitle: string,
    message: string = `Expected ${orderTitle} order to not exist`,
  ): Promise<void> {
    await expect(this.orderItem.filter({ hasText: orderTitle }), message).toHaveCount(0);
  }
}
