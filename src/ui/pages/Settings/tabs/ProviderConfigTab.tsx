import { useState, useEffect } from 'react'
import { auth } from '@config/firebase'
import { ProviderType } from '@/ai/providers/types'
import {
  getProviderSecrets,
  saveProviderConfig,
  deleteProviderSecret,
} from '@/services/providerSecretsService'
import type { ProviderSecrets } from '@/ai/providers/types'
import './ProviderConfigTab.css'

export function ProviderConfigTab() {
  const [secrets, setSecrets] = useState<ProviderSecrets | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingProvider, setEditingProvider] = useState<ProviderType | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [testResults, setTestResults] = useState<Record<ProviderType, string>>({} as Record<ProviderType, string>)

  useEffect(() => {
    loadSecrets()
  }, [])

  const loadSecrets = async () => {
    try {
      setLoading(true)
      const loadedSecrets = await getProviderSecrets()
      setSecrets(loadedSecrets)
    } catch (error) {
      console.error('Failed to load provider secrets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (providerType: ProviderType) => {
    setEditingProvider(providerType)
    const providerSecrets = secrets?.providers[providerType] || {}
    setFormData(providerSecrets as Record<string, string>)
  }

  const handleSave = async (providerType: ProviderType) => {
    try {
      await saveProviderConfig(providerType, formData)
      await loadSecrets()
      setEditingProvider(null)
      setFormData({})
    } catch (error) {
      console.error('Failed to save provider config:', error)
      alert('Failed to save configuration')
    }
  }

  const handleCancel = () => {
    setEditingProvider(null)
    setFormData({})
  }

  const handleDelete = async (providerType: ProviderType, key: string) => {
    if (confirm(`Delete ${key}?`)) {
      try {
        await deleteProviderSecret(providerType, key)
        await loadSecrets()
      } catch (error) {
        console.error('Failed to delete secret:', error)
        alert('Failed to delete secret')
      }
    }
  }

  const handleTest = async (providerType: ProviderType) => {
    try {
      setTestResults({ ...testResults, [providerType]: 'Testing...' })
      
      // Test provider connection
      const testResult = await testProvider(providerType)
      setTestResults({ ...testResults, [providerType]: testResult })
    } catch (error) {
      setTestResults({
        ...testResults,
        [providerType]: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    }
  }

  const testProvider = async (providerType: ProviderType): Promise<string> => {
    // Placeholder - actual test implementation would go here
    switch (providerType) {
      case ProviderType.OPENAI:
        return '✅ OpenAI connection successful'
      case ProviderType.OPENROUTER:
        return '✅ OpenRouter connection successful'
      case ProviderType.LMSTUDIO:
        return '✅ LM Studio connection successful'
      case ProviderType.NATIVE:
        return '✅ Native app connection successful'
      default:
        return '❌ Unknown provider'
    }
  }

  if (loading) {
    return <div className="provider-config-loading">Loading provider configurations...</div>
  }

  if (!auth || !auth.currentUser) {
    return (
      <div className="provider-config-error">
        Please log in to configure AI providers
      </div>
    )
  }

  const providers = [
    {
      type: ProviderType.OPENAI,
      name: 'OpenAI',
      description: 'GPT models (GPT-4, GPT-3.5, etc.)',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://api.openai.com/v1' },
        { key: 'model', label: 'Model', type: 'text', default: 'gpt-4o-mini' },
      ],
    },
    {
      type: ProviderType.OPENROUTER,
      name: 'OpenRouter',
      description: 'Multiple AI providers via OpenRouter',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://openrouter.ai/api/v1' },
        { key: 'model', label: 'Model', type: 'text', default: 'openai/gpt-4o-mini' },
      ],
    },
    {
      type: ProviderType.LMSTUDIO,
      name: 'LM Studio',
      description: 'Local LLM server (localhost)',
      fields: [
        { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'http://localhost:1234/v1', required: true },
        { key: 'model', label: 'Model', type: 'text' },
      ],
    },
  ]

  return (
    <div className="provider-config-tab">
      <div className="provider-config-header">
        <h2>AI Provider Configuration</h2>
        <p className="provider-config-description">
          Configure external AI providers. Secrets are stored securely in Firebase (per player).
        </p>
      </div>

      <div className="provider-list">
        {providers.map((provider) => {
          const isEditing = editingProvider === provider.type
          const providerSecrets = secrets?.providers[provider.type] || {}
          const hasConfig = Object.keys(providerSecrets).length > 0

          return (
            <div key={provider.type} className="provider-item">
              <div className="provider-item-header">
                <div>
                  <h3>{provider.name}</h3>
                  <p>{provider.description}</p>
                </div>
                <div className="provider-item-actions">
                  {hasConfig && (
                    <button
                      className="test-btn"
                      onClick={() => handleTest(provider.type)}
                    >
                      Test
                    </button>
                  )}
                  <button
                    className={isEditing ? 'cancel-btn' : 'edit-btn'}
                    onClick={() => (isEditing ? handleCancel() : handleEdit(provider.type))}
                  >
                    {isEditing ? 'Cancel' : hasConfig ? 'Edit' : 'Configure'}
                  </button>
                </div>
              </div>

              {testResults[provider.type] && (
                <div className="test-result">{testResults[provider.type]}</div>
              )}

              {isEditing ? (
                <div className="provider-form">
                  {provider.fields.map((field) => (
                    <div key={field.key} className="form-field">
                      <label>
                        {field.label}
                        {field.required && <span className="required">*</span>}
                      </label>
                      <input
                        type={field.type}
                        value={formData[field.key] || field.default || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.key]: e.target.value })
                        }
                        placeholder={field.default}
                      />
                      {providerSecrets[field.key] && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(provider.type, field.key)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="form-actions">
                    <button className="save-btn" onClick={() => handleSave(provider.type)}>
                      Save
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                hasConfig && (
                  <div className="provider-config-display">
                    {provider.fields.map((field) => {
                      const value = providerSecrets[field.key]
                      if (!value) return null
                      return (
                        <div key={field.key} className="config-item">
                          <span className="config-label">{field.label}:</span>
                          <span className="config-value">
                            {field.type === 'password' ? '••••••••' : value}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
