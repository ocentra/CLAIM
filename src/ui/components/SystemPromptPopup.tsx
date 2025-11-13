import { useEffect, useRef } from 'react'
import './SystemPromptPopup.css'

interface SystemPromptPopupProps {
  currentPrompt: string
  onSave: (newPrompt: string) => void
  onClose: () => void
}

export function SystemPromptPopup({ currentPrompt, onSave, onClose }: SystemPromptPopupProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSave = () => {
    if (textareaRef.current) {
      onSave(textareaRef.current.value)
    }
  }

  return (
    <div className="system-prompt-popup-backdrop" onClick={onClose}>
      <div className="system-prompt-popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="system-prompt-popup-header">
          <span>Edit System Prompt</span>
          <button onClick={onClose} title="Close">&times;</button>
        </div>
        <textarea
          ref={textareaRef}
          defaultValue={currentPrompt}
          className="system-prompt-popup-textarea"
        />
        <div className="system-prompt-popup-footer">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleSave} className="ok-btn">OK</button>
        </div>
      </div>
    </div>
  )
}

