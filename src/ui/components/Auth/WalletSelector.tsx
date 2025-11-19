import { useState, useEffect } from 'react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import './WalletSelector.css';
import phantomLogo from '@assets/Auth/phantom.png';
import metamaskLogo from '@assets/Auth/metamask.png';
import coinbaseLogo from '@assets/Auth/coinbase.png';

import { logAuth } from '@lib/logging';

const prefix = '[WalletSelector]';

// Wallet auth logging flags
const LOG_WALLET_UI = true;         // UI interactions - ENABLED for debugging
const LOG_WALLET_ERROR = true;      // Error logging - ENABLED (always logs to IndexedDB)
const LOG_WALLET_FLOW = true;       // Flow tracking - ENABLED for debugging

// Wallet types
export type WalletChain = 'solana' | 'ethereum';
export type WalletProvider = 
  | 'phantom' 
  | 'solflare' 
  | 'metamask' 
  | 'walletconnect'
  | 'coinbase';

export interface WalletOption {
  id: string;
  name: string;
  icon: string; // URL or emoji/icon name
  chain: WalletChain;
  provider: WalletProvider;
  installed?: boolean;
  description?: string;
}

interface WalletSelectorProps {
  onWalletSelected: (wallet: WalletOption) => Promise<void>;
  onBack?: () => void;
}

// All wallets - Top 3 most popular (no chain separation)
const ALL_WALLETS: WalletOption[] = [
  {
    id: 'phantom',
    name: 'Phantom',
    icon: phantomLogo,
    chain: 'solana',
    provider: 'phantom',
    description: 'Most popular Solana wallet',
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: metamaskLogo,
    chain: 'ethereum',
    provider: 'metamask',
    description: 'Most popular Ethereum wallet',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: coinbaseLogo,
    chain: 'ethereum', // Can be used for both, but we'll detect which chain to use
    provider: 'coinbase',
    description: 'Multi-chain wallet (Solana + Ethereum)',
  },
];

