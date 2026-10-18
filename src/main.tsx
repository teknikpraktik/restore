import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'katex/dist/katex.min.css'
import { AppRoutes } from './App'
import { legacyRedirect } from './legacy'
import { reloadFromStorage, STORAGE_KEY } from './progress/store'
import './styles/base.css'

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
