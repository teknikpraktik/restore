import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'
import type { Plugin } from 'vite'

const VIRTUAL = 'virtual:content'
const RESOLVED = '\0' + VIRTUAL

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

export function splitFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const text = raw.replace(/\r\n/g, '\n')
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: text.trim() }
  return { data: (parse(m[1]) as Record<string, unknown>) ?? {}, body: m[2].trim() }
}

/** Läser content/ vid build och exponerar allt som JSON (spec 14). */
export function contentPlugin(root = 'content'): Plugin {
  const dir = path.resolve(root)
  return {
    name: 'restore-content',
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : undefined
    },
    load(id) {
      if (id !== RESOLVED) return undefined
      const out: Record<string, unknown> = {}
      for (const file of walk(dir)) {
        const rel = path.relative(dir, file).split(path.sep).join('/')
        this.addWatchFile(file)
        if (rel.endsWith('.md')) out[rel] = splitFrontmatter(fs.readFileSync(file, 'utf8'))
        else if (rel.endsWith('.json')) out[rel] = JSON.parse(fs.readFileSync(file, 'utf8'))
      }
      return `export default ${JSON.stringify(out)}`
    },
  }
}
