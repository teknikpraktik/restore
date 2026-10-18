import { Navigate, Route, Routes } from 'react-router-dom'
import { ChapterPage } from './pages/ChapterPage'
import { CourseOverviewPage, HomePage, ModulePage } from './pages/CoursePages'
import { ExerciseLibraryPage, ExercisePage } from './pages/ExercisePages'
import { AboutPage, ProgressPage, SettingsPage, SourcesPage } from './pages/InfoPages'
import { NotFoundContent } from './ui/common'
import { CourseLayout, PageLayout, SiteLayout } from './ui/SiteLayout'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route element={<CourseLayout />}>
          <Route path="kurs" element={<CourseOverviewPage />} />
          <Route path="kurs/modul/:moduleId" element={<ModulePage />} />
          <Route path="kurs/:chapterId" element={<ChapterPage />} />
          <Route path="kurs/:chapterId/*" element={<ChapterPage />} />
        </Route>
        <Route element={<PageLayout />}>
          <Route index element={<HomePage />} />
          <Route path="ovningar" element={<ExerciseLibraryPage />} />
          <Route path="ovningar/:exerciseId" element={<ExercisePage />} />
          <Route path="progression" element={<ProgressPage />} />
          <Route path="kallor" element={<SourcesPage />} />
          <Route path="om" element={<AboutPage />} />
          <Route path="installningar" element={<SettingsPage />} />
          {/* Adresser från Restore 1 */}
          <Route path="mer" element={<Navigate to="/progression" replace />} />
          <Route path="mer/progression" element={<Navigate to="/progression" replace />} />
          <Route path="mer/installningar" element={<Navigate to="/installningar" replace />} />
          <Route path="mer/om/*" element={<Navigate to="/om" replace />} />
          <Route path="mer/*" element={<Navigate to="/" replace />} />
          <Route path="ovningar/:exerciseId/spela" element={<Navigate to="/ovningar" replace />} />
          <Route path="*" element={<NotFoundContent />} />
        </Route>
      </Route>
    </Routes>
  )
}
