// Markdown till HTML vid bygget. Teorin skrivs i Markdown med några tillägg:
//
//   $...$ och $$...$$            formler (KaTeX)
//   [@id] eller [@a; @b, s. 12]  källhänvisning till content/kallor.yaml
//   ::: definition Rubrik        rutor: definition, fakta, modell, forenkling,
//   ...                          rakneexempel, sakerhet och
//   :::                          evidens etablerad|experimentell Rubrik
//   ::: figur                    illustration med bild, alt, bildtext och kalla
//   bild: ...                    (YAML-rader). Se src/ui/Figure.tsx.
//   :::
//
// Rubriker på nivå 2 och 3 får id och samlas till den lokala innehållsförteckningen.

import MarkdownIt from 'markdown-it'
import containerImport from 'markdown-it-container'
import katexImport from '@vscode/markdown-it-katex'
import katex from 'katex'
import { parse as parseYaml } from 'yaml'
import type { Heading } from '../src/course/types.ts'

// CommonJS-paketen exporterar ibland funktionen som default.default beroende på laddare.
const interop = <T>(m: T): T => ((m as any).default ?? m) as T
const container = interop(containerImport)
const katexPlugin = interop(katexImport)

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/é/g, 'e')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const BOX_LABEL: Record<string, string> = {
  definition: 'Definition',
  fakta: 'Faktaruta',
  modell: 'Teoretisk modell',
  forenkling: 'Pedagogisk förenkling',
  rakneexempel: 'Räkneexempel',
  sakerhet: 'Säkerhet',
}

const EVIDENCE_BOX: Record<string, string> = {
  etablerad: 'Evidensläge: etablerad kunskap',
  experimentell: 'Evidensläge: experimentell metod',
}

export type Figure = { src: string; alt: string; caption?: string; credit?: string }

/** Samma markup som komponenten Figure i src/ui/Figure.tsx. */
export function figureHtml(f: Figure) {
  const cap =
    f.caption || f.credit
      ? `<figcaption>${f.caption ? `<span class="figure-caption">${escapeHtml(f.caption)}</span>` : ''}${
          f.credit ? `<span class="figure-credit">Källa: ${escapeHtml(f.credit)}</span>` : ''
        }</figcaption>`
      : ''
  return `<figure class="figure"><img src="${escapeHtml(f.src)}" alt="${escapeHtml(f.alt)}" loading="lazy" />${cap}</figure>`
}

export type CiteResolver = (id: string) => string | undefined

export type RenderEnv = {
  headings: Heading[]
  cited: string[]
  errors: string[]
}

