import { test, expect } from "@playwright/test";
import { StrapiHelpers } from "../utils/strapi-helpers";

test.describe("Articles", () => {
  let strapi: StrapiHelpers;

  test.beforeEach(async ({ page }) => {
    strapi = new StrapiHelpers(page);
    await strapi.login("admin@satc.edu.br", "welcomeToStrapi123");
  });

  test("should create article with all block types", async ({ page }) => {
    const testData = {
      title: StrapiHelpers.randomString("Art_", 6),
      slug: StrapiHelpers.randomString("slug_", 6),
      description: StrapiHelpers.randomString("Desc_", 20),
      richText: StrapiHelpers.randomString("RichText_", 20),
      quote: {
        author: StrapiHelpers.randomString("Author_", 6),
        text: StrapiHelpers.randomString("Quote_", 20),
      },
    };

    await strapi.goToContentManager();
    await strapi.goToCollection("Artigo");
    await strapi.createNewEntry();
    await page.fill('input[name="title"]', testData.title);
    await page.fill('input[name="slug"]', testData.slug);
    await page.fill('textarea[name="description"]', testData.description);
    const coverComponent = page.locator('div:has-text("Cover")');
    await strapi.addMedia(coverComponent, "default-image");

    const richTextComponent = await strapi.addComponentBlock("Rich text");
    await strapi.openOrCloseComponentBlock(richTextComponent, "Rich text");
    await strapi.fillRichText(richTextComponent, testData.richText);
    await strapi.openOrCloseComponentBlock(richTextComponent, "Rich text");

    const quoteComponent = await strapi.addComponentBlock("Quote");
    await strapi.openOrCloseComponentBlock(quoteComponent, "Quote");
    await strapi.fillQuote(
      quoteComponent,
      testData.quote.author,
      testData.quote.text
    );
    await strapi.openOrCloseComponentBlock(quoteComponent, "Quote");

    const mediaComponent = await strapi.addComponentBlock("Media");
    await strapi.openOrCloseComponentBlock(mediaComponent, "Media");
    await strapi.addMedia(mediaComponent, "default-image");
    await strapi.openOrCloseComponentBlock(mediaComponent, "Media");

    const sliderComponent = await strapi.addComponentBlock("Slider");
    await strapi.openOrCloseComponentBlock(sliderComponent, "Slider");
    await strapi.addSlider(sliderComponent);
    await strapi.openOrCloseComponentBlock(sliderComponent, "Slider");

    await strapi.selectOption("Categoria", "news");
    await strapi.selectOption("Autor", "Sarah Baker");

    await strapi.saveEntry();

    await strapi.expectEntryVisible(testData.title);

    await page.click(`text=${testData.title}`);

    expect(await page.locator('input[name="title"]').inputValue()).toBe(
      testData.title
    );
    expect(await page.locator('input[name="slug"]').inputValue()).toBe(
      testData.slug
    );

    await strapi.expectComponentVisible("Rich text");
    await strapi.expectComponentVisible("Quote");
    await strapi.expectComponentVisible("Media");
    await strapi.expectComponentVisible("Slider");
  });
});
