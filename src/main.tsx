import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppWrapper from './App.tsx'
import { setupLogApiInterceptor } from '@lib/logging/logApi';
import { initLogBridge } from '@lib/logging/logBridge';

// CRITICAL: Initialize ModelManager BEFORE React renders
// This matches TabAgent's backgroundModelManager.ts pattern
// Must happen before transformers.js tries to fetch any model files
import './ai/initModelManager'

// Setup browser-side API interceptor for /api/logs/* routes
setupLogApiInterceptor()

// Initialize WebSocket bridge for MCP tools
initLogBridge()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
)
