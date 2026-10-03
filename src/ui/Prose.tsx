import { type Ref } from 'react'
import { getSource } from '../content'
import type { Block, Section } from '../content/markdown'

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>
    case 'ul':
      return <ul>{block.items.map((i) => <li key={i}>{i}</li>)}</ul>
    case 'ol':
      return <ol>{block.items.map((i) => <li key={i}>{i}</li>)}</ol>
    case 'flow':
      return (
        <figure>
          <ol className="flow" aria-label={`Förlopp: ${block.items.join(', ')}`}>
            {block.items.map((i, n) => <li key={n}>{i}</li>)}
          </ol>
        </figure>
      )
    case 'scale':
      return (
        <figure>
          <ol
            className="spectrum"
            style={{ gridTemplateColumns: `repeat(${block.items.length}, 1fr)` }}
            aria-label={`Spektrum: ${block.items.join(', ')}`}
          >
            {block.items.map((i) => <li key={i}>{i}</li>)}
          </ol>
        </figure>
      )
    case 'fact':
      return (
        <aside className="fact" aria-label={block.title}>
          <p className="fact-title">{block.title}</p>
          <p>{block.text}</p>
        </aside>
      )
  }
}

export function SourceLine({ ids }: { ids: string[] }) {
  if (!ids.length) return null
  const list = ids.map((id) => getSource(id)?.short ?? id).join('; ')
  return <p className="source">{ids.length > 1 ? 'Källor' : 'Källa'}: {list}</p>
}

type ProseProps = {
  sections: Section[]
  headingLevel?: 2 | 3
  sectionRef?: (id: string) => Ref<HTMLElement>
}

/** Löptext i avsnitt: rubrik, text, diagram, faktaruta och diskret källa sist. */
export function Prose({ sections, headingLevel = 2, sectionRef }: ProseProps) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <div className="prose">
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="prose-section" ref={sectionRef?.(s.id)} data-section={s.id}>
          {s.title && <H>{s.title}</H>}
          {s.blocks.map((b, i) => <BlockView key={i} block={b} />)}
          <SourceLine ids={s.sources} />
        </section>
      ))}
    </div>
  )
}
