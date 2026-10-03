import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { helpAndCare } from '../../src/content'
import { needsCareHint } from '../../src/logic/ratings'
import { ProvaM01 } from '../../src/screens/Module'

describe('självskattningströsklar (spec 6.5)', () => {
  it.each([
    [{ stress: 9, sleep: 5, recovery: 5 }, true],
    [{ stress: 10, sleep: 5, recovery: 5 }, true],
    [{ stress: 8, sleep: 5, recovery: 5 }, false],
    [{ stress: 5, sleep: 1, recovery: 5 }, true],
    [{ stress: 5, sleep: 0, recovery: 5 }, true],
    [{ stress: 5, sleep: 2, recovery: 5 }, false],
    [{ stress: 5, sleep: 5, recovery: 1 }, true],
    [{ stress: 5, sleep: 5, recovery: 0 }, true],
    [{ stress: 5, sleep: 5, recovery: 2 }, false],
  ])('%j → vårdhänvisning: %s', (values, expected) => {
    expect(needsCareHint(values)).toBe(expected)
  })
})

async function rate(stress: number, sleep: number, recovery: number) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={['/prova']}>
      <Routes>
        <Route path="/prova" element={<ProvaM01 />} />
        <Route path="/modul/m01" element={<p>Modulöversikt</p>} />
        <Route path="/hjalp" element={<p>Hjälp</p>} />
      </Routes>
    </MemoryRouter>,
  )
  await user.click(screen.getByRole('button', { name: 'Börja med självkontrollen' }))
  await user.click(screen.getByRole('button', { name: 'Visa råd' }))
  await user.click(screen.getByRole('button', { name: 'Fortsätt' }))
  await user.type(screen.getByRole('textbox'), 'Jag vill sova bättre')
  await user.click(screen.getByRole('button', { name: 'Spara' }))

  const pick = async (question: string, n: number) =>
    user.click(within(await screen.findByRole('group', { name: question })).getByRole('button', { name: String(n) }))
  await pick('Hur stressad har du känt dig?', stress)
  await pick('Hur har du sovit?', sleep)
  await pick('Hur väl har du hunnit återhämta dig?', recovery)
  await user.click(screen.getByRole('button', { name: 'Spara' }))
}

describe('självskattningen i Prova', () => {
  it('visar vårdhänvisning vid stress 9', async () => {
    await rate(9, 5, 5)
    expect(await screen.findByText(helpAndCare().thresholdText)).toBeInTheDocument()
  })

  it('visar vårdhänvisning vid sömn 1', async () => {
    await rate(4, 1, 5)
    expect(await screen.findByText(helpAndCare().thresholdText)).toBeInTheDocument()
  })

  it('visar ingen vårdhänvisning vid mellanvärden', async () => {
    await rate(5, 5, 5)
    expect(await screen.findByText('Modulöversikt')).toBeInTheDocument()
    expect(screen.queryByText(helpAndCare().thresholdText)).toBeNull()
  })
})
