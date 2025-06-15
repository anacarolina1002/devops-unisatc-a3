import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class StrapiHelpers {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.context().clearCookies();
    await this.page.goto("/admin", { waitUntil: 'networkidle' });
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForSelector("text=Content Manager");
  }

  async goToContentManager() {
    await this.page.click("text=Content Manager");
  }

  async goToCollection(collectionName: string) {
    await this.page.click(`text=${collectionName}`);
  }

  async createNewEntry() {
    await this.page.click("text=Create new entry");
  }

  async saveEntry() {
    await this.page.click('button:has-text("Save")');
  }

  async addComponentBlock(componentName: string) {
    await this.page.click('button:has-text("Add a component to Blocos")');
    await this.page.click(`button:has-text("${componentName}")`);
    return this.page.locator(`li:has-text("${componentName}")`);
  }

  async openOrCloseComponentBlock(component: Locator, text: string) {
    await component.locator(`button:has-text("${text}")`).click();
  }

  async fillRichText(component: Locator, content: string) {
    await component.locator('div[contenteditable="true"]').fill(content);
  }

  async fillQuote(component: Locator, author: string, quote: string) {
    await component.locator("input").fill(author);
    await component.locator("textarea").fill(quote);
  }

  async addMedia(component: Locator, assetName: string) {
    await component.locator('button:has-text("Click to add an asset")').click();
    await this.page.waitForLoadState("networkidle");
    await this.page
      .locator(`article:has-text("${assetName}")`)
      .getByRole("checkbox")
      .click();
    await this.page.click('button:has-text("Finish")');
  }

  async addSlider(component: Locator) {
    await component.locator('button:has-text("Click to add an asset")').click();
    await this.page.waitForLoadState("networkidle");
    await this.page
      .getByRole("checkbox", { name: "Select all assets" })
      .click();
    await this.page.click('button:has-text("Finish")');
  }

  async selectOption(label: string, option: string) {
    await this.page.click(`label:has-text("${label}") + div [role="combobox"]`);
    await this.page.fill(`label:has-text("${label}") + div [role="combobox"]`, option);
    await this.page.waitForSelector(`div[role="option"]:has-text("${option}")`);
    await this.page.click(`div[role="option"]:has-text("${option}")`);
  }

  async expectEntryVisible(title: string) {
    await expect(this.page.locator(`text=${title}`).first()).toBeVisible();
  }

  async expectComponentVisible(componentName: string) {
    await expect(
      this.page.locator(`text=${componentName}`).first()
    ).toBeVisible();
  }

  static randomString(prefix = "", length = 8) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let str = prefix;
    for (let i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }
}
