import React, { useState, useEffect, useRef } from 'react';
import './LoginDialog.css';
import facebookLogo from '@assets/Auth/facebook.png';
import googleLogo from '@assets/Auth/google.png';
import guestLogo from '@assets/Auth/annon.png';
import walletLogo from '@assets/Auth/Wallet.png';
import mLogo from '@assets/Mlogo.png';
import { handleRedirectResult } from '@services';
import { logAuth } from '@lib/logging';
import { GameFooter } from '@/ui/components/Footer/GameFooter';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@providers/AuthProvider';
import { WalletSelector, type WalletOption } from './WalletSelector';

const prefix = '[LoginDialog]';

// Auth flow logging flags
const LOG_AUTH_UI = true;           // UI interactions - ENABLED for debugging
const LOG_AUTH_REDIRECT = true;     // Redirect handling - ENABLED for debugging
const LOG_AUTH_ERROR = true;        // Error logging - ENABLED (always logs to IndexedDB)
const LOG_AUTH_FLOW = true;         // Auth flow steps - ENABLED for debugging

interface LoginDialogProps {
  onLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignUp: (userData: { alias: string; avatar: string; username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  onFacebookLogin: () => Promise<{ success: boolean; error?: string }>;
  onGoogleLogin: () => Promise<{ success: boolean; error?: string }>;
  onGuestLogin: () => Promise<{ success: boolean; error?: string }>;
  onWalletLogin: () => Promise<{ success: boolean; error?: string }>;
  onSendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  onTabSwitch?: () => void; // Add callback for tab switching
}

const LoginDialog: React.FC<LoginDialogProps> = ({
  onLogin,
  onSignUp,
  onFacebookLogin,
  onGoogleLogin,
  onGuestLogin,
  onSendPasswordReset,
  onTabSwitch // Destructure the new prop
}) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState<{id: number, url: string}[]>([]);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const avatarSelectorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wallet = useWallet();
  const { loginWithWallet: authLoginWithWallet } = useAuth();
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation helper
  const validatePassword = (password: string): string | undefined => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return undefined;
  };

  useEffect(() => {
    const checkRedirect = async () => {
      logAuth(LOG_AUTH_REDIRECT, 'log', prefix, '[useEffect] Checking for redirect result on mount...');
      const result = await handleRedirectResult();
      if (result.success) {
        logAuth(LOG_AUTH_REDIRECT, 'log', prefix, '[useEffect] ✅ Login successful after redirect:', { 
          uid: result.user?.uid, 
          displayName: result.user?.displayName 
        });
      } else {
        if (result.error && result.error !== 'No redirect result') {
          logAuth(LOG_AUTH_ERROR, 'error', prefix, '[useEffect] ❌ Login failed after redirect:', result.error);
        } else {
          logAuth(LOG_AUTH_REDIRECT, 'log', prefix, '[useEffect] No redirect result (normal if not returning from OAuth)');
        }
      }
    };

    checkRedirect();
  }, []);

