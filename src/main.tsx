import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import 'katex/dist/katex.min.css'
import { AppRoutes } from './App'
import { legacyRedirect } from './legacy'
import { reloadFromStorage, STORAGE_KEY } from './progress/store'
import './styles/base.css'

// Service workern: när en ny version har publicerats aktiveras den och sidan laddas om automatiskt.
// Nya versioner söks vid varje besök och därefter en gång i timmen.
registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (registration) setInterval(() => registration.update(), 60 * 60 * 1000)
  },
})

const legacy = legacyRedirect(window.location.hash)
if (legacy) window.history.replaceState(null, '', legacy)

// Håll progressionen i synk om kursen är öppen i flera flikar.
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) reloadFromStorage()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
)
