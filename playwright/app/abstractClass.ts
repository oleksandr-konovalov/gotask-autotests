import { BrowserContext, Page } from '@playwright/test';

/**
 * Abstract class representing a holder for a Playwright page and browser context.
 */
export abstract class PageHolder {
  /**
   * Constructor for the PageHolder class.
   * @param page - The Playwright Page object.
   * @param context - The Playwright BrowserContext object.
   */
  public constructor(
    protected page: Page,
    protected context: BrowserContext,
  ) {}
}

/**
 * Abstract class representing a component within a page.
 * Extends the PageHolder class to inherit page and context properties.
 */
export abstract class Component extends PageHolder {
  /**
   * Abstract method to validate that the component is loaded.
   * Must be implemented by subclasses to define specific loading expectations.
   * @param message - Parameter for additional validation logic.
   * @returns A promise that resolves when the page is confirmed to be loaded.
   */
  public abstract expectLoaded(message?: string): Promise<void>;
}

/**
 * Abstract class representing a specific page in the application.
 * Extends the Component class and provides methods for page navigation and validation.
 */
export abstract class AppPage extends Component {
  /**
   * Path to the page. Can be relative to the baseUrl defined in `playwright.config.ts`
   * or absolute (use at your own risk).
   */
  protected abstract pagePath: string;

  /**
   * Opens the page in the browser.
   * Navigates to the specified path or the default `pagePath` and ensures the page is loaded.
   * @param path - Optional path to navigate to. Defaults to `pagePath`.
   * @returns A promise that resolves when the page is opened and loaded.
   */
  public async open(path?: string): Promise<void> {
    await this.page.goto(path ?? this.pagePath);
    await this.expectLoaded();
  }

  /**
   * Reloads the page in the browser.
   * Optionally waits for the page to load after reloading.
   * @param withLoadWaiter - Whether to wait for the page to load after reloading. Defaults to `true`.
   * @returns A promise that resolves when the page is reloaded and optionally loaded.
   */
  public async reload(withLoadWaiter: boolean = true): Promise<void> {
    await this.page.reload();
    if (withLoadWaiter) {
      await this.expectLoaded();
    }
  }

  public async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
