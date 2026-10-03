// Delad terminologi. Samma ord används i data, logik och gränssnitt.

export type Part = 'teori' | 'praktik' | 'tillampning' | 'reflektion'

export const PARTS: Part[] = ['teori', 'praktik', 'tillampning', 'reflektion']

export const PART_LABEL: Record<Part, string> = {
  teori: 'Teori',
  praktik: 'Praktik',
  tillampning: 'Tillämpning',
  reflektion: 'Reflektion',
}

export type ExerciseVersion = 'short' | 'full'

export const pad = (n: number) => String(n).padStart(2, '0')
