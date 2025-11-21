import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider } from './providers/AuthProvider'
import { SolanaWalletProvider } from './services/solana/wallet'
import MainApp from './components/MainApp'
import React, { Suspense } from 'react'

// Dev-only imports - dynamically imported, completely tree-shaken in production builds
// Vite will remove these entire code blocks in production builds
// Routes defined here will NOT be available on https://game.ocentra.ca/

const DevLogsQueryPage = import.meta.env.DEV
  ? React.lazy(() => 
      import('./ui/pages/dev/LogsQueryPage').then(m => ({ default: m.LogsQueryPage }))
    )
  : null;

const DevGameEditorPage = import.meta.env.DEV
  ? React.lazy(() => 
      import('./ui/pages/dev/GameEditorPage').then(m => ({ default: m.GameEditorPage }))
    )
  : null;

function App() {
  return <MainApp />;
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
    <QueryProvider>
      <SolanaWalletProvider>
        <AuthProvider>
            <Routes>
              {/* Dev-only routes - completely excluded from production builds */}
              {/* These routes will NOT exist on https://game.ocentra.ca/ */}
              {import.meta.env.DEV && DevLogsQueryPage && (
                <>
                  <Route 
                    path="/api/logs/query" 
                    element={
                      <Suspense fallback={null}>
                        <DevLogsQueryPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/api/logs/stats" 
                    element={
                      <Suspense fallback={null}>
                        <DevLogsQueryPage />
                      </Suspense>
                    } 
                  />
                </>
              )}
              
              {import.meta.env.DEV && DevGameEditorPage && (
                <>
                  <Route 
                    path="/GameEditor/:gameId" 
                    element={
                      <Suspense fallback={<div>Loading Game Editor...</div>}>
                        <DevGameEditorPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/GameEditor" 
                    element={
                      <Suspense fallback={<div>Loading Game Editor...</div>}>
                        <DevGameEditorPage />
                      </Suspense>
                    } 
                  />
                </>
              )}
              
              {/* Production routes - always available */}
              <Route path="/*" element={<App />} />
            </Routes>
        </AuthProvider>
      </SolanaWalletProvider>
    </QueryProvider>
    </BrowserRouter>
  )
}