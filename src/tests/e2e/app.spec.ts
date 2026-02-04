// tests e2e avec playwright - version simplifiee

import { test, expect } from "@playwright/test";

// Un seul test de base pour valider que le site fonctionne
test.describe("tests basiques", () => {
  test("la page se charge correctement", async ({ page }) => {
    await page.goto("/");

    // Verifier les elements de base
    await expect(page.getByText("Meteo Web")).toBeVisible();
    await expect(page.getByPlaceholder(/rechercher une ville/i)).toBeVisible();
  });
});
