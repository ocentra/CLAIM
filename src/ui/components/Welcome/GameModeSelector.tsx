import { useState } from 'react';
import './GameModeSelector.css';

interface GameModeSelectorProps {
  onPlaySinglePlayer?: (config: { aiCount: number; aiModel: string }) => void;
  onPlayMultiplayer?: (config: { humans: number; ai: number; aiModel: string }) => void;
}

export function GameModeSelector({ onPlaySinglePlayer, onPlayMultiplayer }: GameModeSelectorProps) {
  const [aiCount, setAiCount] = useState(3);
  const [aiModels, setAiModels] = useState(['GPT-5', 'Claude 4', 'Phi 3.5']);
  const [multiplayerHumans, setMultiplayerHumans] = useState(2);
  const [multiplayerAI, setMultiplayerAI] = useState(2);
  const [multiplayerAiModels, setMultiplayerAiModels] = useState(['GPT-5', 'Claude 4']);

  const handleAiCountChange = (count: number) => {
    setAiCount(count);
    // Initialize with default models
    setAiModels(Array(count).fill(0).map((_, i) => ['GPT-5', 'Claude 4', 'Phi 3.5'][i % 3]));
  };

  const handleAiModelChange = (index: number, model: string) => {
    const newModels = [...aiModels];
    newModels[index] = model;
    setAiModels(newModels);
  };

  const handleMultiplayerHumansChange = (count: number) => {
    setMultiplayerHumans(count);
    const aiCount = 4 - count;
    setMultiplayerAI(aiCount);
    setMultiplayerAiModels(Array(aiCount).fill(0).map((_, i) => ['GPT-5', 'Claude 4'][i % 2]));
  };

  const handleMultiplayerAiModelChange = (index: number, model: string) => {
    const newModels = [...multiplayerAiModels];
    newModels[index] = model;
    setMultiplayerAiModels(newModels);
  };

  const handlePlaySinglePlayer = () => {
    console.log('Starting single player game...', { aiCount, aiModels });
    onPlaySinglePlayer?.({ aiCount, aiModel: aiModels[0] });
  };

  const handlePlayMultiplayer = () => {
    console.log('Starting multiplayer game...', { humans: multiplayerHumans, ai: multiplayerAI, aiModels: multiplayerAiModels });
    onPlayMultiplayer?.({ humans: multiplayerHumans, ai: multiplayerAI, aiModel: multiplayerAiModels[0] });
  };

  return (
    <div className="game-modes">
      {/* Single Player */}
      <div className="mode-card">
        <div className="mode-header">
          <div className="mode-icon">🎮</div>
          <h3 className="mode-title">Single Player</h3>
        </div>
        
            <div className="mode-config">
              <div className="config-buttons">
                {[1, 2, 3].map(count => (
                  <button
                    key={count}
                    className={`config-option ${aiCount === count ? 'active' : ''}`}
                    onClick={() => handleAiCountChange(count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
              
              <div className="ai-models-grid">
                {aiModels.slice(0, aiCount).map((model, index) => (
                  <select 
                    key={index}
                    className="config-select"
                    value={model}
                    onChange={(e) => handleAiModelChange(index, e.target.value)}
                    aria-label={`Select AI ${index + 1} Model`}
                  >
                    <option value="GPT-5">GPT-5</option>
                    <option value="Claude 4">Claude 4</option>
                    <option value="Phi 3.5">Phi 3.5</option>
                    <option value="Gemini Pro">Gemini Pro</option>
                    <option value="LLaMA 3">LLaMA 3</option>
                  </select>
                ))}
              </div>
            </div>
        
        <button className="mode-button" onClick={handlePlaySinglePlayer}>
          Player VS {aiModels.slice(0, aiCount).join(' | ')}
        </button>
      </div>

      {/* Multiplayer */}
      <div className="mode-card">
        <div className="mode-header">
          <div className="mode-icon">👥</div>
          <h3 className="mode-title">Multiplayer</h3>
        </div>
        
            <div className="mode-config">
              <div className="config-buttons">
                {[2, 3, 4].map(count => (
                  <button
                    key={count}
                    className={`config-option ${multiplayerHumans === count ? 'active' : ''}`}
                    onClick={() => handleMultiplayerHumansChange(count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
              
              {multiplayerAI > 0 && (
                <div className="ai-models-grid">
                  {multiplayerAiModels.slice(0, multiplayerAI).map((model, index) => (
                    <select 
                      key={index}
                      className="config-select"
                      value={model}
                      onChange={(e) => handleMultiplayerAiModelChange(index, e.target.value)}
                      aria-label={`Select AI ${index + 1} Model for multiplayer`}
                    >
                      <option value="GPT-5">GPT-5</option>
                      <option value="Claude 4">Claude 4</option>
                      <option value="Phi 3.5">Phi 3.5</option>
                      <option value="Gemini Pro">Gemini Pro</option>
                      <option value="LLaMA 3">LLaMA 3</option>
                    </select>
                  ))}
                </div>
              )}
            </div>
        
        <button className="mode-button" onClick={handlePlayMultiplayer}>
          {multiplayerHumans} Player{multiplayerHumans > 1 ? 's' : ''} VS {multiplayerAiModels.slice(0, multiplayerAI).join(' | ')}
        </button>
      </div>
    </div>
  );
}

