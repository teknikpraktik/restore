import { expect, type Page, test } from '@playwright/test'
import { buildCourse } from '../../tools/course-build'

const FIRST = 'homeostas-och-negativ-aterkoppling'
// Frågor och rätta svar läses från samma innehåll som webbplatsen byggs av.
const built = buildCourse('content')
const quiz = built.chapterContent[FIRST].quiz!
const QUESTIONS = quiz.questions.map((q) => q.id)
const CORRECT = quiz.questions.map((q) => q.correct)
const TOTAL = QUESTIONS.length
const PRODUCED = built.meta.order.filter((id) => built.meta.chapters[id].content === 'producerad').length

async function answer(page: Page, pick: (i: number) => number) {
  for (const [i, q] of QUESTIONS.entries()) await page.locator(`label[for="${q}-${pick(i)}"]`).click()
  await page.getByRole('button', { name: 'Rätta testet' }).click()
}

const sidebarCheck = (page: Page) =>
  page.locator('.course-sidebar').getByRole('link', { name: /Kroppen håller sig i balans/ }).getByRole('img', { name: /Godkänd/ })

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('från startsidan genom teori och kunskapskontroll till grön bock som finns kvar efter omladdning', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Restore' })).toBeVisible()
    await page.getByRole('link', { name: 'Börja utbildningen' }).click()

    await expect(page).toHaveURL(new RegExp(`/kurs/${FIRST}$`))
    await expect(page.getByRole('heading', { level: 1, name: /Kroppen håller sig i balans/ })).toBeVisible()
    await expect(page.locator('.course-sidebar')).toBeVisible()
    await expect(page.getByRole('complementary', { name: 'Innehåll i underkapitlet' })).toBeVisible()
    await expect(page.locator('.theory .box-upptack').first()).toBeVisible()

    // Lokal innehållsförteckning leder till rubriken
    await page.getByRole('complementary', { name: 'Innehåll i underkapitlet' }).getByRole('link', { name: 'Balans betyder inte stillhet' }).click()
    await expect(page).toHaveURL(/#balans-betyder-inte-stillhet$/)
    await expect(page.getByRole('heading', { level: 2, name: 'Balans betyder inte stillhet' })).toBeInViewport()
    await expect(page.locator('.box-upptack').first()).toBeVisible()
    await expect(page.locator('details.fordjupning')).not.toHaveAttribute('open', '')

    // Underkänt: ingen bock
    await answer(page, (i) => (CORRECT[i] + 1) % 4)
    await expect(page.locator('.quiz-result-score')).toContainText(`0 av ${TOTAL} rätt`)
    await expect(page.locator('.quiz-result-score')).toContainText('Inte godkänt')
    await expect(sidebarCheck(page)).toHaveCount(0)

    // Godkänt: bock
    await page.getByRole('button', { name: 'Gör om testet' }).click()
    await answer(page, (i) => CORRECT[i])
    await expect(page.locator('.quiz-result-score')).toContainText(`${TOTAL} av ${TOTAL} rätt`)
    await expect(sidebarCheck(page)).toBeVisible()
    await expect(page.locator('.check').first()).toHaveCSS('color', 'rgb(26, 127, 55)')

    await page.reload()
    await expect(sidebarCheck(page)).toBeVisible()
    await expect(page.getByText(/Självtestet godkänt/)).toBeVisible()

    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Fortsätt utbildningen' })).toBeVisible()
    await page.goto('/progression')
    await expect(page.getByText(`1 av ${PRODUCED} färdigproducerade (118 i kursplanen)`)).toBeVisible()
  })

  test('ett laborationsprotokoll sparas och progressionen kan återställas', async ({ page }) => {
    await page.goto(`/kurs/${FIRST}`)
    await answer(page, (i) => CORRECT[i])
    await expect(sidebarCheck(page)).toBeVisible()

    await page.goto('/ovningar/ortostatisk-pulsrespons')
    await expect(page.getByRole('heading', { level: 2, name: 'Genomförande' })).toBeVisible()
    await page.getByLabel(/^Puls liggande/).fill('62')
    await page.getByLabel(/Högsta puls under första halvminuten/).fill('88')
    await page.getByRole('button', { name: 'Registrera genomförande' }).click()
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Registrerade genomföranden (1)' })).toBeVisible()
    await expect(page.locator('.log-entries')).toContainText('62 slag/min')

    await page.goto('/installningar')
    await page.getByRole('button', { name: 'Återställ progression' }).click()
    await page.getByRole('button', { name: 'Ja, återställ' }).click()
    await page.goto(`/kurs/${FIRST}`)
    await expect(sidebarCheck(page)).toHaveCount(0)
  })

  test('alla moduler kan fällas ut och alla underkapitel kan öppnas från menyn', async ({ page }) => {
    await page.goto('/kurs')
    const nav = page.locator('.course-sidebar')
    const toggles = nav.locator('.nav-module-toggle')
    await expect(toggles).toHaveCount(15)
    for (let i = 0; i < 15; i++) {
      const t = toggles.nth(i)
      if ((await t.getAttribute('aria-expanded')) !== 'true') await t.click()
    }
    await expect(nav.locator('.nav-chapter:not(.nav-module-overview)')).toHaveCount(118)
    await nav.getByRole('link', { name: /Hypotalamus–hypofys–binjure-axeln/ }).click()
    await expect(page.getByRole('heading', { level: 1, name: /Hypotalamus–hypofys–binjure-axeln/ })).toBeVisible()
    await expect(page.getByText('Innehållet är under produktion')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Självtest' })).toHaveCount(0)
  })

  test('hela modul 1 kan genomföras kapitel för kapitel', async ({ page }) => {
    const m1 = built.meta.modules[0]
    for (const id of m1.chapters) {
      const q = built.chapterContent[id].quiz!
      await page.goto(`/kurs/${id}`)
      await expect(page.getByRole('heading', { level: 1, name: built.meta.chapters[id].title })).toBeVisible()
      await expect(page.locator('.theory .box-upptack').first()).toBeVisible()
      await expect(page.locator('.theory .box-reflektera').first()).toBeVisible()
      await expect(page.locator('.theory .box-tillampa').first()).toBeVisible()
      for (const qq of q.questions) await page.locator(`label[for="${qq.id}-${qq.correct}"]`).click()
      await page.getByRole('button', { name: 'Rätta testet' }).click()
      await expect(page.locator('.quiz-result-score')).toContainText('Godkänt')
      await expect(
        page.locator('.course-sidebar').getByRole('link', { name: new RegExp(built.meta.chapters[id].title) }).getByRole('img', { name: /Godkänd/ }),
      ).toBeVisible()
    }
    await expect(page.locator('.course-sidebar .nav-module-count').first()).toHaveText(`${m1.chapters.length}/${m1.chapters.length}`)
    await page.goto(`/kurs/modul/${m1.id}`)
    await expect(page.getByText(`${m1.chapters.length} klara`)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Efter modulen' })).toBeVisible()
  })

  test('gamla adresser från Restore 1 leder vidare', async ({ page }) => {
    await page.goto('/#/mer/progression')
    await expect(page).toHaveURL(/\/progression$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Min progression' })).toBeVisible()
    await page.goto('/#/kurs/01-saker-start/teori')
    await expect(page).toHaveURL(/\/kurs$/)
    await page.goto('/kurs/01-saker-start')
    await expect(page.getByRole('heading', { level: 1, name: 'Underkapitlet finns inte' })).toBeVisible()
  })
})

test.describe('mobil', () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })

  test('menyknappen öppnar kursnavigeringen och läsytan saknar horisontell overflow', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.course-sidebar')).toHaveCount(0)
    await expect(page.locator('.site-nav')).toBeHidden()
    await expect(page.locator('.site-footer')).toBeVisible()

    await page.getByRole('button', { name: 'Meny' }).click()
    const drawer = page.getByRole('dialog', { name: 'Meny' })
    await expect(drawer).toBeVisible()
    await drawer.getByRole('link', { name: 'Kurs', exact: true }).click()
    await expect(drawer).toBeHidden()
    await expect(page.getByRole('heading', { level: 1, name: 'Kursens innehåll' })).toBeVisible()

    await page.getByRole('button', { name: 'Meny' }).click()
    await drawer.getByRole('button', { name: /Kroppen söker balans/ }).click()
    await drawer.getByRole('link', { name: /Kroppen håller sig i balans/ }).click()
    await expect(page.getByRole('heading', { level: 1, name: /Kroppen håller sig i balans/ })).toBeVisible()
    await expect(page.locator('.theory')).toBeVisible()
    await expect(page.getByText('Innehåll i kapitlet')).toBeVisible()

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
    for (const p of ['/ovningar', '/ovningar/pulsaterhamtning-efter-belastning', '/progression', '/kallor', '/om', '/installningar']) {
      await page.goto(p)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), p).toBeLessThanOrEqual(0)
    }
  })
})
