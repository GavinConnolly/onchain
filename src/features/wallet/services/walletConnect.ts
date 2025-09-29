import { SignClient } from '@walletconnect/sign-client';
import { getSdkError } from '@walletconnect/utils';
import {
  walletConnectConfig,
  defaultNetwork,
} from '../../../config/wallet.config';

let signClient: typeof SignClient.prototype | null = null;

export const walletConnectService = {
  async initialize() {
    if (!signClient) {
      signClient = await SignClient.init({
        projectId: walletConnectConfig.projectId,
        metadata: walletConnectConfig.metadata,
      });
    }
    return signClient;
  },

  async createSession() {
    if (!signClient) {
      await this.initialize();
    }

    if (!signClient) {
      throw new Error('Failed to initialize WalletConnect');
    }

    const { uri, approval } = await signClient.connect({
      requiredNamespaces: {
        eip155: {
          methods: ['eth_sendTransaction', 'personal_sign'],
          chains: [`eip155:${defaultNetwork.chainId}`],
          events: ['accountsChanged', 'chainChanged'],
        },
      },
    });

    return { uri, approval };
  },

  async disconnect(topic: string) {
    if (!signClient) {
      throw new Error('WalletConnect not initialized');
    }

    await signClient.disconnect({
      topic,
      reason: getSdkError('USER_DISCONNECTED'),
    });
  },

  getClient() {
    return signClient;
  },
};
