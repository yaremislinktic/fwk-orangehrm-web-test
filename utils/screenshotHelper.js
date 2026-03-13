// utils/screenshotHelper.js
// ─────────────────────────────────────────────────────────────
//  Utilidades de captura de pantalla reutilizables
//  Disponibles para cualquier test de la suite
// ─────────────────────────────────────────────────────────────

/**
 * Captura pantalla de evidencia con nombre estructurado
 * @param {import('@playwright/test').Page} page
 * @param {string} testId  - Ej: 'TC-LOGIN-HP-01'
 * @param {string} label   - Ej: 'success' | 'error'
 */
async function takeEvidence(page, testId, label = 'evidence') {
  const filename = `screenshots/${testId}-${label}-${Date.now()}.png`;
  await page.screenshot({ path: filename, fullPage: false });
  console.log(`📸 Captura guardada: ${filename}`);
}

/**
 * Captura pantalla de página completa
 * @param {import('@playwright/test').Page} page
 * @param {string} testId
 * @param {string} label
 */
async function takeFullPageEvidence(page, testId, label = 'fullpage') {
  const filename = `screenshots/${testId}-${label}-${Date.now()}.png`;
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`📸 Captura completa guardada: ${filename}`);
}

module.exports = { takeEvidence, takeFullPageEvidence };
