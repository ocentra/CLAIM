import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppWrapper from './App.tsx'
import { setupLogApiInterceptor } from './utils/logApi'

// Setup browser-side API interceptor for /api/logs/* routes
setupLogApiInterceptor()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
)
