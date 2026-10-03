import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { db } from '../../src/db/schema'
import { routeAfterEarlyStop } from '../../src/logic/exerciseFlow'
import { ExerciseMode } from '../../src/screens/Exercise'
import { LandaNu } from '../../src/screens/Safety'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/ovning/:id/kor" element={<ExerciseMode />} />
        <Route path="/modul/:id" element={<p>Modulöversikt</p>} />
        <Route path="/verktyg" element={<p>Verktygslista</p>} />
        <Route path="/landa-nu" element={<LandaNu />} />
      </Routes>
    </MemoryRouter>,
  )

beforeEach(async () => {
  await db.sessions.clear()
})

describe('"för mycket" efter avbruten övning', () => {
  it('routeAfterEarlyStop leder alltid till Landa nu vid "för mycket"', () => {
    expect(routeAfterEarlyStop(true)).toBe('landa-nu')
    expect(routeAfterEarlyStop(false)).toBe('tillbaka')
  })

  it.each(['/ovning/O1/kor?v=short&modul=m01', '/ovning/O1/kor?v=short', '/ovning/N1/kor?v=short'])(
    'visar Landa nu efter Avsluta och Ja (%s)',
    async (path) => {
      const user = userEvent.setup()
      renderAt(path)
      await user.click(screen.getByRole('button', { name: 'Avsluta' }))
      expect(screen.getByRole('heading', { name: 'Avbröt du för att det blev för mycket?' })).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Ja' }))

      expect(await screen.findByRole('heading', { name: 'Landa nu' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Starta Landa nu' })).toBeInTheDocument()
      expect(screen.getByText('Öppna ögonen.')).toBeInTheDocument()

      const [session] = await db.sessions.toArray()
      expect(session).toMatchObject({ completed: false, stoppedEarlyTooMuch: true })
    },
  )

  it('går tillbaka vid Nej och sparar att det inte var för mycket', async () => {
    const user = userEvent.setup()
    renderAt('/ovning/O1/kor?v=short&modul=m01')
    await user.click(screen.getByRole('button', { name: 'Avsluta' }))
    await user.click(screen.getByRole('button', { name: 'Nej' }))
    expect(await screen.findByText('Modulöversikt')).toBeInTheDocument()
    const [session] = await db.sessions.toArray()
    expect(session.stoppedEarlyTooMuch).toBe(false)
  })

  it('visar Pausa och Avsluta i övningsläget', () => {
    renderAt('/ovning/O1/kor?v=short')
    expect(screen.getByRole('button', { name: 'Pausa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Avsluta' })).toBeInTheDocument()
  })
})
