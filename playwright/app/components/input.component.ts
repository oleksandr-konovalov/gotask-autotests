import { BrowserContext, Locator, Page, expect, test } from '@playwright/test';

import { Component } from '@gt-app/abstractClass.ts';

export class Input extends Component {
  public input: Locator;

  public constructor(page: Page, context: BrowserContext, inputLocator: Locator) {
    super(page, context);
    this.input = inputLocator;
  }

  public async expectLoaded(message: string = 'Expected input is visible'): Promise<void> {
    await expect(this.input, message).toBeVisible();
  }

  public async fill({
    text,
    isClearInputOnly,
    pressSequentially = false,
  }: {
    text?: string;
    isClearInputOnly?: boolean;
    pressSequentially?: boolean;
  }): Promise<void> {
    await this.input.focus();
    if (isClearInputOnly) {
      await test.step(`Clear input field`, async () => {
        return this.input.clear();
      });
    }

    await test.step(`Fill input with "${text}"`, async () => {
      pressSequentially ? await this.input.pressSequentially(text, { delay: 100 }) : await this.input.fill(text);
    });
  }
}
