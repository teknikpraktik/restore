import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Idag } from '../../src/screens/Idag'
import { Jag, Kunskap, Resan, Verktyg } from '../../src/screens/Tabs'

const tabs = { '/': Idag, '/resan': Resan, '/verktyg': Verktyg, '/kunskap': Kunskap, '/jag': Jag }

describe('Landa nu och Hjälp och vård nås från varje flik', () => {
  it.each(Object.entries(tabs))('flik %s har direktlänkar (ett tryck)', async (path, Screen) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={path} element={<Screen />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(await screen.findAllByRole('link', { name: 'Landa nu' })).not.toHaveLength(0)
    expect(screen.getAllByRole('link', { name: 'Hjälp och vård' })).not.toHaveLength(0)
    expect(screen.getAllByRole('link', { name: 'Landa nu' })[0]).toHaveAttribute('href', '/landa-nu')
    expect(screen.getAllByRole('link', { name: 'Hjälp och vård' })[0]).toHaveAttribute('href', '/hjalp')
  })
})
