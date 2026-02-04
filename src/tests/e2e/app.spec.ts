// tests e2e avec playwright

import { test, expect } from "@playwright/test";

test.describe("meteo-aura e2e", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("affiche la page d'accueil", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /meteo en temps reel/i })).toBeVisible();
    await expect(page.getByPlaceholder(/rechercher une ville/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /ma position/i })).toBeVisible();
  });

  test("recherche une ville et affiche les suggestions", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/rechercher une ville/i);
    await searchInput.fill("Paris");

    // attendre les suggestions
    await expect(page.getByRole("option").first()).toBeVisible({ timeout: 5000 });

    // verifier qu'il y a des resultats
    const options = page.getByRole("option");
    await expect(options.first()).toContainText("Paris");
  });

  test("navigue vers la page ville apres selection", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/rechercher une ville/i);
    await searchInput.fill("Lyon");

    // attendre et cliquer sur une suggestion
    await page.getByRole("option").first().click();

    // verifier la navigation
    await expect(page).toHaveURL(/\/city\?/);

    // verifier que les sections meteo sont presentes
    await expect(page.getByText(/humidite/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/vent/i)).toBeVisible();
    await expect(page.getByText(/previsions/i).first()).toBeVisible();
  });

  test("ajoute et retire des favoris", async ({ page }) => {
    // rechercher une ville
    const searchInput = page.getByPlaceholder(/rechercher une ville/i);
    await searchInput.fill("Marseille");
    await page.getByRole("option").first().click();

    // attendre la page meteo
    await expect(page).toHaveURL(/\/city\?/);
    await expect(page.getByText(/humidite/i)).toBeVisible({ timeout: 10000 });

    // ajouter aux favoris
    const favoriteButton = page.getByRole("button", { name: /ajouter aux favoris/i });
    await favoriteButton.click();

    // verifier que le bouton change
    await expect(page.getByRole("button", { name: /retirer des favoris/i })).toBeVisible();

    // aller sur la page favoris
    await page.getByRole("link", { name: /favoris/i }).click();
    await expect(page).toHaveURL("/favorites");

    // verifier que la ville est dans les favoris
    await expect(page.getByText("Marseille")).toBeVisible();

    // supprimer le favori
    await page.getByRole("button", { name: /retirer des favoris/i }).click();

    // verifier que la liste est vide
    await expect(page.getByText(/aucun favori/i)).toBeVisible();
  });

  test("change les unites de temperature", async ({ page }) => {
    // rechercher une ville
    const searchInput = page.getByPlaceholder(/rechercher une ville/i);
    await searchInput.fill("Nice");
    await page.getByRole("option").first().click();

    // attendre la page meteo
    await expect(page.getByText(/humidite/i)).toBeVisible({ timeout: 10000 });

    // ouvrir le menu des unites
    await page.getByRole("button", { name: /unites/i }).click();

    // changer en fahrenheit
    await page.getByText("Fahrenheit").click();

    // verifier que les temperatures sont en fahrenheit
    await expect(page.getByText(/°F/)).toBeVisible();
  });

  test.skip("change le theme", async ({ page }) => {
    // Test skipped: Theme is currently forced to dark mode in preferences-provider
    // ouvrir le menu theme
    await page.getByRole("button", { name: /changer le theme/i }).click();

    // choisir le theme sombre
    await page.getByText("Sombre").click();

    // verifier que la classe dark est appliquee
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("affiche la page a propos", async ({ page }) => {
    await page.getByRole("link", { name: /a propos/i }).click();

    await expect(page).toHaveURL("/about");
    await expect(page.getByRole("heading", { name: /meteo-aura/i })).toBeVisible();
    await expect(page.getByText(/stack technique/i)).toBeVisible();
    await expect(page.getByText(/fonctionnalites/i)).toBeVisible();
  });

  test("navigation clavier dans la recherche", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/rechercher une ville/i);
    await searchInput.fill("Bordeaux");

    // attendre les suggestions
    await expect(page.getByRole("option").first()).toBeVisible({ timeout: 5000 });

    // naviguer avec les fleches
    await searchInput.press("ArrowDown");
    await searchInput.press("Enter");

    // verifier la navigation
    await expect(page).toHaveURL(/\/city\?/);
  });
});
