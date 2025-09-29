import { Linking } from 'react-native';

export interface LinkingResult {
  success: boolean;
  error?: string;
}

export const linkingService = {
  async openWalletLink(connectionUri: string): Promise<LinkingResult> {
    console.log('Opening wallet connection:', connectionUri);

    try {
      await Linking.openURL(connectionUri);

      return {
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log('Failed to open wallet connection:', errorMessage);

      return {
        success: false,
        error: 'Failed to open wallet connection',
      };
    }
  },
};