export function WalletSelector({ onWalletSelected, onBack }: WalletSelectorProps) {
  const [connectingWalletId, setConnectingWalletId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [walletStatus, setWalletStatus] = useState<Record<string, { installed: boolean; detected: boolean }>>({});
  
  const solanaWallet = useSolanaWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();

  // Check if wallets are installed - only check once on mount
  useEffect(() => {
    const checkWallets = () => {
      logAuth(LOG_WALLET_FLOW, 'info', prefix, '[checkWallets] Checking wallet installation status (one-time check)...');
      const status: Record<string, { installed: boolean; detected: boolean }> = {};
      
      // Check Phantom (Solana) - check window.solana or window.phantom
      interface SolanaProvider {
        isPhantom?: boolean;
        isConnected?: boolean;
      }

      interface WindowWithSolana extends Window {
        solana?: SolanaProvider;
        phantom?: SolanaProvider;
      }

      const windowWithSolana = typeof window !== 'undefined' ? window as WindowWithSolana : null;
      const solana = windowWithSolana?.solana ?? windowWithSolana?.phantom ?? null;
      const isPhantomInstalled = !!solana;
      
      status.phantom = {
        installed: isPhantomInstalled,
        detected: isPhantomInstalled && solanaWallet.connected && solanaWallet.publicKey !== null
      };
      logAuth(LOG_WALLET_FLOW, 'info', prefix, '[checkWallets] Phantom status:', status.phantom);
      
      // Check Ethereum wallets
      interface EthereumProvider {
        isMetaMask?: boolean;
        isCoinbaseWallet?: boolean;
        isCoinbaseBrowser?: boolean;
        providers?: EthereumProvider[];
      }

      interface WindowWithEthereum extends Window {
        ethereum?: EthereumProvider;
      }

      const windowWithEthereum = typeof window !== 'undefined' ? window as WindowWithEthereum : null;
      const ethereum = windowWithEthereum?.ethereum ?? null;
      
      if (ethereum) {
        // Check if MetaMask specifically
        const isMetaMask = ethereum.isMetaMask || 
                          (ethereum.providers && ethereum.providers.some((p) => p.isMetaMask));
        status.metamask = {
          installed: !!isMetaMask,
          detected: !!isMetaMask
        };
        logAuth(LOG_WALLET_FLOW, 'info', prefix, '[checkWallets] MetaMask status:', status.metamask);
        
        // Check Coinbase Wallet
        const isCoinbase = ethereum.isCoinbaseWallet || 
                          ethereum.isCoinbaseBrowser ||
                          (ethereum.providers && ethereum.providers.some((p) => p.isCoinbaseWallet));
        status.coinbase = {
          installed: !!isCoinbase,
          detected: !!isCoinbase
        };
        logAuth(LOG_WALLET_FLOW, 'info', prefix, '[checkWallets] Coinbase status:', status.coinbase);
      } else {
        // No ethereum provider at all
        status.metamask = { installed: false, detected: false };
        status.coinbase = { installed: false, detected: false };
        logAuth(LOG_WALLET_FLOW, 'info', prefix, '[checkWallets] No Ethereum provider detected');
      }
      
      setWalletStatus(status);
      logAuth(LOG_WALLET_FLOW, 'info', prefix, '[checkWallets] ✅ Wallet status check complete:', status);
    };
    
    // Check once on mount only
    checkWallets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - check only once on mount

  const handleWalletSelect = async (wallet: WalletOption) => {
    logAuth(LOG_WALLET_UI, 'info', prefix, '[handleWalletSelect] User clicked wallet:', wallet.name, wallet);
    
    // Safety check: don't allow connection if wallet is not installed
    const status = walletStatus[wallet.id] || { installed: false, detected: false };
    if (!status.installed) {
      logAuth(LOG_WALLET_ERROR, 'warn', prefix, '[handleWalletSelect] ❌ Wallet not installed:', wallet.name);
      setError(`${wallet.name} is not installed. Please install it first using the link below.`);
      return;
    }
    
    setConnectingWalletId(wallet.id);
    setError('');

    try {
      if (wallet.chain === 'solana') {
        logAuth(LOG_WALLET_FLOW, 'info', prefix, '[handleWalletSelect] Connecting Solana wallet:', wallet.name);
        // Use Solana wallet adapter modal
        setSolanaModalVisible(true);
        
        // Wait for connection with timeout
        const connectionPromise = new Promise<boolean>((resolve) => {
          // If already connected, resolve immediately
          if (solanaWallet.connected && solanaWallet.publicKey) {
            resolve(true);
            return;
          }

          // Listen for connection
          const checkConnection = setInterval(() => {
            if (solanaWallet.connected && solanaWallet.publicKey) {
              clearInterval(checkConnection);
              resolve(true);
            }
          }, 100);
          
          // Timeout after 30 seconds
          setTimeout(() => {
            clearInterval(checkConnection);
            resolve(false);
          }, 30000);
        });

        const connected = await connectionPromise;
        
        // Close modal if it's still open
        setSolanaModalVisible(false);

        if (!connected) {
          logAuth(LOG_WALLET_ERROR, 'error', prefix, '[handleWalletSelect] ❌ Wallet connection failed or cancelled');
          throw new Error('Wallet connection cancelled or failed. Please try again.');
        }
        logAuth(LOG_WALLET_FLOW, 'info', prefix, '[handleWalletSelect] ✅ Solana wallet connected');
      } else if (wallet.chain === 'ethereum') {
        logAuth(LOG_WALLET_FLOW, 'info', prefix, '[handleWalletSelect] Connecting Ethereum wallet:', wallet.name);
        // Ethereum wallet connection
        await connectEthereumWallet(wallet);
        logAuth(LOG_WALLET_FLOW, 'info', prefix, '[handleWalletSelect] ✅ Ethereum wallet connected');
      }

      // Small delay to ensure wallet state is updated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      logAuth(LOG_WALLET_FLOW, 'info', prefix, '[handleWalletSelect] Calling onWalletSelected callback');
      await onWalletSelected(wallet);
      logAuth(LOG_WALLET_FLOW, 'info', prefix, '[handleWalletSelect] ✅ Wallet selection flow completed');
      setConnectingWalletId(null);
    } catch (err: unknown) {
      logAuth(LOG_WALLET_ERROR, 'error', prefix, '[handleWalletSelect] ❌ Wallet connection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet. Please try again.';
      setError(errorMessage);
      setConnectingWalletId(null);
    }
  };

  const connectEthereumWallet = async (wallet: WalletOption): Promise<void> => {
    logAuth(LOG_WALLET_FLOW, 'info', prefix, '[connectEthereumWallet] Starting connection for:', wallet.name);
    
    interface EthereumProvider {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      isCoinbaseBrowser?: boolean;
      providers?: EthereumProvider[];
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    }

    interface WindowWithEthereum extends Window {
      ethereum?: EthereumProvider;
    }

    const windowWithEthereum = typeof window !== 'undefined' ? window as WindowWithEthereum : null;
    
    if (!windowWithEthereum?.ethereum) {
      logAuth(LOG_WALLET_ERROR, 'error', prefix, '[connectEthereumWallet] ❌ Ethereum provider not found');
      throw new Error(`${wallet.name} is not installed. Please install ${wallet.name} first.`);
    }

    const ethereum = windowWithEthereum.ethereum;
    
    // Check for Coinbase Wallet specifically
    if (wallet.provider === 'coinbase') {
      // Coinbase Wallet can be detected via isCoinbaseWallet flag or provider
      const isCoinbaseWallet = ethereum.isCoinbaseWallet || 
                                ethereum.isCoinbaseBrowser ||
                                (ethereum.providers && ethereum.providers.some((p) => p.isCoinbaseWallet));
      
      if (!isCoinbaseWallet) {
        // Try to find Coinbase Wallet in providers array
        if (ethereum.providers) {
          const coinbaseProvider = ethereum.providers.find((p) => p.isCoinbaseWallet);
          if (coinbaseProvider) {
            // Use Coinbase Wallet provider
            try {
              const accounts = (await coinbaseProvider.request({ method: 'eth_requestAccounts' })) as string[];
              if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found');
              }
              return;
            } catch (err: unknown) {
              const error = err as { code?: number };
              if (error.code === 4001) {
                throw new Error('Please connect to Coinbase Wallet.');
              }
              throw err;
            }
          }
        }
        throw new Error('Coinbase Wallet not detected. Please make sure Coinbase Wallet extension is installed and enabled.');
      }
    }
    
    // For MetaMask and Coinbase Wallet (when using main ethereum provider)
    try {
      // Request account access
      const accounts = (await ethereum.request({ method: 'eth_requestAccounts' })) as string[];
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }
    } catch (err: unknown) {
      const error = err as { code?: number };
      if (error.code === 4001) {
        throw new Error(`Please connect to ${wallet.name}.`);
      }
      throw err;
    }
  };

  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  return (
    <div className="wallet-selector">
      <div className="wallet-selector-header">
        {onBack && (
          <button className="wallet-selector-back" onClick={onBack}>
            ← Back
          </button>
        )}
        <h2 className="wallet-selector-title">Connect Wallet</h2>
        <div className="wallet-selector-subtitle-wrapper">
          <p className="wallet-selector-subtitle">Choose your wallet provider for authentication</p>
          <button
            type="button"
            className="wallet-info-icon"
            onMouseEnter={() => setShowInfoTooltip(true)}
            onMouseLeave={() => setShowInfoTooltip(false)}
            onClick={() => setShowInfoTooltip(!showInfoTooltip)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowInfoTooltip(!showInfoTooltip);
              }
            }}
            aria-label="Show authentication information"
            aria-expanded={showInfoTooltip}
          >
            <span className="wallet-info-icon-text">?</span>
            {showInfoTooltip && (
              <div className="wallet-info-tooltip">
                <div className="wallet-info-tooltip-content">
                  <h4>🔒 Secure Authentication Only</h4>
                  <p>Your wallet is used <strong>only for authentication</strong> to verify your identity.</p>
                  <ul>
                    <li>✅ We store only your <strong>public wallet address</strong> (not private keys)</li>
                    <li>✅ Your funds remain secure and untouched</li>
                    <li>✅ Deposits and transactions are handled securely through your wallet</li>
                    <li>✅ We never access or store your private keys or seed phrases</li>
                  </ul>
                  <p className="wallet-info-tooltip-footer">Compliant with GDPR, CCPA, and industry security standards.</p>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="wallet-selector-error">
          {error}
        </div>
      )}

      <div className="wallet-list">
        {ALL_WALLETS.map((wallet) => {
          const status = walletStatus[wallet.id] || { installed: false, detected: false };
          const isInstalled = status.installed;
          const isConnecting = connectingWalletId === wallet.id;
          
          return (
            <div key={wallet.id} className="wallet-option-wrapper">
              <button
                className={`wallet-option ${!isInstalled ? 'wallet-not-installed' : ''}`}
                onClick={() => {
                  if (!isInstalled) {
                    // Don't allow connection if wallet is not installed
                    return;
                  }
                  handleWalletSelect(wallet);
                }}
                disabled={connectingWalletId !== null || !isInstalled}
                title={!isInstalled ? `${wallet.name} is not installed. Click install link below to install it.` : `Connect with ${wallet.name}`}
              >
                <img src={wallet.icon} alt={wallet.name} className="wallet-option-icon" />
                <div className="wallet-option-info">
                  <h3 className="wallet-option-name">
                    {wallet.name}
                    {!isInstalled && <span className="wallet-not-installed-badge">Not Installed</span>}
                  </h3>
                  {wallet.description && (
                    <p className="wallet-option-description">{wallet.description}</p>
                  )}
                </div>
                {isConnecting && (
                  <div className="wallet-option-loading">⏳</div>
                )}
                {!isInstalled && (
                  <div className="wallet-install-icon">📥</div>
                )}
              </button>
              {!isInstalled && (
                <div className="wallet-install-prompt">
                  <p>Don't have {wallet.name}? Install it to connect your wallet.</p>
                  <a
                    href={
                      wallet.id === 'phantom' 
                        ? 'https://phantom.app/download'
                        : wallet.id === 'metamask'
                        ? 'https://metamask.io/download'
                        : 'https://www.coinbase.com/wallet'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wallet-install-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Install {wallet.name} →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {onBack && (
        <div className="wallet-selector-note">
          <p>💡 Don't have a wallet? You can{' '}
            <button
              type="button"
              className="wallet-selector-back-link"
              onClick={onBack}
            >
              log in with email, Google, or Facebook
            </button>
            {' '}instead.</p>
        </div>
      )}
    </div>
  );
}

