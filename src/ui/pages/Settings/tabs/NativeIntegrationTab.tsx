import { useState, useEffect } from 'react'
import { ProviderType } from '@/ai/providers/types'
import {
  getProviderSecrets,
  saveProviderConfig,
} from '@/services/providerSecretsService'
import './NativeIntegrationTab.css'

type ConnectionType = 'http' | 'webrtc' | 'stdin' | 'native_messaging'

export function NativeIntegrationTab() {
  const [connectionType, setConnectionType] = useState<ConnectionType>('http')
  const [baseUrl, setBaseUrl] = useState('http://localhost:8080')
  const [webrtcUrl, setWebrtcUrl] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')

  useEffect(() => {
    loadSecrets()
  }, [])

  const loadSecrets = async () => {
    try {
      const loadedSecrets = await getProviderSecrets()
      
      const nativeSecrets = loadedSecrets?.providers[ProviderType.NATIVE] || {}
      const connType = nativeSecrets.connectionType
      if (connType === 'http' || connType === 'webrtc' || connType === 'stdin' || connType === 'native_messaging') {
        setConnectionType(connType)
      } else {
        setConnectionType('http')
      }
      setBaseUrl(nativeSecrets.baseUrl || 'http://localhost:8080')
      setWebrtcUrl(nativeSecrets.webrtcSignalingUrl || '')
    } catch (error) {
      console.error('Failed to load native secrets:', error)
    }
  }

  const handleSave = async () => {
    try {
      const payload: Record<string, string> = {
        connectionType,
      }
      if (connectionType === 'http') {
        payload.baseUrl = baseUrl
      }
      if (connectionType === 'webrtc') {
        payload.webrtcSignalingUrl = webrtcUrl
      }
      await saveProviderConfig(ProviderType.NATIVE, payload)
      await loadSecrets()
      alert('Native configuration saved')
    } catch (error) {
      console.error('Failed to save native config:', error)
      alert('Failed to save configuration')
    }
  }

  const handleTestConnection = async () => {
    setConnectionStatus('connecting')
    try {
      // Test WebRTC connection
      if (connectionType === 'webrtc' && webrtcUrl) {
        // Placeholder - actual WebRTC test would go here
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setConnectionStatus('connected')
      } else if (connectionType === 'http' && baseUrl) {
        try {
          const response = await fetch(`${baseUrl.replace(/\/$/, '')}/health`, { method: 'GET' })
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          setConnectionStatus('connected')
          alert('Connected to native HTTP server')
        } catch (err) {
          setConnectionStatus('disconnected')
          alert(`HTTP test failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      } else {
        setConnectionStatus('disconnected')
        alert('Please configure the required connection details')
      }
    } catch (error) {
      setConnectionStatus('disconnected')
      alert(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="native-integration-tab">
      <div className="native-header">
        <h2>Native App Integration</h2>
        <p className="native-description">
          Connect to TabAgent native app for advanced features (HTTP bridge, stdin, native messaging, WebRTC).
        </p>
      </div>

      <div className="connection-status-section">
        <h3>Connection Status</h3>
        <div className={`status-indicator ${connectionStatus}`}>
          <span className="status-icon">
            {connectionStatus === 'connected' && '✅'}
            {connectionStatus === 'connecting' && '🔄'}
            {connectionStatus === 'disconnected' && '❌'}
          </span>
          <span className="status-text">
            {connectionStatus === 'connected' && 'Connected'}
            {connectionStatus === 'connecting' && 'Connecting...'}
            {connectionStatus === 'disconnected' && 'Not Connected'}
          </span>
        </div>
        <button className="test-btn" onClick={handleTestConnection}>
          Test Connection
        </button>
      </div>

      <div className="connection-config-section">
        <h3>Connection Configuration</h3>
        
        <div className="config-field">
          <label htmlFor="connection-type-select">Connection Type</label>
          <select
            id="connection-type-select"
            value={connectionType}
            onChange={(e) => {
              const value = e.target.value
              if (value === 'webrtc' || value === 'stdin' || value === 'native_messaging') {
                setConnectionType(value)
              }
            }}
            title="Select connection type for native app integration"
          >
            <option value="http">HTTP (REST)</option>
            <option value="webrtc">WebRTC</option>
            <option value="stdin">stdin (Local)</option>
            <option value="native_messaging">Native Messaging (Browser Extension)</option>
          </select>
        </div>

        {connectionType === 'http' && (
          <div className="config-field">
            <label htmlFor="http-base-url-input">HTTP Base URL</label>
            <input
              id="http-base-url-input"
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="http://localhost:8080"
              aria-label="HTTP base URL for native server"
            />
          </div>
        )}

        {connectionType === 'webrtc' && (
          <div className="config-field">
            <label htmlFor="webrtc-url-input">WebRTC Signaling URL</label>
            <input
              id="webrtc-url-input"
              type="text"
              value={webrtcUrl}
              onChange={(e) => setWebrtcUrl(e.target.value)}
              placeholder="ws://localhost:8765/signaling"
              aria-label="WebRTC signaling URL"
            />
          </div>
        )}

        {connectionType === 'stdin' && (
          <div className="info-box">
            <p>stdin mode connects directly to local TabAgent native app via standard input/output.</p>
            <p>Make sure TabAgent native app is running and configured for stdin communication.</p>
          </div>
        )}

        {connectionType === 'native_messaging' && (
          <div className="info-box">
            <p>Native messaging requires browser extension context.</p>
            <p>This mode is only available when running as a browser extension.</p>
          </div>
        )}

        <div className="form-actions">
          <button className="save-btn" onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>

      <div className="features-section">
        <h3>Native App Features</h3>
        <ul className="features-list">
          <li>✅ Full system resources (RAM, VRAM, GPU)</li>
          <li>✅ Advanced AI capabilities & local model support</li>
          <li>✅ Computer Use Agent for desktop automation</li>
          <li>✅ Complete privacy & local processing</li>
          <li>✅ Memory-efficient BitNet agents</li>
        </ul>
      </div>
    </div>
  )
}
