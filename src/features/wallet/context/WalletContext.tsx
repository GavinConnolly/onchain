import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { createPublicClient, http, formatEther } from 'viem';
import { defaultNetwork, tokenConfig } from '../../../config/wallet.config';
import {
  keychainService,
  walletConnectService,
  linkingService,
} from '../services';

// NOTE : Separating context data and actions may be desirable at some point, but at this point it would be premature optimisation

type WalletConnectionState =
  | { status: 'disconnected' }
  | { status: 'connecting'; connectionUri?: string }
  | {
      status: 'connected';
      address: string;
      sessionTopic: string;
      ethBalance: string | null;
      tokenBalance: string | null;
      isUpdatingBalances: boolean;
    };

interface WalletContextType {
  walletState: WalletConnectionState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  updateBalances: () => Promise<void>;
  openWalletLink: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletState, setWalletState] = useState<WalletConnectionState>({
    status: 'disconnected',
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const saveWalletSession = useCallback(
    async (sessionTopic: string, address: string) => {
      try {
        await keychainService.saveWalletSession(sessionTopic, address);
        if (!isMountedRef.current) return;
      } catch (error) {
        console.error('Failed to save wallet session:', error);
      }
    },
    [],
  );

  const clearWalletSession = useCallback(async () => {
    try {
      await keychainService.clearWalletSession();
      if (!isMountedRef.current) return;
    } catch (error) {
      console.error('Failed to clear wallet session:', error);
    }
  }, []);

  const restoreWalletSession = useCallback(async () => {
    try {
      const walletSession = await keychainService.getWalletSession();

      if (!isMountedRef.current) return false;

      if (!walletSession) {
        return false;
      }

      const { sessionTopic: savedSessionTopic, address: savedAddress } =
        walletSession;

      const signClient = walletConnectService.getClient();
      if (!signClient) {
        return false;
      }

      // Check if session still exists and is valid
      const sessions = signClient.session.getAll();
      const session = sessions.find(s => s.topic === savedSessionTopic);

      if (session) {
        if (!isMountedRef.current) return false;

        setWalletState({
          status: 'connected',
          address: savedAddress,
          sessionTopic: savedSessionTopic,
          ethBalance: null,
          tokenBalance: null,
          isUpdatingBalances: false,
        });

        console.log('Wallet session restored:', savedAddress);
        return true;
      } else {
        // Session expired, clear stored data
        await clearWalletSession();
        return false;
      }
    } catch (error) {
      console.error('Failed to restore wallet session:', error);
      await clearWalletSession();
      return false;
    }
  }, [clearWalletSession]);

  const updateBalances = useCallback(async () => {
    let currentAddress: string | null = null;

    setWalletState(currentState => {
      if (currentState.status === 'connected') {
        currentAddress = currentState.address;
        return {
          ...currentState,
          isUpdatingBalances: true,
        };
      } else {
        console.log('Cannot update balances: wallet not connected');
      }
      return currentState;
    });

    if (!currentAddress) {
      console.log('No wallet address available - wallet not connected');
      return;
    }

    try {
      console.log('Updating balances for:', currentAddress);

      const client = createPublicClient({
        transport: http(defaultNetwork.rpcUrl),
      });

      const ethBalance = await client.getBalance({
        address: currentAddress as `0x${string}`,
      });
      if (!isMountedRef.current) return;

      const ethBalanceFormatted = formatEther(ethBalance);
      console.log('ETH Balance:', ethBalanceFormatted);

      const tokenAddress = tokenConfig.address;

      const balanceOfAbi = [
        {
          name: 'balanceOf',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'account', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
        {
          name: 'decimals',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'uint8' }],
        },
      ] as const;

      let tokenBalanceFormatted = '0';

      try {
        console.log('Attempting to get token balance...');

        // Get token balance
        const tokenBalance = await client.readContract({
          address: tokenAddress as `0x${string}`,
          abi: balanceOfAbi,
          functionName: 'balanceOf',
          args: [currentAddress as `0x${string}`],
        });
        if (!isMountedRef.current) return;

        console.log('Token balance raw:', tokenBalance);

        // Get token decimals
        const tokenDecimals = await client.readContract({
          address: tokenAddress as `0x${string}`,
          abi: balanceOfAbi,
          functionName: 'decimals',
        });
        if (!isMountedRef.current) return;

        const { formatUnits } = await import('viem');
        tokenBalanceFormatted = formatUnits(
          tokenBalance as bigint,
          tokenDecimals as number,
        );

        console.log('Token Balance:', tokenBalanceFormatted);
      } catch (tokenError) {
        console.error('Failed to get token balance:', tokenError);
        console.error('Token error details:', {
          message:
            tokenError instanceof Error ? tokenError.message : tokenError,
          stack: tokenError instanceof Error ? tokenError.stack : 'Unknown',
        });
        tokenBalanceFormatted = '0';
      }

      if (!isMountedRef.current) return;

      setWalletState(currentState => {
        if (currentState.status === 'connected') {
          return {
            ...currentState,
            ethBalance: ethBalanceFormatted,
            tokenBalance: tokenBalanceFormatted,
            isUpdatingBalances: false,
          };
        }
        return currentState;
      });
    } catch (error) {
      console.error('Failed to update balances:', error);
    } finally {
      setWalletState(currentState => {
        if (currentState.status === 'connected') {
          return {
            ...currentState,
            isUpdatingBalances: false,
          };
        }
        return currentState;
      });
    }
  }, []);

  // Initialize WalletConnect and restore session on app start
  useEffect(() => {
    const initializeAndRestore = async () => {
      try {
        await walletConnectService.initialize();
        if (!isMountedRef.current) return;
        console.log('WalletConnect initialized');

        const restored = await restoreWalletSession();
        if (restored) {
          setTimeout(() => {
            if (isMountedRef.current) {
              updateBalances();
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Failed to initialize WalletConnect:', error);
      }
    };

    initializeAndRestore();
  }, [restoreWalletSession, updateBalances]);

  const connectWallet = useCallback(async () => {
    try {
      console.log('Starting wallet connection...');
      setWalletState({ status: 'connecting' });

      await walletConnectService.initialize();
      if (!isMountedRef.current) return;
      console.log('WalletConnect initialized successfully');

      const { uri, approval } = await walletConnectService.createSession();
      if (!isMountedRef.current) return;

      if (uri) {
        setWalletState({ status: 'connecting', connectionUri: uri });
      }

      // Try to open wallet connection link
      if (uri) {
        await linkingService.openWalletLink(uri);
      }

      // Wait for user approval
      const session = await approval();
      if (!isMountedRef.current) return;
      console.log('Session approved:', session);

      // Extract wallet address from session
      const accounts = session.namespaces.eip155?.accounts || [];
      const address = accounts[0]?.split(':')[2]; // Extract address from "eip155:chainId:address"

      if (address) {
        setWalletState({
          status: 'connected',
          address,
          sessionTopic: session.topic,
          ethBalance: null,
          tokenBalance: null,
          isUpdatingBalances: false,
        });

        console.log('Wallet connected:', address);

        await saveWalletSession(session.topic, address);

        setTimeout(() => {
          if (isMountedRef.current) {
            updateBalances();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletState({ status: 'disconnected' });
    }
  }, [saveWalletSession, updateBalances]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (walletState.status === 'connected') {
        await walletConnectService.disconnect(walletState.sessionTopic);
      }

      setWalletState({ status: 'disconnected' });

      await clearWalletSession();

      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, [walletState, clearWalletSession]);

  const openWalletLink = useCallback(async () => {
    if (walletState.status !== 'connecting' || !walletState.connectionUri) {
      console.log('No connection URI available');
      return;
    }

    await linkingService.openWalletLink(walletState.connectionUri);
  }, [walletState]);

  const contextValue = useMemo(
    () => ({
      walletState,
      connectWallet,
      disconnectWallet,
      updateBalances,
      openWalletLink,
    }),
    [
      walletState,
      connectWallet,
      disconnectWallet,
      updateBalances,
      openWalletLink,
    ],
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
