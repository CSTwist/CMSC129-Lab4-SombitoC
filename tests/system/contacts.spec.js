const { test, expect } = require('@playwright/test');

test.describe('Contacts Manager System Tests (E2E)', () => {
  
  test.beforeEach(async ({ request }) => {
    // Reset backend state before each test using Playwright's API context
    const response = await request.post('/api/contacts/clear');
    expect(response.ok()).toBeTruthy();
  });

  test('User Story 1: Should be able to add a new contact and view it in the list', async ({ page }) => {
    await page.goto('/');

    // Fill form fields
    await page.fill('#name', 'Maria Clara');
    await page.fill('#email', 'maria.clara@example.com');
    await page.fill('#phone', '09189876543');

    // Submit form
    await page.click('#save-btn');

    // Assert new contact is visible in the list
    const contactCard = page.locator('#contacts-list .contact-card');
    await expect(contactCard).toBeVisible();
    await expect(contactCard.locator('.contact-name')).toHaveText('Maria Clara');
    await expect(contactCard.locator('.contact-email')).toHaveText('maria.clara@example.com');
    await expect(contactCard.locator('.contact-phone')).toHaveText('09189876543');
  });

  test('User Story 2: Should be able to search and filter contacts dynamically', async ({ page }) => {
    await page.goto('/');

    // Add first contact
    await page.fill('#name', 'Maria Clara');
    await page.fill('#email', 'maria.clara@example.com');
    await page.fill('#phone', '09189876543');
    await page.click('#save-btn');

    // Add second contact
    await page.fill('#name', 'Juan Dela Cruz');
    await page.fill('#email', 'juan.delacruz@example.com');
    await page.fill('#phone', '09271234567');
    await page.click('#save-btn');

    // Assert both contacts are visible
    await expect(page.locator('#contacts-list .contact-card')).toHaveCount(2);

    // Search for "Juan"
    await page.fill('#search', 'Juan');
    await expect(page.locator('#contacts-list .contact-card')).toHaveCount(1);
    await expect(page.locator('#contacts-list .contact-card .contact-name')).toHaveText('Juan Dela Cruz');

    // Clear search and search for "clara@example.com"
    await page.fill('#search', '');
    await page.fill('#search', 'clara@example.com');
    await expect(page.locator('#contacts-list .contact-card')).toHaveCount(1);
    await expect(page.locator('#contacts-list .contact-card .contact-name')).toHaveText('Maria Clara');
  });

  test('User Story 3: Should be able to delete a contact after confirming the action', async ({ page }) => {
    await page.goto('/');

    // Add contact
    await page.fill('#name', 'Maria Clara');
    await page.fill('#email', 'maria.clara@example.com');
    await page.fill('#phone', '09189876543');
    await page.click('#save-btn');

    // Assert contact is visible
    const contactCard = page.locator('#contacts-list .contact-card');
    await expect(contactCard).toBeVisible();

    // Click delete button to show confirmation modal
    await contactCard.locator('.delete-btn').click();

    // Assert delete confirmation modal is visible
    const modal = page.locator('#delete-confirm-modal');
    await expect(modal).toBeVisible();

    // Click confirm delete
    await modal.locator('#confirm-delete-btn').click();

    // Assert modal is closed and contact is removed
    await expect(modal).not.toBeVisible();
    await expect(page.locator('#contacts-list .contact-card')).toHaveCount(0);
  });
});
