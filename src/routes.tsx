import { Navigate, Route, Routes } from 'react-router-dom'
import { Course } from './screens/Course'
import { ExerciseDetail, Exercises, Player } from './screens/Exercise'
import { Home } from './screens/Home'
import { Application, Practice, Reflection, Theory } from './screens/ModuleParts'
import { ModuleOverview } from './screens/ModuleOverview'
import { About, Knowledge, More, NotEnough, Plan, ProgressOverview, Settings } from './screens/More'
import { FocusLayout, Shell, TextSize } from './ui/Shell'

export function AppRoutes() {
  return (
    <>
      <TextSize />
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="kurs" element={<Course />} />
          <Route path="kurs/:moduleId" element={<ModuleOverview />} />
          <Route path="kurs/:moduleId/teori" element={<Theory />} />
          <Route path="kurs/:moduleId/praktik" element={<Practice />} />
          <Route path="kurs/:moduleId/tillampning" element={<Application />} />
          <Route path="kurs/:moduleId/reflektion" element={<Reflection />} />
          <Route path="ovningar" element={<Exercises />} />
          <Route path="ovningar/:exerciseId" element={<ExerciseDetail />} />
          <Route path="mer" element={<More />} />
          <Route path="mer/progression" element={<ProgressOverview />} />
          <Route path="mer/plan" element={<Plan />} />
          <Route path="mer/kunskap" element={<Knowledge />} />
          <Route path="mer/om" element={<About />} />
          <Route path="mer/om/nar-restore-inte-racker" element={<NotEnough />} />
          <Route path="mer/installningar" element={<Settings />} />
        </Route>
        <Route element={<FocusLayout />}>
          <Route path="ovningar/:exerciseId/spela" element={<Player />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
