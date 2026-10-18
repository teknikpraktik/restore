/// <reference types="vite/client" />
declare module 'virtual:course' {
  import type { ChapterContent, CourseMeta, ExerciseContent } from './course/types'
  const course: CourseMeta
  export default course
  export const chapterLoaders: Record<string, () => Promise<{ default: ChapterContent }>>
  export const exerciseLoaders: Record<string, () => Promise<{ default: ExerciseContent }>>
}
