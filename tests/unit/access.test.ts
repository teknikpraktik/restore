import { resolveAccess } from '../../src/logic/access'

const fresh = { onboarded: true, module1Done: false }

describe('modul 1 kan inte hoppas över', () => {
  it.each(['/modul/m02', '/modul/m02/forsta', '/ovning/A1', '/ovning/A1/kor'])(
    'omdirigerar %s till Idag innan modul 1 är genomförd',
    (path) => expect(resolveAccess(path, fresh)).toBe('/'),
  )

  it.each(['/modul/m01', '/modul/m01/prova', '/ovning/O1', '/ovning/O1/kor', '/', '/verktyg'])(
    'släpper igenom %s under modul 1',
    (path) => expect(resolveAccess(path, fresh)).toBeNull(),
  )

  it('släpper igenom andra moduler när modul 1 är genomförd', () => {
    expect(resolveAccess('/modul/m02', { onboarded: true, module1Done: true })).toBeNull()
  })

  it('skickar en ny användare till Välkommen', () => {
    const first = { onboarded: false, module1Done: false }
    expect(resolveAccess('/', first)).toBe('/valkommen')
    expect(resolveAccess('/modul/m01', first)).toBe('/valkommen')
    expect(resolveAccess('/valkommen', first)).toBeNull()
    expect(resolveAccess('/kursen', first)).toBeNull()
  })

  it('håller Landa nu och Hjälp och vård öppna i alla lägen', () => {
    for (const s of [{ onboarded: false, module1Done: false }, fresh]) {
      expect(resolveAccess('/landa-nu', s)).toBeNull()
      expect(resolveAccess('/hjalp', s)).toBeNull()
      expect(resolveAccess('/ovning/N1/kor', s)).toBeNull()
    }
  })
})
