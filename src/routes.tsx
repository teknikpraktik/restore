import { Navigate, Route, Routes } from 'react-router-dom'
import { AccessGuard, ExerciseLayout, SessionLayout, TabLayout } from './components/Layouts'
import { ExerciseMode, ExerciseStart } from './screens/Exercise'
import { Forsta, ModuleOverview, ProvaM01, ReflekteraM01 } from './screens/Module'
import { Idag } from './screens/Idag'
import { HurKursenFungerar, Valkommen } from './screens/Onboarding'
import { HjalpOchVard, LandaNu, Sjalvkontroll } from './screens/Safety'
import { Jag, Kunskap, Resan, Verktyg } from './screens/Tabs'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AccessGuard />}>
        <Route element={<TabLayout />}>
          <Route index element={<Idag />} />
          <Route path="resan" element={<Resan />} />
          <Route path="verktyg" element={<Verktyg />} />
          <Route path="kunskap" element={<Kunskap />} />
          <Route path="jag" element={<Jag />} />
        </Route>

        <Route element={<SessionLayout />}>
          <Route path="valkommen" element={<Valkommen />} />
          <Route path="kursen" element={<HurKursenFungerar />} />
          <Route path="modul/:id" element={<ModuleOverview />} />
          <Route path="modul/:id/forsta" element={<Forsta />} />
          <Route path="modul/m01/prova" element={<ProvaM01 />} />
          <Route path="modul/m01/reflektera" element={<ReflekteraM01 />} />
          <Route path="ovning/:id" element={<ExerciseStart />} />
          <Route path="landa-nu" element={<LandaNu />} />
          <Route path="hjalp" element={<HjalpOchVard />} />
          <Route path="sjalvkontroll" element={<Sjalvkontroll />} />
        </Route>

        <Route element={<ExerciseLayout />}>
          <Route path="ovning/:id/kor" element={<ExerciseMode />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
