import { test, expect } from "@playwright/test";
import { StrapiHelpers } from "../utils/strapi-helpers";

test.describe("Categories", () => {
  let strapi: StrapiHelpers;

  test.beforeEach(async ({ page }) => {
    strapi = new StrapiHelpers(page);
    await strapi.login("admin@satc.edu.br", "welcomeToStrapi123");
  });

  test("should create a new category", async ({ page }) => {
    const testData = {
      name: StrapiHelpers.randomString("Cat_", 6),
      slug: StrapiHelpers.randomString("slug_", 6),
      description: StrapiHelpers.randomString("Desc_", 12),
    };

    await strapi.goToContentManager();
    await strapi.goToCollection("Categoria");
    await strapi.createNewEntry();
    await page.fill('input[name="name"]', testData.name);
    await page.fill('input[name="slug"]', testData.slug);
    await page.fill('textarea[name="description"]', testData.description);

    await strapi.saveEntry();

    await strapi.expectEntryVisible(testData.name);
  });

  test("should prevent duplicate slugs", async ({ page }) => {
    const testData = {
      slug: "news",
    };

    await strapi.goToContentManager();
    await strapi.goToCollection("Categoria");
    await strapi.createNewEntry();
    await page.fill('input[name="slug"]', testData.slug);
    await strapi.saveEntry();

    await expect(
      page.getByRole("alert").getByText("This attribute must be unique")
    ).toBeVisible();
  });
});
