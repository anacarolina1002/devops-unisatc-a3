import { test, expect } from "@playwright/test";

test("should login as admin", async ({ page }) => {
  await page.goto("/admin");
  await page.fill('input[name="email"]', "admin@satc.edu.br");
  await page.fill('input[name="password"]', "welcomeToStrapi123");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/admin(\/|$)/);
});

test("should login as editor", async ({ page }) => {
  await page.goto("/admin");
  await page.fill('input[name="email"]', "editor@satc.edu.br");
  await page.fill('input[name="password"]', "welcomeToStrapi123");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/admin(\/|$)/);
});
