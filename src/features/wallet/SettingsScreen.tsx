import React from 'react';
import { View, Text, Clipboard, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Lucide } from '@react-native-vector-icons/lucide';
import { useWallet } from './context/WalletContext';
import { shadows } from '../../styles';
import { BackgroundOrb, Button } from '../../components';

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
    <View className="flex-1 p-5 pb-10 justify-center items-center bg-kraken-light dark:bg-kraken-dark border-b-2 border-white dark:border-kraken-dark-med">
      <BackgroundOrb />
      {walletState.status === 'connected' ? (
        <View
          className="items-center p-6 bg-white dark:bg-kraken-dark-med rounded-3xl"
          // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
          style={shadows.card}
        >
          <Text className="text-base text-gray-600 dark:text-gray-400 mb-2">
            Connected Wallet:
          </Text>
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-5 font-mono">
            {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
          </Text>

          <Button
            title="Disconnect Wallet"
            onPress={disconnectWallet}
            variant="danger"
            className="min-w-[200px]"
          />
        </View>
      ) : (
        <View className="items-center p-5">
          {walletState.status === 'connecting' && walletState.connectionUri ? (
            <View
              className="items-center p-6 bg-white dark:bg-kraken-dark-med rounded-3xl"
              // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
              style={shadows.card}
            >
              <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
                Connect your wallet
              </Text>
              <QRCode
                value={walletState.connectionUri}
                size={200}
                backgroundColor="white"
                color="black"
              />
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mt-6 leading-5">
                Open your wallet and scan this QR code to connect, or use these
                options:
              </Text>

              <View className="flex-row mt-6">
                <Button
                  title="Open Link"
                  onPress={openWalletLink}
                  variant="small"
                  className="flex-1 mr-3 !justify-start"
                />

                <Button
                  title=""
                  onPress={copyConnectionUri}
                  variant="secondary"
                  icon={<Lucide name="copy" size={16} color="#7434f3" />}
                  iconPosition="only"
                />
              </View>
            </View>
          ) : (
            <>
              <Text className="text-base text-gray-600 dark:text-gray-400 text-center mb-8 leading-6">
                Connect your wallet to view balances and interact with Ink Chain
              </Text>

              <Button
                title="Connect Wallet"
                onPress={connectWallet}
                loading={walletState.status === 'connecting'}
                variant="primary"
                className="min-w-[200px]"
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}
