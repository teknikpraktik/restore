import { useProgressMap } from '../db/repo'
import { CourseToc } from '../ui/CourseToc'
import { Page } from '../ui/Page'
import { Legend } from '../ui/Status'

// Kurs: hela kursen med faser, beskrivningar, moduler och progression.

export function Course() {
  const map = useProgressMap()
  return (
    <Page
      title="Kurs"
      wide
      lead="Sex faser och 17 moduler. Varje modul består av teori, praktik, tillämpning och reflektion."
    >
      <Legend />
      {map && <CourseToc map={map} detailed />}
    </Page>
  )
}
