import { expect, test } from "@playwright/test";

test.describe("Podcast List", () => {
  test("should display podcasts list and filter functionality", async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto("/");

    // Wait for podcasts to load
    await page.waitForSelector(".podcast-grid");

    // Step 1: Verify podcasts are displayed
    const podcastCards = page.locator(".podcast-card");
    await expect(podcastCards).not.toHaveCount(0);

    // Verify filter bar is visible
    const filterInput = page.locator('input[placeholder="Filter podcasts..."]');
    await expect(filterInput).toBeVisible();

    // Verify podcast count label is visible
    const countLabel = page.locator(".header-home-search_label");
    await expect(countLabel).toBeVisible();

    // Get initial count of podcasts
    const initialCount = await podcastCards.count();
    console.log(`Initial podcast count: ${initialCount}`);

    // Step 2: Filter by "JOE"
    await filterInput.fill("JOE");

    // Wait a bit for filtering to complete
    await page.waitForTimeout(500);

    // Verify at least one podcast is displayed after filtering
    const joeFilteredPodcasts = page.locator(".podcast-card");
    const joeCount = await joeFilteredPodcasts.count();
    expect(joeCount).toBeGreaterThan(0);
    console.log(`Podcasts matching "JOE": ${joeCount}`);

    // Step 3: Filter by "TEST EMPTY" (should show no results)
    await filterInput.fill("TEST EMPTY");

    // Wait a bit for filtering to complete
    await page.waitForTimeout(500);

    // Verify no podcasts are displayed
    const emptyFilteredPodcasts = page.locator(".podcast-card");
    await expect(emptyFilteredPodcasts).toHaveCount(0);

    // Verify "No podcasts found" message is displayed
    const emptyMessage = page.locator(".home-page__empty");
    await expect(emptyMessage).toBeVisible();
    await expect(emptyMessage).toHaveText("No podcasts found");
  });
});
