import { expect, type Page, test } from '@playwright/test'

const nav = (page: Page) => page.getByRole('navigation', { name: 'Huvudnavigering' })

test('ny användare: från Hem genom hela modul 1, och status finns kvar efter omladdning', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')

  // A. Förstå produkten
  await expect(page.getByRole('heading', { name: 'Restore', level: 1 })).toBeVisible()
  await expect(page.getByText('Förstå stress. Träna återhämtning. Bygg vanor som håller.')).toBeVisible()
  await expect(page.getByText('Fas 1 av 6 · Modul 1 av 17')).toBeVisible()
  await expect(page.getByText('0 av 17 moduler genomförda')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Kursöversikt' })).toBeVisible()
  await expect(page.locator('.toc-row')).toHaveCount(17)

  // Modulöversikt
  await page.getByRole('link', { name: 'Starta kursen' }).click()
  await expect(page.getByRole('heading', { name: '01 Säker start', level: 1 })).toBeVisible()
  await expect(nav(page)).toBeVisible()
  await page.getByRole('link', { name: 'Starta modul' }).click()

  // Teori
  await expect(page.getByRole('heading', { name: 'Säker start', level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Hur kursen är upplagd' })).toBeVisible()
  await page.getByRole('button', { name: 'Klar med teorin' }).click()

  // Praktik och spelare
  await expect(page.getByRole('heading', { name: 'Orientera dig i rummet', level: 1 })).toBeVisible()
  await page.getByRole('link', { name: 'Starta 2 minuter' }).click()
  await expect(page.getByRole('button', { name: 'Pausa' })).toBeVisible()
  await expect(nav(page)).toHaveCount(0)
  await page.clock.fastForward(125_000)
  await expect(page.getByRole('heading', { name: 'Övning genomförd' })).toBeVisible()
  await page.getByRole('button', { name: 'Klar' }).click() // frågan om skillnad är frivillig

  // Tillämpning
  await page.getByRole('link', { name: 'Fortsätt till Tillämpning' }).click()
  await expect(page.getByRole('heading', { name: 'Ditt skäl och en första skattning', level: 1 })).toBeVisible()
  await page.getByLabel('Ditt skäl i en mening').fill('Jag vill sova bättre.')
  for (const q of ['Hur stressad har du känt dig?', 'Hur har du sovit?', 'Hur väl har du hunnit återhämta dig?']) {
    await page.getByRole('group', { name: q }).getByRole('button', { name: '6', exact: true }).click()
  }
  await page.getByRole('button', { name: 'Markera som gjord' }).click()

  // Modulöversikten visar vad som är gjort
  await expect(page.getByRole('link', { name: /^Gjord\s*1\. Teori/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /^Gjord\s*2\. Praktik/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /^Gjord\s*3\. Tillämpning/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /^Pågår\s*4\. Reflektion/ })).toBeVisible()

  // Reflektion
  await page.getByRole('link', { name: 'Fortsätt' }).click()
  await page.getByLabel('Vad fick dig att börja?').fill('Sömnen.')
  await page.getByRole('button', { name: 'Spara reflektion' }).click()
  await expect(page.getByRole('heading', { name: 'Modul 01 är genomförd' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Fas 1 · Start är genomförd' })).toBeVisible()

  // C. Progression efter omladdning
  await page.reload()
  await nav(page).getByRole('link', { name: 'Hem' }).click()
  await expect(page.getByText('1 av 17 moduler genomförda')).toBeVisible()
  await expect(page.getByText('Fas 2 av 6 · Modul 2 av 17')).toBeVisible()
  await expect(page.getByRole('link', { name: /^Genomförd\s*01\s*Säker start/ })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Starta modul' })).toHaveAttribute('href', '#/kurs/m02')

  // Övningar visar det som har introducerats och hur ofta det är gjort
  await nav(page).getByRole('link', { name: 'Övningar' }).click()
  await expect(page.getByRole('link', { name: /Orientera dig i rummet.*Gjort 1 gång/ })).toBeVisible()

  // Kurs och Mer
  await nav(page).getByRole('link', { name: 'Kurs' }).click()
  await expect(page.getByRole('heading', { name: /Fas 2\s*Grund/ })).toBeVisible()
  await nav(page).getByRole('link', { name: 'Mer' }).click()
  await page.getByRole('link', { name: /Om Restore/ }).click()
  await page.getByRole('link', { name: 'När Restore inte räcker' }).click()
  await expect(page.getByRole('heading', { name: 'När Restore inte räcker', level: 1 })).toBeVisible()
  await page.getByRole('link', { name: 'Om Restore' }).first().click()
  await expect(page.getByRole('heading', { name: 'Om Restore', level: 1 })).toBeVisible()

  // Inga gamla säkerhetsflöden eller Landa nu någonstans på vägen
  await expect(page.getByText(/Landa nu|stoppregel|för mycket/i)).toHaveCount(0)
})

for (const [name, size] of [['mobil', { width: 375, height: 812 }], ['desktop', { width: 1280, height: 900 }]] as const) {
  test(`${name}: ingen horisontell scroll och navigeringen syns`, async ({ page }) => {
    await page.setViewportSize(size)
    for (const path of ['/', '/#/kurs', '/#/kurs/m05', '/#/kurs/m05/teori', '/#/ovningar/A1', '/#/mer', '/#/mer/progression']) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(nav(page)).toBeVisible()
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
      expect(overflow, path).toBe(false)
    }
  })
}
