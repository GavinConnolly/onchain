import React, { useMemo } from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lucide } from '@react-native-vector-icons/lucide';
import type { ComponentProps } from 'react';
import { useWallet } from './context/WalletContext';
import { tokenConfig } from '../../config/wallet.config';
import { shadows } from '../../styles';
import { BackgroundOrb, Button } from '../../components';

const BalanceCard = React.memo(
  ({
    title,
    value,
    subtitle,
    largeValue = false,
    icon,
    iconColor,
  }: {
    title: string;
    value: string;
    subtitle?: string;
    largeValue?: boolean;
    icon?: ComponentProps<typeof Lucide>['name'];
    iconColor?: string;
  }) => (
    <View
      className="w-full bg-white dark:bg-kraken-dark-med p-6 rounded-3xl mb-5"
      style={shadows.card}
    >
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
        {title}
      </Text>
      <View className="flex-row items-center">
        {icon && (
          <View
            className={`${
              largeValue ? 'w-8 h-8' : 'w-6 h-6'
            } rounded-full items-center justify-center mr-3`}
            style={{ backgroundColor: iconColor }}
          >
            <Lucide name={icon} size={largeValue ? 16 : 12} color="#ffffff" />
          </View>
        )}
        <Text
          className={
            largeValue
              ? 'text-3xl text-gray-800 dark:text-gray-200 font-semibold'
              : 'text-xl text-gray-800 dark:text-gray-200 font-semibold'
          }
        >
          {value}
        </Text>
      </View>
      {subtitle && (
        <Text
          className={
            largeValue
              ? 'text-sm text-gray-800 dark:text-gray-200 font-mono mt-2'
              : 'text-xs text-gray-800 dark:text-gray-200 font-mono mt-2'
          }
        >
          {subtitle}
        </Text>
      )}
    </View>
  ),
);

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
        isConnected && ethBalance ? parseFloat(ethBalance).toString() : '...',
      token:
        isConnected && tokenBalance
          ? `${parseFloat(tokenBalance).toString()} Tokens`
          : '...',
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
      className="flex-1 bg-kraken-light dark:bg-kraken-dark"
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={updateBalances} />
      }
    >
      <BackgroundOrb />
      <View className="items-center p-5">
        <BalanceCard title="Wallet Address" value={walletState.address} />
      </View>

      <View className="flex-1 justify-center items-center px-5">
        <View className="w-full p-6 mb-5">
          <Text className="text-base text-gray-600 dark:text-gray-400 mb-3 font-medium">
            Wallet Balance
          </Text>
          <View className="flex-row items-center border-b-2 border-white dark:border-kraken-dark-med pb-4 self-start">
            <View className="w-16 h-16 rounded-full bg-blue-500 dark:bg-blue-600 items-center justify-center mr-4">
              <Lucide name="wallet" size={28} color="#ffffff" />
            </View>
            <View className="flex-row items-baseline">
              <Text
                className="text-7xl text-gray-800 dark:text-gray-200 font-bold"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ letterSpacing: -2, lineHeight: 72 }}
              >
                {formattedBalances.eth}
              </Text>
              <Text
                className="text-3xl text-gray-600 dark:text-gray-400 font-semibold ml-2"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ lineHeight: 32 }}
              >
                ETH
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="items-center p-5 gap-5 pb-10 border-b-2 border-white dark:border-kraken-dark-med ">
        <BalanceCard
          title="Token Balance"
          value={formattedBalances.token}
          subtitle={tokenConfig.address}
          largeValue
          icon="hand-coins"
          iconColor="#7434f3"
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
