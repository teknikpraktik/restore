import path from 'node:path'
import type { Plugin } from 'vite'
import type { CourseBuild } from '../src/course/types.ts'
import { buildCourse } from './course-build.ts'

// virtual:course             kursens metadata och laddare för innehåll
// virtual:course-part/k/<id> teori och kunskapskontroll för ett kapitel (egen chunk)
// virtual:course-part/o/<id> avsnitten i en övning (egen chunk)
const VIRTUAL = 'virtual:course'
const PART = 'virtual:course-part/'

/** Bygger kursen från content/ och exponerar den som virtuella moduler. */
export function contentPlugin(root = 'content'): Plugin {
  const dir = path.resolve(root)
  let cache: CourseBuild | null = null
  const course = () => (cache ??= buildCourse(root))

  return {
    name: 'restore-course',
    resolveId(id) {
      if (id === VIRTUAL || id.startsWith(PART)) return '\0' + id
      return undefined
    },
    load(id) {
      if (!id.startsWith('\0virtual:course')) return undefined
      const c = course()
      if (id === '\0' + VIRTUAL) {
        const loader = (kind: string, ids: string[]) =>
          `{${ids.map((i) => `${JSON.stringify(i)}: () => import(${JSON.stringify(`${PART}${kind}/${i}`)})`).join(',')}}`
        return [
          `export default ${JSON.stringify(c.meta)}`,
          `export const chapterLoaders = ${loader('k', Object.keys(c.chapterContent))}`,
          `export const exerciseLoaders = ${loader('o', Object.keys(c.exerciseContent))}`,
        ].join('\n')
      }
      const [kind, partId] = id.slice(1 + PART.length).split('/')
      const data = kind === 'k' ? c.chapterContent[partId] : c.exerciseContent[partId]
      if (!data) throw new Error(`Okänt innehåll: ${id}`)
      return `export default ${JSON.stringify(data)}`
    },
    configureServer(server) {
      server.watcher.add(dir)
      server.watcher.on('all', (_event, file) => {
        if (!path.resolve(file).startsWith(dir)) return
        cache = null
        for (const mod of server.moduleGraph.idToModuleMap.values())
          if (mod.id?.startsWith('\0virtual:course')) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}
