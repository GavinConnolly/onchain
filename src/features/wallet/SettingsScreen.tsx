import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Clipboard,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Lucide } from '@react-native-vector-icons/lucide';
import { useWallet } from './context/WalletContext';
import { shadows } from '../../styles';

export default function SettingsScreen() {
  const { walletState, connectWallet, disconnectWallet, openWalletLink } =
    useWallet();

  const copyConnectionUri = () => {
    if (walletState.status !== 'connecting' || !walletState.connectionUri) {
      Alert.alert('Error', 'No connection link available');
      return;
    }

    try {
      Clipboard.setString(walletState.connectionUri);
      Alert.alert('Success', 'Connection link copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  return (
    <View className="flex-1 p-5 justify-center items-center bg-gray-100 dark:bg-gray-900">
      <Text className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-200">
        Settings
      </Text>

      {walletState.status === 'connected' ? (
        <View
          className="items-center p-5 bg-white dark:bg-gray-800 rounded-3xl"
          // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
          style={shadows.card}
        >
          <Text className="text-base text-gray-600 dark:text-gray-400 mb-2">
            Connected Wallet:
          </Text>
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-5 font-mono">
            {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
          </Text>

          <TouchableOpacity
            className="bg-red-500 px-8 py-4 rounded-2xl min-w-[200px] items-center"
            onPress={disconnectWallet}
          >
            <Text className="text-white text-base font-semibold">
              Disconnect Wallet
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center p-5">
          {walletState.status === 'connecting' && walletState.connectionUri ? (
            <View
              className="items-center p-5 bg-white dark:bg-gray-800 rounded-3xl"
              // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
              style={shadows.card}
            >
              <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-5">
                Scan with your wallet
              </Text>
              <QRCode
                value={walletState.connectionUri}
                size={200}
                backgroundColor="white"
                color="black"
              />
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mt-5 leading-5">
                Open your wallet and scan this QR code to connect, or use these
                options:
              </Text>

              <View className="flex-row mt-4">
                <TouchableOpacity
                  className="bg-gray-500 dark:bg-gray-600 px-6 py-3 rounded-2xl flex-1 mr-3"
                  onPress={openWalletLink}
                >
                  <Text className="text-white text-sm font-semibold text-center">
                    Open Link
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-blue-500 px-3 py-3 rounded-2xl items-center justify-center"
                  onPress={copyConnectionUri}
                >
                  <Lucide name="copy" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text className="text-base text-gray-600 dark:text-gray-400 text-center mb-8 leading-6">
                Connect your wallet to view balances and interact with Ink Chain
              </Text>

              <TouchableOpacity
                className="bg-blue-500 px-8 py-4 rounded-2xl min-w-[200px] items-center relative"
                onPress={connectWallet}
                disabled={walletState.status === 'connecting'}
                // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
                /* eslint-disable react-native/no-inline-styles */
                style={{
                  opacity: walletState.status === 'connecting' ? 0.6 : 1,
                }}
                /* eslint-enable react-native/no-inline-styles */
              >
                <Text
                  className="text-white text-base font-semibold"
                  // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
                  /* eslint-disable react-native/no-inline-styles */
                  style={{
                    opacity: walletState.status === 'connecting' ? 0 : 1,
                  }}
                  /* eslint-enable react-native/no-inline-styles */
                >
                  Connect Wallet
                </Text>
                {walletState.status === 'connecting' && (
                  <View className="absolute inset-0 justify-center items-center">
                    <ActivityIndicator size="small" color="white" />
                  </View>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}
