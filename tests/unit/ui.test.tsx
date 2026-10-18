// Navigering, menyns expansion, gröna bockar, responsiv meny och gamla adresser.
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../../src/App'
import { chapterOrder, course, loadChapterContent, modules } from '../../src/course'
import { legacyRedirect } from '../../src/legacy'
import { resetProgress, submitQuiz } from '../../src/progress/store'

const FIRST = 'homeostas-och-negativ-aterkoppling'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )

/** Kursnavigeringen i sidomenyn (den finns också i mobilmenyn). */
const sidebar = () => within(document.querySelector('.course-sidebar') as HTMLElement)

beforeAll(() => {
  window.scrollTo = () => {}
  Element.prototype.scrollIntoView = () => {}
})

beforeEach(() => {
  localStorage.clear()
  resetProgress()
})

describe('kursnavigering', () => {
  it('genereras från kursmanifestet med alla moduler och underkapitel', () => {
    renderAt(`/kurs/${FIRST}`)
    const nav = sidebar()
    expect(nav.getAllByRole('button', { name: /./ })).toHaveLength(modules.length)
    const links = document.querySelectorAll('.course-sidebar .nav-chapter:not(.nav-module-overview)')
    expect(links).toHaveLength(chapterOrder.length)
  })

  it('fäller ut modulen med det aktiva kapitlet och kan fälla ut och ihop moduler', async () => {
    const user = userEvent.setup()
    renderAt(`/kurs/${FIRST}`)
    const nav = sidebar()
    const first = nav.getByRole('button', { name: /Kroppen söker balans/ })
    const second = nav.getByRole('button', { name: /Så fungerar nervsystemet/ })
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(second).toHaveAttribute('aria-expanded', 'false')
    const secondList = document.getElementById(second.getAttribute('aria-controls')!)!
    expect(secondList).not.toBeVisible()

    await user.click(second)
    expect(second).toHaveAttribute('aria-expanded', 'true')
    expect(secondList).toBeVisible()
    expect(within(secondList).getByRole('link', { name: /Aktionspotentialen och impulsledning/ })).toBeVisible()

    await user.click(second)
    expect(second).toHaveAttribute('aria-expanded', 'false')
    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'false')
  })

  it('navigerar mellan underkapitel och markerar det aktiva', async () => {
    const user = userEvent.setup()
    renderAt(`/kurs/${FIRST}`)
    expect(await screen.findByRole('heading', { level: 1, name: /Kroppen håller sig i balans/ })).toBeVisible()
    await user.click(sidebar().getByRole('link', { name: /När återhämtningen inte hinner ikapp/ }))
    expect(await screen.findByRole('heading', { level: 1, name: /1\.7\s+När återhämtningen inte hinner ikapp/ })).toBeVisible()
    expect(sidebar().getByRole('link', { name: /När återhämtningen inte hinner ikapp/ })).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('link', { name: /Nästa.*Din egen normala variation/ }))
    expect(await screen.findByRole('heading', { level: 1, name: /1\.8/ })).toBeVisible()
  })

  it('visar ej producerade kapitel med beskrivning, lärandemål och tydlig upplysning, utan kontroll', async () => {
    renderAt('/kurs/baroreflexen')
    expect(await screen.findByRole('heading', { level: 1, name: /Baroreflexen/ })).toBeVisible()
    expect(screen.getByText('Innehållet är under produktion')).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Planerade lärandemål' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Självtest' })).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Laborationer' })).toBeNull()
  })

  it('kan öppna alla underkapitel', () => {
    for (const id of chapterOrder) {
      const { unmount } = renderAt(`/kurs/${id}`)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(course.chapters[id].title)
      unmount()
    }
  }, 60000)
})