  // Close avatar selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarSelectorRef.current && !avatarSelectorRef.current.contains(event.target as Node)) {
        setShowAvatarSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load avatars from shared constant (eagerly loaded, so instant)
  useEffect(() => {
    import('@constants/avatars').then(({ AVATARS }) => {
      const avatarList = AVATARS.map(avatar => ({
        id: avatar.id,
        url: avatar.path
      }));
      setAvatarOptions(avatarList);
    }).catch(error => {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[useEffect] ❌ Failed to load avatars:', error);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setValidationErrors({});
    setIsLoading(true);

    // Client-side validation
    const errors: { email?: string; password?: string; confirmPassword?: string } = {};

    // Validate email format
    if (!username) {
      errors.email = 'Email is required.';
    } else if (!isValidEmail(username)) {
      errors.email = 'Please enter a valid email address.';
    }

    // Validate password
    if (!password) {
      errors.password = 'Password is required.';
    } else if (!isSignIn) {
      // For sign up, validate password strength
      const passwordError = validatePassword(password);
      if (passwordError) {
        errors.password = passwordError;
      }
    }

    // Validate confirm password for sign up
    if (!isSignIn && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    // If validation errors exist, show them and stop
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    if (isSignIn) {
      logAuth(LOG_AUTH_UI, 'log', prefix, '[handleSubmit] Sign in form submitted:', { username });
      try {
        const result = await onLogin(username, password);
        if (!result.success) {
          setErrorMessage(result.error || 'Login failed. Please check your credentials.');
        } else {
          logAuth(LOG_AUTH_UI, 'log', prefix, '[handleSubmit] ✅ Login callback returned success');
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again.');
        logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleSubmit] ❌ Login exception:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      logAuth(LOG_AUTH_UI, 'log', prefix, '[handleSubmit] Sign up form submitted:', { 
        alias, 
        username, 
        hasAvatar: !!avatar 
      });
      try {
        const result = await onSignUp({ alias, avatar, username, password });
        if (!result.success) {
          setErrorMessage(result.error || 'Sign up failed. Please try again.');
        } else {
          logAuth(LOG_AUTH_UI, 'log', prefix, '[handleSubmit] ✅ Sign up callback returned success');
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again.');
        logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleSubmit] ❌ Sign up exception:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    setValidationErrors({});
    
    // Validate email format
    if (!username) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    
    if (!isValidEmail(username)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const result = await onSendPasswordReset(username);
      if (result.success) {
        setSuccessMessage('Password reset email sent! Please check your inbox.');
        setShowForgotPassword(false);
      } else {
        setErrorMessage(result.error || 'Failed to send password reset email.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleForgotPassword] ❌ Exception:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setAvatar(avatarUrl);
    setShowAvatarSelector(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleWalletButtonClick = () => {
    logAuth(LOG_AUTH_UI, 'info', prefix, '[handleWalletButtonClick] 💼 Wallet button clicked, showing selector');
    setShowWalletSelector(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleWalletSelected = async (walletOption: WalletOption) => {
    logAuth(LOG_AUTH_UI, 'info', prefix, '[handleWalletSelected] 🎯 Wallet selected:', walletOption.name, walletOption);
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (walletOption.chain === 'solana') {
        logAuth(LOG_AUTH_FLOW, 'info', prefix, '[handleWalletSelected] → Routing to Solana wallet auth');
        await handleSolanaWalletAuth();
      } else if (walletOption.chain === 'ethereum') {
        logAuth(LOG_AUTH_FLOW, 'info', prefix, '[handleWalletSelected] → Routing to Ethereum wallet auth');
        await handleEthereumWalletAuth(walletOption);
      } else {
        logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleWalletSelected] ❌ Unknown wallet chain:', walletOption.chain);
        throw new Error(`Unsupported wallet chain: ${walletOption.chain}`);
      }
      logAuth(LOG_AUTH_UI, 'info', prefix, '[handleWalletSelected] ✅ Wallet auth completed successfully');
    } catch (error: unknown) {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleWalletSelected] ❌ Exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      setErrorMessage(errorMessage);
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleWalletSelected] Error message set:', errorMessage);
    } finally {
      setIsLoading(false);
      logAuth(LOG_AUTH_FLOW, 'debug', prefix, '[handleWalletSelected] Loading state reset');
    }
  };

  const handleSolanaWalletAuth = async () => {
    logAuth(LOG_AUTH_FLOW, 'info', prefix, '[handleSolanaWalletAuth] 🔐 Starting Solana wallet authentication');
    logAuth(LOG_AUTH_FLOW, 'debug', prefix, '[handleSolanaWalletAuth] Wallet state:', {
      connected: wallet.connected,
      hasPublicKey: !!wallet.publicKey,
      publicKey: wallet.publicKey?.toBase58(),
      hasSignMessage: !!wallet.signMessage
    });
    
    // Wait a bit for Solana wallet to connect (handled by WalletSelector)
    logAuth(LOG_AUTH_FLOW, 'debug', prefix, '[handleSolanaWalletAuth] Waiting for wallet connection...');
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!wallet.connected || !wallet.publicKey) {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleSolanaWalletAuth] ❌ Wallet not connected:', {
        connected: wallet.connected,
        hasPublicKey: !!wallet.publicKey
      });
      throw new Error('Please connect your Solana wallet first.');
    }

    if (!wallet.signMessage) {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleSolanaWalletAuth] ❌ Wallet does not support message signing');
      throw new Error('Wallet does not support message signing.');
    }

    // Generate challenge message (SIWE-like format for Solana)
    const domain = window.location.hostname;
    const nonce = Math.random().toString(36).substring(2, 15);
    const challengeMessage = `${domain} wants you to sign in with your Solana account:\n${wallet.publicKey.toBase58()}\n\nURI: ${window.location.origin}\nVersion: 1\nChain ID: solana:devnet\nNonce: ${nonce}\nIssued At: ${new Date().toISOString()}`;
    const messageBytes = new TextEncoder().encode(challengeMessage);

    // Sign message
    logAuth(LOG_AUTH_UI, 'info', prefix, '[handleSolanaWalletAuth] ✍️ Requesting signature from wallet...');
    logAuth(LOG_AUTH_FLOW, 'debug', prefix, '[handleSolanaWalletAuth] Message to sign:', challengeMessage);
    let signature: Uint8Array;
    try {
      const signedMessage = await wallet.signMessage!(messageBytes);
      // signMessage returns { signature: Uint8Array } from wallet adapter
      signature = (signedMessage as unknown as { signature: Uint8Array }).signature;
      logAuth(LOG_AUTH_FLOW, 'info', prefix, '[handleSolanaWalletAuth] ✅ Signature received, length:', signature.length);
    } catch (signError) {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleSolanaWalletAuth] ❌ Failed to sign:', signError);
      throw new Error('Message signing cancelled or failed. Please try again.');
    }

    // Authenticate
    const walletPublicKey = wallet.publicKey.toBase58();
    logAuth(LOG_AUTH_FLOW, 'info', prefix, '[handleSolanaWalletAuth] 🔑 Calling Firebase auth with wallet:', walletPublicKey);
    const result = await authLoginWithWallet(walletPublicKey, signature, messageBytes);
    logAuth(LOG_AUTH_FLOW, 'info', prefix, '[handleSolanaWalletAuth] Firebase auth result:', result.success, result.error);

    if (result.success) {
      logAuth(LOG_AUTH_UI, 'info', prefix, '[handleSolanaWalletAuth] ✅ Login successful!');
      setSuccessMessage('Successfully signed in with wallet!');
      setShowWalletSelector(false);
    } else {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleSolanaWalletAuth] ❌ Login failed:', result.error);
      throw new Error(result.error || 'Failed to sign in with wallet.');
    }
  };

  const handleEthereumWalletAuth = async (walletOption: WalletOption) => {
    if (walletOption.provider !== 'metamask' && walletOption.provider !== 'coinbase') {
      throw new Error(`${walletOption.name} integration coming soon!`);
    }

    interface EthereumProvider {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      providers?: EthereumProvider[];
      isCoinbaseWallet?: boolean;
      isCoinbaseBrowser?: boolean;
    }

    interface WindowWithEthereum extends Window {
      ethereum?: EthereumProvider;
    }

    const windowWithEthereum = window as WindowWithEthereum;

    if (typeof window === 'undefined' || !windowWithEthereum.ethereum) {
      throw new Error(`${walletOption.name} is not installed. Please install ${walletOption.name} first.`);
    }

    const ethereum = windowWithEthereum.ethereum;
    
    // For Coinbase Wallet, try to use the Coinbase provider if available
    let provider = ethereum;
    if (walletOption.provider === 'coinbase') {
      if (ethereum.providers) {
        const coinbaseProvider = ethereum.providers.find((p) => p.isCoinbaseWallet);
        if (coinbaseProvider) {
          provider = coinbaseProvider;
        } else if (!ethereum.isCoinbaseWallet && !ethereum.isCoinbaseBrowser) {
          // If Coinbase Wallet is not detected, still try main provider
          // (user might have Coinbase Wallet but it's the only provider)
          logAuth(LOG_AUTH_UI, 'log', prefix, '[handleEthereumWalletAuth] Coinbase Wallet not detected in providers, using main ethereum provider');
        }
      }
    }
    
    // Request account access
    let accounts: string[];
    try {
      accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
    } catch (err: unknown) {
      const error = err as { code?: number };
      if (error.code === 4001) {
        throw new Error(`Please connect to ${walletOption.name}.`);
      }
      throw new Error(`Failed to connect to ${walletOption.name}.`);
    }

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found.');
    }

    const walletAddress = accounts[0];

    // Generate SIWE (Sign-In with Ethereum) message
    const domain = window.location.hostname;
    const origin = window.location.origin;
    const statement = 'Sign in to Ocentra AI';
    const nonce = Math.random().toString(36).substring(2, 15);
    const chainId = await provider.request({ method: 'eth_chainId' });
    
    const siweMessage = `${domain} wants you to sign in with your Ethereum account:\n${walletAddress}\n\n${statement}\n\nURI: ${origin}\nVersion: 1\nChain ID: ${chainId}\nNonce: ${nonce}\nIssued At: ${new Date().toISOString()}`;

    // Sign message
    logAuth(LOG_AUTH_UI, 'log', prefix, `[handleEthereumWalletAuth] Requesting signature from ${walletOption.name}...`);
    let signature: string;
    try {
      signature = (await provider.request({
        method: 'personal_sign',
        params: [siweMessage, walletAddress],
      })) as string;
    } catch (signError: unknown) {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleEthereumWalletAuth] ❌ Failed to sign:', signError);
      throw new Error('Message signing cancelled or failed.');
    }

    // Convert signature to Uint8Array for consistency
    // Ethereum signatures are hex strings, we'll convert to bytes
    const signatureBytes = new Uint8Array(
      signature.slice(2).match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || []
    );
    const messageBytes = new TextEncoder().encode(siweMessage);

    // Authenticate (using same function but with Ethereum address)
    const result = await authLoginWithWallet(walletAddress, signatureBytes, messageBytes);

    if (result.success) {
      logAuth(LOG_AUTH_UI, 'log', prefix, `[handleEthereumWalletAuth] ✅ Login successful with ${walletOption.name}`);
      setSuccessMessage('Successfully signed in with wallet!');
      setShowWalletSelector(false);
    } else {
      throw new Error(result.error || 'Failed to sign in with wallet.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleFileSelect] ❌ Please select an image file');
        return;
      }

      // Resize the image to 256x256
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            // Create a canvas to resize the image
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              // Draw the image resized to 256x256
              ctx.drawImage(img, 0, 0, 256, 256);
              
              // Get the data URL of the resized image
              const resizedImageData = canvas.toDataURL('image/png');
              setAvatar(resizedImageData);
              setShowAvatarSelector(false);
            }
          } catch (error) {
            logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleFileSelect] ❌ Error resizing image:', error);
          }
        };
        
        img.onerror = () => {
          logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleFileSelect] ❌ Error loading image');
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => {
        logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleFileSelect] ❌ Error reading file');
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Show wallet selector if wallet button was clicked
  if (showWalletSelector) {
    return (
      <div className="login-dialog-overlay">
        <div className="login-logo-section">
          <img src={mLogo} alt="Ocentra Logo" className="login-logo" />
          <h2 className="login-brand-text">Ocentra AI</h2>
        </div>
        <WalletSelector
          onWalletSelected={handleWalletSelected}
          onBack={() => {
            setShowWalletSelector(false);
            setErrorMessage('');
            setSuccessMessage('');
          }}
        />
        <div className="login-footer-wrapper">
          <GameFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="login-dialog-overlay">
      {/* Logo and Branding - Outside dialog */}
      <div className="login-logo-section">
        <img src={mLogo} alt="Ocentra Logo" className="login-logo" />
        <h2 className="login-brand-text">Ocentra AI</h2>
      </div>

      <div className="login-dialog">
        <div className="login-header">
          <div className="tab-buttons">
            <button 
              className={`tab-button ${isSignIn ? 'active' : ''}`}
              onClick={() => {
                if (!isSignIn && onTabSwitch) {
                  logAuth(LOG_AUTH_UI, 'log', prefix, '[onClick] Switching to Sign In tab');
                  onTabSwitch(); // Trigger rotation when switching to Sign In
                }
                setIsSignIn(true);
              }}
            >
              SIGN IN
            </button>
            <button 
              className={`tab-button ${!isSignIn ? 'active' : ''}`}
              onClick={() => {
                if (isSignIn && onTabSwitch) {
                  logAuth(LOG_AUTH_UI, 'log', prefix, '[onClick] Switching to Sign Up tab');
                  onTabSwitch(); // Trigger rotation when switching to Sign Up
                }
                setIsSignIn(false);
              }}
            >
              SIGN UP
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {!isSignIn && (
            <>
              <div className="avatar-container">
                <button
                  type="button"
                  className="avatar-preview"
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  aria-label="Select avatar"
                  {...(showAvatarSelector ? { 'aria-expanded': true } : { 'aria-expanded': false })}
                >
                  {avatar ? (
                    <img src={avatar} alt="Selected avatar" />
                  ) : (
                    <div className="avatar-placeholder">👤</div>
                  )}
                </button>
                
                {showAvatarSelector && (
                  <div className="avatar-selector" ref={avatarSelectorRef}>
                    <div className="avatar-grid">
                      {avatarOptions.map((avatarOption) => (
                        <button
                          type="button"
                          key={avatarOption.id}
                          className={`avatar-option ${avatar === avatarOption.url ? 'selected' : ''}`}
                          onClick={() => handleAvatarSelect(avatarOption.url)}
                          aria-label={`Select avatar ${avatarOption.id}`}
                        >
                          {avatarOption.url ? (
                            <img src={avatarOption.url} alt={`Avatar ${avatarOption.id}`} />
                          ) : (
                            <div className="avatar-placeholder">👤</div>
                          )}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="avatar-option upload-option"
                        onClick={handleUploadClick}
                        aria-label="Upload custom avatar"
                      >
                        <div className="upload-placeholder">+</div>
                        <div className="upload-text">Upload</div>
                      </button>
                    </div>
                    <label htmlFor="avatar-upload" className="sr-only">Upload avatar</label>
                    <input
                      type="file"
                      id="avatar-upload"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="sr-only"
                    />
                  </div>
                )}
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Alias"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="login-input"
                />
              </div>
            </>
          )}
          
          <div className="input-group">
            <input
              type="email"
              placeholder={isSignIn ? "Email" : "Email (Username)"}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors({ ...validationErrors, email: undefined });
                }
              }}
              className={`login-input ${validationErrors.email ? 'error' : ''}`}
              disabled={showForgotPassword}
            />
            {validationErrors.email && (
              <div className="validation-error">
                {validationErrors.email}
              </div>
            )}
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors({ ...validationErrors, password: undefined });
                }
              }}
              className={`login-input ${validationErrors.password ? 'error' : ''}`}
              disabled={showForgotPassword}
            />
            {validationErrors.password && (
              <div className="validation-error">
                {validationErrors.password}
              </div>
            )}
            {isSignIn && !showForgotPassword && (
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => {
                  setShowForgotPassword(true);
                  setErrorMessage('');
                  setSuccessMessage('');
                  setValidationErrors({});
                }}
              >
                Forgot Password?
              </button>
            )}
          </div>
          
          {isSignIn && showForgotPassword && (
            <div className="forgot-password-section">
              <p>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <button
                type="button"
                className="sign-in-button"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Email'}
              </button>
              <button
                type="button"
                className="back-to-signin-button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
              >
                Back to Sign In
              </button>
            </div>
          )}
          
          {(errorMessage || successMessage) && (
            <div className={`message-display ${errorMessage ? 'error' : 'success'}`}>
              {errorMessage || successMessage}
            </div>
          )}
          
          {!isSignIn && (
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (validationErrors.confirmPassword) {
                    setValidationErrors({ ...validationErrors, confirmPassword: undefined });
                  }
                }}
                className={`login-input ${validationErrors.confirmPassword ? 'error' : ''}`}
              />
              {validationErrors.confirmPassword && (
                <div className="validation-error">
                  {validationErrors.confirmPassword}
                </div>
              )}
            </div>
          )}
          
          {!showForgotPassword && (
            <button type="submit" className="sign-in-button" disabled={isLoading}>
              {isLoading ? 'Loading...' : (isSignIn ? 'SIGN IN' : 'SIGN UP')}
            </button>
          )}
        </form>
        
        {isSignIn && (
          <>
            <div className="divider">
              <span>or Log in with</span>
            </div>
            
            <div className="social-login">
              <div className="social-buttons-container">
                <button 
                  type="button" 
                  className="social-button"
                  onClick={() => {
                    logAuth(LOG_AUTH_UI, 'log', prefix, '[onClick] Facebook login button clicked');
                    onFacebookLogin();
                  }}
                >
                  <img src={facebookLogo} alt="Facebook" className="social-icon" />
                </button>
                
                <button 
                  type="button" 
                  className="social-button"
                  onClick={() => {
                    logAuth(LOG_AUTH_UI, 'log', prefix, '[onClick] Google login button clicked');
                    onGoogleLogin();
                  }}
                >
                  <img src={googleLogo} alt="Google" className="social-icon" />
                </button>
                
                <button 
                  type="button" 
                  className="social-button"
                  onClick={() => {
                    logAuth(LOG_AUTH_UI, 'log', prefix, '[onClick] Guest login button clicked');
                    onGuestLogin();
                  }}
                >
                  <img src={guestLogo} alt="Guest" className="social-icon" />
                </button>
                
                <button 
                  type="button" 
                  className="social-button"
                  onClick={handleWalletButtonClick}
                  disabled={isLoading}
                  title="Sign in with Wallet"
                >
                  <img src={walletLogo} alt="Wallet" className="social-icon" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer - Outside dialog */}
      <div className="login-footer-wrapper">
        <GameFooter />
      </div>
    </div>
  );
};

export default LoginDialog;