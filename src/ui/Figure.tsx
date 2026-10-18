// Återanvändbar illustration: bild, bildtext, källa och alternativtext.
// Samma markup genereras för illustrationer i Markdown (se tools/markdown.ts, figureHtml).
//
// Illustrationer i Restore ska vara svartvita vetenskapliga teckningar på vit bakgrund:
// anatomiska och fysiologiska principskisser med tunna linjer och diskret skuggning.

export type FigureProps = {
  src: string
  /** Beskriver vad bilden visar för den som inte ser den. Krävs. */
  alt: string
  caption?: string
  /** Upphov eller källa, till exempel tecknare och underlag. */
  credit?: string
}

export function Figure({ src, alt, caption, credit }: FigureProps) {
  return (
    <figure className="figure">
      <img src={src} alt={alt} loading="lazy" />
      {(caption || credit) && (
        <figcaption>
          {caption && <span className="figure-caption">{caption}</span>}
          {credit && <span className="figure-credit">Källa: {credit}</span>}
        </figcaption>
      )}
    </figure>
  )
}
