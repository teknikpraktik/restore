import { expect, test } from '@playwright/test'

test('första start till genomförd modul 1', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')

  // Välkommen och Hur kursen fungerar
  await expect(page.getByRole('heading', { name: 'Restore' })).toBeVisible()
  await page.getByRole('link', { name: 'Fortsätt' }).click()
  await expect(page.getByRole('heading', { name: 'Hur kursen fungerar' })).toBeVisible()
  await page.getByRole('button', { name: 'Börja med modul 1' }).click()

  // Modul 1 kan inte hoppas över: en annan modul omdirigeras
  await expect(page.getByRole('heading', { name: 'Säker start' })).toBeVisible()
  await page.goto('/#/modul/m02')
  await expect(page.getByRole('heading', { name: 'Säker start' }).or(page.getByRole('heading', { name: 'Modul 1 genomförd' }))).toBeVisible()
  await page.goto('/#/modul/m01')

  // Förstå
  await page.getByRole('link', { name: 'Starta Förstå' }).click()
  await expect(page.getByRole('navigation')).toHaveCount(0) // navigeringen döljs i sessioner
  await expect(page.getByText('Kort 1 av 6')).toBeVisible()
  for (let i = 2; i <= 6; i++) {
    await page.getByRole('button', { name: 'Nästa' }).click()
    await expect(page.getByText(`Kort ${i} av 6`)).toBeVisible()
  }
  await page.getByRole('button', { name: 'Klar' }).click()

  // Känn efter: O1 kort version
  await page.getByRole('link', { name: 'Starta Känn efter' }).click()
  await expect(page.getByRole('heading', { name: 'Landa i rummet' })).toBeVisible()
  await page.getByRole('button', { name: 'Starta övning' }).click()
  await expect(page.getByRole('button', { name: 'Pausa' })).toBeVisible()
  await expect(page.getByRole('navigation')).toHaveCount(0) // ingen navigering i övningsläget
  await page.clock.fastForward(130_000)
  await page.getByRole('button', { name: 'Klar' }).click()
  await page.getByRole('button', { name: 'Lugnare' }).click()

  // Prova: självkontroll, varför, självskattning
  await page.getByRole('link', { name: 'Starta Prova' }).click()
  await page.getByRole('button', { name: 'Börja med självkontrollen' }).click()
  await page.getByRole('button', { name: 'Visa råd' }).click()
  await page.getByRole('button', { name: 'Fortsätt' }).click()
  await page.getByRole('textbox').fill('Jag vill kunna varva ned på kvällarna.')
  await page.getByRole('button', { name: 'Spara' }).click()
  for (const q of ['Hur stressad har du känt dig?', 'Hur har du sovit?', 'Hur väl har du hunnit återhämta dig?']) {
    await page.getByRole('group', { name: q }).getByRole('button', { name: '5', exact: true }).click()
  }
  await page.getByRole('button', { name: 'Spara' }).click()

  // Reflektera
  await page.getByRole('link', { name: 'Starta Reflektera' }).click()
  await page.getByLabel('Vad fick dig att börja?').fill('Jag sover dåligt.')
  await page.getByRole('group', { name: 'Hur användbar var den här modulen för dig?' }).getByRole('button', { name: '4' }).click()
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Spara och avsluta' }).click()
  await expect(page.getByRole('heading', { name: 'Modul 1 genomförd' })).toBeVisible()
  await page.getByRole('button', { name: 'Till Idag' }).click()

  // Idag visar att modul 1 är genomförd, och självkontrollens svar finns inte i lagringen
  await expect(page.getByRole('heading', { name: 'Modul 1 genomförd' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Huvudnavigering' })).toBeVisible()
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }))
  expect(stored).toBe('{}{}')
})