describe('grön bock', () => {
  it('visas i menyn efter godkänd kontroll, inte efter underkänd', async () => {
    const quiz = (await loadChapterContent(FIRST)).quiz!
    renderAt(`/kurs/${FIRST}`)
    const link = () => sidebar().getByRole('link', { name: /Kroppen håller sig i balans/ })
    expect(within(link()).queryByRole('img', { name: /Godkänd/ })).toBeNull()

    act(() => {
      submitQuiz(quiz, quiz.questions.map((q) => [q.options.findIndex((_, i) => !q.correct.includes(i))]))
    })
    expect(within(link()).queryByRole('img', { name: /Godkänd/ })).toBeNull()

    act(() => {
      submitQuiz(quiz, quiz.questions.map((q) => [...q.correct]))
    })
    expect(within(link()).getByRole('img', { name: /Godkänd/ })).toBeInTheDocument()
  })

  it('kan uppnås genom att besvara kontrollen i gränssnittet', async () => {
    const user = userEvent.setup()
    const quiz = (await loadChapterContent(FIRST)).quiz!
    renderAt(`/kurs/${FIRST}`)
    await screen.findByRole('button', { name: 'Rätta testet' })

    // Underkänt först
    await user.click(screen.getByRole('button', { name: 'Rätta testet' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/obesvarade/)
    for (const q of quiz.questions)
      await user.click(document.getElementById(`${q.id}-${q.options.findIndex((_, i) => !q.correct.includes(i))}`)!)
    await user.click(screen.getByRole('button', { name: 'Rätta testet' }))
    expect(screen.getByText(/Inte godkänt/)).toBeVisible()
    expect(document.querySelector('.course-sidebar .check')).toBeNull()

    // Sedan godkänt
    await user.click(screen.getByRole('button', { name: 'Gör om testet' }))
    for (const q of quiz.questions) for (const c of q.correct) await user.click(document.getElementById(`${q.id}-${c}`)!)
    await user.click(screen.getByRole('button', { name: 'Rätta testet' }))
    expect(screen.getAllByText(/Godkänt\./)[0]).toBeVisible()
    expect(document.querySelector('.course-sidebar .check')).not.toBeNull()
  })
})

describe('flersvarsfrågor', () => {
  it('visas med kryssrutor där flera alternativ kan väljas och nämns i ingressen', async () => {
    const user = userEvent.setup()
    const quiz = (await loadChapterContent(FIRST)).quiz!
    const multi = quiz.questions.find((q) => q.multiple)!
    renderAt(`/kurs/${FIRST}`)
    await screen.findByRole('button', { name: 'Rätta testet' })
    expect(screen.getByText(/Vissa frågor har flera rätta svar/)).toBeInTheDocument()
    const boxes = multi.correct.map((c) => document.getElementById(`${multi.id}-${c}`) as HTMLInputElement)
    expect(boxes[0].type).toBe('checkbox')
    for (const b of boxes) await user.click(b)
    expect(boxes.every((b) => b.checked)).toBe(true)
    await user.click(boxes[0])
    expect(boxes[0].checked).toBe(false)
    expect(boxes[1].checked).toBe(true)
  })
})

describe('responsiv navigation', () => {
  it('öppnar och stänger mobilmenyn med kursnavigeringen', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const button = screen.getByRole('button', { name: 'Meny' })
    const drawer = document.getElementById('mobilmeny')!
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(drawer).not.toBeVisible()

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(drawer).toBeVisible()
    expect(within(drawer).getByRole('navigation', { name: 'Kursens innehåll' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(drawer).not.toBeVisible()

    await user.click(button)
    await user.click(within(drawer).getByRole('link', { name: 'Källor' }))
    expect(drawer).not.toBeVisible()
    expect(screen.getByRole('heading', { level: 1, name: 'Källor' })).toBeVisible()
  })
})

describe('gamla adresser från Restore 1', () => {
  it('översätter hashadresser', () => {
    expect(legacyRedirect('#/kurs/01-saker-start/teori')).toBe('/kurs')
    expect(legacyRedirect('#/ovningar/O1/spela')).toBe('/ovningar')
    expect(legacyRedirect('#/mer/progression')).toBe('/progression')
    expect(legacyRedirect('#/mer/om/nar-restore-inte-racker')).toBe('/om')
    expect(legacyRedirect('#/')).toBe('/')
    expect(legacyRedirect('#kalla-cannon1929')).toBeNull()
    expect(legacyRedirect('')).toBeNull()
  })

  it('visar en sida med vägar vidare i stället för fel', () => {
    renderAt('/kurs/01-saker-start')
    expect(screen.getByRole('heading', { level: 1, name: 'Underkapitlet finns inte' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Till kursens innehåll' })).toBeVisible()
  })

  it('skickar gamla sökvägar vidare', () => {
    renderAt('/mer/progression')
    expect(screen.getByRole('heading', { level: 1, name: 'Min progression' })).toBeVisible()
  })

  it('visar en 404-sida för okända adresser', () => {
    renderAt('/finns-inte')
    expect(screen.getByRole('heading', { level: 1, name: 'Sidan finns inte' })).toBeVisible()
  })
})

describe('övriga sidor', () => {
  it('startsidan visar Börja och sedan Fortsätt utbildningen', async () => {
    const quiz = (await loadChapterContent(FIRST)).quiz!
    const { unmount } = renderAt('/')
    expect(screen.getByRole('link', { name: 'Börja utbildningen' })).toHaveAttribute('href', `/kurs/${FIRST}`)
    unmount()
    act(() => {
      submitQuiz(quiz, quiz.questions.map((q) => [...q.correct]))
    })
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Fortsätt utbildningen' })).toBeVisible()
  })

  it('övningsbiblioteket filtrerar', async () => {
    const user = userEvent.setup()
    renderAt('/ovningar')
    expect(screen.getByText(/6 av 6 övningar/)).toBeVisible()
    await user.selectOptions(screen.getByLabelText('Typ'), 'Belastnings- och återhämtningsförsök')
    expect(screen.getByText(/1 av 6 övningar/)).toBeVisible()
    await user.selectOptions(screen.getByLabelText('Evidensläge'), 'experimentell')
    expect(screen.getByText(/0 av 6 övningar/)).toBeVisible()
  })

  it('källförteckningen är sökbar', async () => {
    const user = userEvent.setup()
    renderAt('/kallor')
    await user.type(screen.getByLabelText('Sök i källförteckningen'), 'Mayer waves')
    const items = document.querySelectorAll('.references li')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('Julien C')
  })

  it('inställningar kan återställa progressionen efter bekräftelse', async () => {
    const user = userEvent.setup()
    const quiz = (await loadChapterContent(FIRST)).quiz!
    act(() => {
      submitQuiz(quiz, quiz.questions.map((q) => [...q.correct]))
    })
    renderAt('/installningar')
    await user.click(screen.getByRole('button', { name: 'Återställ progression' }))
    await user.click(screen.getByRole('button', { name: 'Ja, återställ' }))
    expect(screen.getByRole('status')).toHaveTextContent('Progressionen har återställts.')
    expect(screen.getByRole('button', { name: 'Återställ progression' })).toBeDisabled()
  })
})
