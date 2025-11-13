import { useState } from 'react'
import { EventBus } from '@/lib/eventing/EventBus'
import { ShowScreenEvent } from '@/lib/eventing/events/lobby'
import { ModelSelectionTab } from './tabs/ModelSelectionTab'
import { InferenceSettingsTab } from './tabs/InferenceSettingsTab'
import { ProviderConfigTab } from './tabs/ProviderConfigTab'
import { NativeIntegrationTab } from './tabs/NativeIntegrationTab'
import './SettingsPage.css'

type TabType = 'models' | 'inference' | 'providers' | 'native'

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('models')

  const handleBack = () => {
    EventBus.instance.publish(new ShowScreenEvent('welcome'))
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="settings-back-btn" onClick={handleBack}>
          ← Back
        </button>
        <h1 className="settings-title">AI Settings</h1>
      </div>

      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          Models
        </button>
        <button
          className={`settings-tab ${activeTab === 'inference' ? 'active' : ''}`}
          onClick={() => setActiveTab('inference')}
        >
          Inference
        </button>
        <button
          className={`settings-tab ${activeTab === 'providers' ? 'active' : ''}`}
          onClick={() => setActiveTab('providers')}
        >
          Providers
        </button>
        <button
          className={`settings-tab ${activeTab === 'native' ? 'active' : ''}`}
          onClick={() => setActiveTab('native')}
        >
          Native
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'models' && <ModelSelectionTab />}
        {activeTab === 'inference' && <InferenceSettingsTab />}
        {activeTab === 'providers' && <ProviderConfigTab />}
        {activeTab === 'native' && <NativeIntegrationTab />}
      </div>
    </div>
  )
}

