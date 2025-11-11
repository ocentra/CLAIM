import { useState } from 'react';
import { useAuth } from '@providers';
import { AVATARS } from '@constants/avatars';
import './ProfilePictureModal.css';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePictureModal({ isOpen, onClose }: ProfilePictureModalProps) {
  const { user, updateUserProfile } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Convert to base64 for now (in production, upload to Firebase Storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedAvatar(base64String);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  const convertImageToBase64 = async (imagePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imagePath;
    });
  };

  const handleSetAvatar = async () => {
    if (!selectedAvatar || !user) return;

    setIsSaving(true);
    try {
      let avatarURL = selectedAvatar;
      
      // If it's a local asset path, convert to base64
      if (selectedAvatar.startsWith('/src/assets/')) {
        avatarURL = await convertImageToBase64(selectedAvatar);
      }
      
      await updateUserProfile({
        photoURL: avatarURL
      });
      setSelectedAvatar(null);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedAvatar(null);
    onClose();
  };

  return (
    <div className="profile-modal-overlay" onClick={handleClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>Choose Your Avatar</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="profile-modal-content">
          <div className="current-avatar-preview">
            <img 
              src={selectedAvatar || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
              alt="Selected Avatar"
            />
          </div>

          <div className="avatars-section">
            <div className="avatars-grid">
              {AVATARS.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`avatar-option ${selectedAvatar === avatar.path ? 'selected' : ''} ${user?.photoURL === avatar.path ? 'current' : ''}`}
                  onClick={() => setSelectedAvatar(avatar.path)}
                  title={avatar.name}
                >
                  <img src={avatar.path} alt={avatar.name} />
                  {user?.photoURL === avatar.path && (
                    <div className="current-badge">Current</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <label className="upload-btn">
              <span className="upload-icon">📁</span>
              <span>Upload Custom</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="file-input"
                disabled={isUploading || isSaving}
              />
            </label>

            <button 
              className="set-avatar-btn" 
              onClick={handleSetAvatar}
              disabled={!selectedAvatar || isSaving}
            >
              {isSaving ? 'Saving...' : 'Set Avatar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