export function createMarkdown(resolveCite: CiteResolver) {
  const md = new MarkdownIt({ html: true, linkify: false, typographer: false })
  // Samma KaTeX-version som stilmallen i src/main.tsx, inte pluginens egen inbäddade version.
  md.use(katexPlugin, { throwOnError: true, katex: katex as any })

  for (const name of Object.keys(BOX_LABEL)) {
    md.use(container, name, {
      validate: (params: string) => params.trim().split(/\s+/)[0] === name,
      render: (tokens: any[], idx: number) => {
        const t = tokens[idx]
        if (t.nesting !== 1) return '</div></aside>\n'
        const title = t.info.trim().slice(name.length).trim()
        return `<aside class="box box-${name}"><p class="box-label">${BOX_LABEL[name]}</p>${
          title ? `<p class="box-title">${md.renderInline(title)}</p>` : ''
        }<div class="box-body">\n`
      },
    })
  }
  md.use(container, 'evidens', {
    validate: (params: string) => /^evidens\s+(etablerad|experimentell)\b/.test(params.trim()),
    render: (tokens: any[], idx: number) => {
      const t = tokens[idx]
      if (t.nesting !== 1) return '</div></aside>\n'
      const [, level, ...rest] = t.info.trim().split(/\s+/)
      const title = rest.join(' ')
      return `<aside class="box box-evidens box-evidens-${level}"><p class="box-label">${EVIDENCE_BOX[level]}</p>${
        title ? `<p class="box-title">${md.renderInline(title)}</p>` : ''
      }<div class="box-body">\n`
    },
  })

  md.renderer.rules.table_open = (tokens, idx) => {
    const cls = tokens[idx].attrGet('class')
    return `<div class="table-wrap"><table${cls ? ` class="${cls}"` : ''}>\n`
  }
  md.renderer.rules.table_close = () => '</table></div>\n'

  // Tabeller med minst fyra kolumner staplas på smala skärmar. Varje cell får kolumnens rubrik
  // som data-label så att den kan visas framför värdet.
  md.core.ruler.push('table_labels', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'table_open') continue
      const labels: string[] = []
      let j = i + 1
      for (; j < tokens.length && tokens[j].type !== 'thead_close'; j++)
        if (tokens[j].type === 'th_open') labels.push(tokens[j + 1].content.replace(/[*_`$]/g, ''))
      if (labels.length >= 4) tokens[i].attrSet('class', 'table-stack')
      let col = 0
      for (; j < tokens.length && tokens[j].type !== 'table_close'; j++) {
        if (tokens[j].type === 'tr_open') col = 0
        if (tokens[j].type === 'td_open') tokens[j].attrSet('data-label', labels[col++] ?? '')
      }
    }
  })

  md.core.ruler.push('heading_ids', (state) => {
    const env = state.env as RenderEnv
    const used = new Map<string, number>()
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i]
      if (t.type !== 'heading_open' || (t.tag !== 'h2' && t.tag !== 'h3')) continue
      const text = (tokens[i + 1].children ?? [])
        .filter((c) => c.type === 'text' || c.type === 'code_inline')
        .map((c) => c.content)
        .join('')
        .trim()
      let id = slug(text) || 'avsnitt'
      const n = used.get(id) ?? 0
      used.set(id, n + 1)
      if (n) id = `${id}-${n + 1}`
      t.attrSet('id', id)
      env.headings?.push({ id, text, level: t.tag === 'h2' ? 2 : 3 })
    }
  })

  /** Ersätter [@id] och ::: figur före Markdown-tolkningen. */
  function preprocess(src: string, env: RenderEnv) {
    let out = src.replace(/\r\n/g, '\n')
    out = out.replace(/^::: figur\n([\s\S]*?)\n:::$/gm, (_, body: string) => {
      const d = (parseYaml(body) ?? {}) as Record<string, string>
      if (!d.bild || !d.alt) {
        env.errors.push('Illustration saknar bild eller alt')
        return ''
      }
      return figureHtml({ src: d.bild, alt: d.alt, caption: d.bildtext, credit: d.kalla })
    })
    out = out.replace(/\[(@[^\]]+)\]/g, (whole, inner: string) => {
      const parts = inner.split(';').map((p) => p.trim())
      if (!parts.every((p) => p.startsWith('@'))) return whole
      const links = parts.map((p) => {
        const m = p.match(/^@([\w-]+)(?:,\s*(.+))?$/)
        if (!m) {
          env.errors.push(`Felaktig källhänvisning: ${whole}`)
          return ''
        }
        const [, id, locator] = m
        const short = resolveCite(id)
        if (!short) {
          env.errors.push(`Okänd källa: ${id}`)
          return id
        }
        if (!env.cited.includes(id)) env.cited.push(id)
        return `<a class="cite" href="#kalla-${id}">${escapeHtml(short)}${locator ? `, ${escapeHtml(locator)}` : ''}</a>`
      })
      return `<span class="cite-group">(${links.join('; ')})</span>`
    })
    return out
  }

  return {
    render(src: string) {
      const env: RenderEnv = { headings: [], cited: [], errors: [] }
      const html = md.render(preprocess(src, env), env)
      return { html, ...env }
    },
    renderInline(src: string) {
      const env: RenderEnv = { headings: [], cited: [], errors: [] }
      const html = md.renderInline(preprocess(src, env), env)
      return { html, ...env }
    },
  }
}

/** Ungefärligt antal ord i löptext, utan formler och markup. */
export function wordCount(src: string) {
  return src
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]*\$/g, ' ')
    .replace(/\[@[^\]]+\]/g, ' ')
    .replace(/[#*|:>`_-]+/g, ' ')
    .split(/\s+/)
    .filter((w) => /[a-zåäö0-9]/i.test(w)).length
}
