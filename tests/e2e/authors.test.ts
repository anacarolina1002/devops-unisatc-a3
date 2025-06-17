import { test, expect, Page } from "@playwright/test";

function randomString(prefix = "", length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let str = prefix;
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

test("should create author", async ({ page }) => {
  await page.goto("/admin");
  await page.fill('input[name="email"]', "admin@satc.edu.br");
  await page.fill('input[name="password"]', "welcomeToStrapi123");
  await page.click('button[type="submit"]');

  await page.waitForSelector("text=Content Manager");
  await page.click("text=Content Manager");
  await page.click("text=Autor");

  const name = randomString("Author_", 6);
  const email = randomString("author", 4) + "@example.com";

  await page.click("text=Create new entry");
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', email);

  await page.click('button:has-text("Save")');
  await expect(page.locator(`text=${name}`)).toBeVisible();
});
