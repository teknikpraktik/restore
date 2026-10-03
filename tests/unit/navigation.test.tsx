import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { db } from '../../src/db/schema'
import { markPart } from '../../src/db/repo'
import { AppRoutes } from '../../src/routes'
import { activeTab } from '../../src/ui/Shell'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

const TABS = ['/', '/kurs', '/ovningar', '/mer']
const PAGES = [
  '/kurs/m05',
  '/kurs/m05/teori',
  '/kurs/m05/praktik',
  '/kurs/m05/tillampning',
  '/kurs/m05/reflektion',
  '/ovningar/A1',
  '/ovningar/A1?modul=m05',
  '/mer/progression',
  '/mer/plan',
  '/mer/kunskap',
  '/mer/om',
  '/mer/om/nar-restore-inte-racker',
  '/mer/installningar',
]

describe('ingen återvändsgränd', () => {
  it.each([...TABS, ...PAGES])('%s har huvudnavigering med Hem, Kurs, Övningar och Mer', async (path) => {
    renderAt(path)
    const nav = await screen.findByRole('navigation', { name: 'Huvudnavigering' })
    for (const name of ['Hem', 'Kurs', 'Övningar', 'Mer']) expect(within(nav).getByRole('link', { name })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it.each(PAGES)('%s har en tillbakalänk', async (path) => {
    const { container } = renderAt(path)
    await screen.findByRole('heading', { level: 1 })
    expect(container.querySelector('a.back')).not.toBeNull()
  })

  it('döljer navigeringen i övningsspelaren', async () => {
    renderAt('/ovningar/A1/spela?v=short')
    expect(await screen.findByRole('button', { name: 'Pausa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Avsluta' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Huvudnavigering' })).toBeNull()
  })

  it('markerar Kurs som aktiv flik när en övning öppnas från en modul', () => {
    expect(activeTab('/ovningar/A1', '?modul=m05')).toBe('/kurs')
    expect(activeTab('/ovningar/A1', '')).toBe('/ovningar')
    expect(activeTab('/kurs/m05/teori', '')).toBe('/kurs')
    expect(activeTab('/mer/om', '')).toBe('/mer')
  })
})

describe('Hem ger en bild av hela kursen', () => {
  it('visar progression, nästa steg och alla faser och moduler', async () => {
    await markPart('m01', 'teori')
    renderAt('/')
    expect(await screen.findByText('Fas 1 av 6 · Modul 1 av 17')).toBeInTheDocument()
    expect(screen.getByText('0 av 17 moduler genomförda')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Fortsätt' })).toHaveAttribute('href', '/kurs/m01/praktik')
    for (const name of ['Start', 'Grund', 'Kroppen', 'Tanken', 'Vardagen', 'Integration']) {
      expect(screen.getByRole('heading', { name: new RegExp(name) })).toBeInTheDocument()
    }
    expect(screen.getAllByRole('link', { name: /^(Genomförd|Pågår|Ej påbörjad)\s*\d\d\s*\S/ })).toHaveLength(17)
    expect(screen.getByRole('link', { name: /^Pågår\s*01\s*Säker start/ })).toBeInTheDocument()
  })
})

describe('modulöversikten', () => {
  it('visar de fyra delarna med status', async () => {
    await markPart('m05', 'teori')
    await markPart('m05', 'praktik')
    renderAt('/kurs/m05')
    expect(await screen.findByRole('link', { name: /^Gjord\s*1\. Teori/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Gjord\s*2\. Praktik/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Pågår\s*3\. Tillämpning/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Ej gjord\s*4\. Reflektion/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Fortsätt' })).toHaveAttribute('href', '/kurs/m05/tillampning')
  })
})

describe('säkerhetsmodellen', () => {
  it('har en proportionerlig sida under Om Restore och inga säkerhetsflöden i kursen', async () => {
    renderAt('/mer/om/nar-restore-inte-racker')
    expect(await screen.findByRole('heading', { name: 'När Restore inte räcker', level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/ersätter inte medicinsk eller psykologisk behandling/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ring 1177' })).toHaveAttribute('href', 'tel:1177')
    expect(screen.getByRole('link', { name: 'Ring 112' })).toHaveAttribute('href', 'tel:112')
  })
})
