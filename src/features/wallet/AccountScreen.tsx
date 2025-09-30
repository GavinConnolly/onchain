import React, { useMemo } from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from './context/WalletContext';
import { tokenConfig } from '../../config/wallet.config';
import { shadows } from '../../styles';
import { Button } from '../../components';

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
      className="w-full bg-white dark:bg-kraken-dark-med p-5 rounded-3xl mb-5"
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
  <View className="flex-1 p-5 justify-center items-center bg-kraken-light dark:bg-kraken-dark">
    <Text className="text-base text-gray-600 dark:text-gray-400 text-center mb-8 leading-6">
      Connect your wallet in Settings to view your account
    </Text>

    <Button
      title="Settings"
      onPress={onSettingsPress}
      variant="primary"
      className="min-w-[200px]"
    />
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

  if (walletState.status !== 'connected') {
    return (
      <DisconnectedView
        onSettingsPress={() => navigation.navigate('Settings' as never)}
      />
    );
  }

  return (
    <ScrollView
      className="flex-1 p-5 bg-kraken-light dark:bg-kraken-dark"
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

        <Button
          title="Refresh Balances"
          onPress={updateBalances}
          loading={walletState.isUpdatingBalances}
          variant="primary"
        />
      </View>
    </ScrollView>
  );
}
