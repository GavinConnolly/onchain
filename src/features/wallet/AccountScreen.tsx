import React, { useCallback, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useWallet } from './context/WalletContext';
import { tokenConfig } from '../../config/wallet.config';
import { shadows } from '../../styles';

const BalanceCard = React.memo(
  ({
    title,
    value,
    subtitle,
  }: {
    title: string;
    value: string;
    subtitle?: string;
  }) => (
    <View
      className="w-full bg-white dark:bg-gray-800 p-5 rounded-3xl mb-5"
      // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
      style={shadows.card}
    >
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
        {title}
      </Text>
      <Text className="text-xl text-gray-800 dark:text-gray-200 font-semibold">
        {value}
      </Text>
      {subtitle && (
        <Text className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-1">
          {subtitle}
        </Text>
      )}
    </View>
  ),
);

BalanceCard.displayName = 'BalanceCard';

const DisconnectedView = ({
  onSettingsPress,
}: {
  onSettingsPress: () => void;
}) => (
  <View className="flex-1 p-5 justify-center items-center bg-gray-100 dark:bg-gray-900">
    <Text className="text-base text-gray-600 dark:text-gray-400 text-center mb-8 leading-6">
      Connect your wallet in Settings to view your account
    </Text>

    <TouchableOpacity
      className="bg-blue-500 px-8 py-4 rounded-2xl min-w-[200px] items-center"
      onPress={onSettingsPress}
    >
      <Text className="text-white text-base font-semibold">Settings</Text>
    </TouchableOpacity>
  </View>
);

export default function AccountScreen() {
  const { walletState, updateBalances } = useWallet();
  const navigation = useNavigation();

  const isConnected = walletState.status === 'connected';
  const ethBalance = isConnected ? walletState.ethBalance : null;
  const tokenBalance = isConnected ? walletState.tokenBalance : null;

  const formattedBalances = useMemo(
    () => ({
      eth:
        isConnected && ethBalance
          ? `${parseFloat(ethBalance).toFixed(4)} ETH`
          : 'Loading...',
      token:
        isConnected && tokenBalance
          ? `${parseFloat(tokenBalance).toFixed(4)} Tokens`
          : 'Loading...',
    }),
    [isConnected, ethBalance, tokenBalance],
  );

  // Update balances when screen is focused and wallet is connected, but only if balances are missing
  useFocusEffect(
    useCallback(() => {
      if (isConnected && (!ethBalance || !tokenBalance)) {
        updateBalances();
      }
    }, [isConnected, ethBalance, tokenBalance, updateBalances]),
  );

  if (walletState.status !== 'connected') {
    return (
      <DisconnectedView
        onSettingsPress={() => navigation.navigate('Settings' as never)}
      />
    );
  }

  return (
    <ScrollView
      className="flex-1 p-5 bg-gray-100 dark:bg-gray-900"
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={updateBalances} />
      }
    >
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-200">
          Account
        </Text>

        <BalanceCard title="Wallet Address" value={walletState.address} />

        <BalanceCard title="ETH Balance" value={formattedBalances.eth} />

        <BalanceCard
          title="Token Balance"
          value={formattedBalances.token}
          subtitle={tokenConfig.address}
        />

        <TouchableOpacity
          className="bg-blue-500 px-8 py-4 rounded-2xl items-center relative"
          onPress={updateBalances}
          disabled={walletState.isUpdatingBalances}
          // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
          /* eslint-disable react-native/no-inline-styles */
          style={{
            opacity: walletState.isUpdatingBalances ? 0.6 : 1,
          }}
          /* eslint-enable react-native/no-inline-styles */
        >
          <Text
            className="text-white text-base font-semibold"
            // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
            /* eslint-disable react-native/no-inline-styles */
            style={{
              opacity: walletState.isUpdatingBalances ? 0 : 1,
            }}
            /* eslint-enable react-native/no-inline-styles */
          >
            Refresh Balances
          </Text>
          {walletState.isUpdatingBalances && (
            <View className="absolute inset-0 justify-center items-center">
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
