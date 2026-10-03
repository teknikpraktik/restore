import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SelfCheck } from '../../src/components/SelfCheck'
import { selfCheck } from '../../src/content'
import { db } from '../../src/db/schema'
import { adviceFor } from '../../src/logic/selfcheck'

const renderCheck = () =>
  render(
    <MemoryRouter>
      <SelfCheck onDone={() => {}} />
    </MemoryRouter>,
  )

describe('självkontroll: fråga 1 före allt annat', () => {
  it('visar akuthänvisningen direkt när fråga 1 markeras, före rubrik och frågor', async () => {
    const user = userEvent.setup()
    const { container } = renderCheck()
    expect(screen.queryByRole('alert')).toBeNull()

    await user.click(screen.getByLabelText(selfCheck().questions[0].question))

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Ring Mind Självmordslinjen 90101 eller 1177. Vid akut fara: ring 112.')
    const heading = screen.getByRole('heading', { level: 1 })
    expect(alert.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(container.firstElementChild!.firstElementChild).toBe(alert)
  })

  it('lägger akuthänvisningen först i råden även när andra frågor är markerade', async () => {
    const user = userEvent.setup()
    const { container } = renderCheck()
    const qs = selfCheck().questions
    await user.click(screen.getByLabelText(qs[3].question))
    await user.click(screen.getByLabelText(qs[0].question))
    await user.click(screen.getByRole('button', { name: 'Visa råd' }))

    const text = container.textContent!
    expect(text.indexOf(qs[0].advice)).toBeGreaterThanOrEqual(0)
    expect(text.indexOf(qs[0].advice)).toBeLessThan(text.indexOf(qs[3].advice))
  })

  it('adviceFor separerar fråga 1 från övriga', () => {
    const { questions } = selfCheck()
    const r = adviceFor(questions, new Set([5, 1, 2]))
    expect(r.urgent?.id).toBe(1)
    expect(r.others.map((q) => q.id)).toEqual([2, 5])
    expect(adviceFor(questions, new Set([5])).urgent).toBeNull()
  })

  it('blockerar inte kursen: Fortsätt finns alltid', async () => {
    const user = userEvent.setup()
    renderCheck()
    await user.click(screen.getByLabelText(selfCheck().questions[0].question))
    await user.click(screen.getByRole('button', { name: 'Visa råd' }))
    expect(screen.getByRole('button', { name: 'Fortsätt' })).toBeEnabled()
  })
})

describe('självkontrollens svar lagras aldrig', () => {
  it('lämnar inga spår i IndexedDB, localStorage eller sessionStorage', async () => {
    const user = userEvent.setup()
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const logs = [vi.spyOn(console, 'log'), vi.spyOn(console, 'info'), vi.spyOn(console, 'warn'), vi.spyOn(console, 'error')]

    const { unmount } = renderCheck()
    for (const q of selfCheck().questions) await user.click(screen.getByLabelText(q.question))
    await user.click(screen.getByRole('button', { name: 'Visa råd' }))
    unmount() // skärmen lämnas

    expect(setItem).not.toHaveBeenCalled()
    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(0)
    logs.forEach((l) => expect(l).not.toHaveBeenCalled())

    // Alla IndexedDB-databaser: öppna appens och sök igenom varje rad efter självkontrollens texter.
    await db.open()
    const rows = JSON.stringify(await Promise.all(db.tables.map((t) => t.toArray())))
    for (const q of selfCheck().questions) {
      expect(rows).not.toContain(q.question)
      expect(rows).not.toContain(q.advice)
    }
    const names = (await indexedDB.databases()).map((d) => d.name)
    expect(names.every((n) => n === 'restore')).toBe(true)
    expect(db.tables.map((t) => t.name)).not.toContain('selfcheck')
  })
})
