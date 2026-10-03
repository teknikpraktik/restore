// En liten tolk för kursens textformat: avsnitt (##), stycken, listor, diagram, faktarutor och källor.

export type Block =
  | { type: 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'flow' | 'scale'; items: string[] }
  | { type: 'fact'; title: string; text: string }

export type Section = { id: string; title: string; blocks: Block[]; sources: string[] }

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export function parseSections(body: string): Section[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  const sections: Section[] = []
  let para: string[] = []
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null

  const current = () => {
    if (sections.length === 0) sections.push({ id: 'inledning', title: '', blocks: [], sources: [] })
    return sections[sections.length - 1]
  }
  const flush = () => {
    if (para.length) current().blocks.push({ type: 'p', text: para.join(' ') })
    para = []
    if (list) current().blocks.push(list)
    list = null
  }
  const addItem = (type: 'ul' | 'ol', text: string) => {
    if (para.length || (list && list.type !== type)) flush()
    list ??= { type, items: [] }
    list.items.push(text)
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    let m: RegExpMatchArray | null
    if (line.startsWith('## ')) {
      flush()
      const title = line.slice(3).trim()
      sections.push({ id: slug(title), title, blocks: [], sources: [] })
    } else if (line === '') {
      flush()
    } else if ((m = line.match(/^:::(flow|scale) (.+)$/))) {
      flush()
      current().blocks.push({ type: m[1] as 'flow' | 'scale', items: m[2].split('|').map((s) => s.trim()) })
    } else if ((m = line.match(/^:::fakta (.+)$/))) {
      flush()
      const text: string[] = []
      while (++i < lines.length && lines[i].trim() !== ':::') text.push(lines[i].trim())
      current().blocks.push({ type: 'fact', title: m[1].trim(), text: text.join(' ') })
    } else if ((m = line.match(/^Källor: (.+)$/))) {
      flush()
      current().sources.push(...m[1].split(',').map((s) => s.trim()))
    } else if ((m = line.match(/^- (.+)$/))) {
      addItem('ul', m[1])
    } else if ((m = line.match(/^\d+\. (.+)$/))) {
      addItem('ol', m[1])
    } else {
      if (list) flush()
      para.push(line)
    }
  }
  flush()
  return sections
}

export const wordCount = (sections: Section[]) =>
  sections
    .flatMap((s) => s.blocks)
    .map((b) => ('text' in b ? b.text : b.items.join(' ')))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
