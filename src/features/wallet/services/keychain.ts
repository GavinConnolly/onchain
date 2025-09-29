import * as Keychain from 'react-native-keychain';

const KEYCHAIN_SERVICES = {
  WALLET_SESSION: 'com.onchain.wallet.session',
  WALLET_ADDRESS: 'com.onchain.wallet.address',
} as const;

export interface WalletSession {
  sessionTopic: string;
  address: string;
}

export const keychainService = {
  async saveWalletSession(sessionTopic: string, address: string): Promise<void> {
    await Promise.all([
      Keychain.setInternetCredentials(
        KEYCHAIN_SERVICES.WALLET_SESSION,
        'session',
        sessionTopic,
        {
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        },
      ),
      Keychain.setInternetCredentials(
        KEYCHAIN_SERVICES.WALLET_ADDRESS,
        'address',
        address,
        {
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        },
      ),
    ]);
  },

  async getWalletSession(): Promise<WalletSession | null> {
    try {
      const [sessionResult, addressResult] = await Promise.all([
        Keychain.getInternetCredentials(KEYCHAIN_SERVICES.WALLET_SESSION),
        Keychain.getInternetCredentials(KEYCHAIN_SERVICES.WALLET_ADDRESS),
      ]);

      if (sessionResult && addressResult) {
        return {
          sessionTopic: sessionResult.password,
          address: addressResult.password,
        };
      }

      return null;
    } catch (error) {
      console.log('No saved wallet session found');
      return null;
    }
  },

  async clearWalletSession(): Promise<void> {
    try {
      await Promise.all([
        Keychain.resetInternetCredentials({
          service: KEYCHAIN_SERVICES.WALLET_SESSION,
        }),
        Keychain.resetInternetCredentials({
          service: KEYCHAIN_SERVICES.WALLET_ADDRESS,
        }),
      ]);
    } catch (error) {
      console.log('No session to clear');
    }
  },
};