import React, { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Lucide } from '@react-native-vector-icons/lucide';
import { AccountScreen, SettingsScreen } from '../features/wallet';
import { ChatScreen } from '../features/chat';

export type RootTabParamList = {
  Account: undefined;
  Settings: undefined;
  Chat: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabs() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const theme = useMemo(
    () =>
      isDarkMode
        ? {
            tabBarActiveTintColor: '#7434f3',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarBackground: '#0C0A10',
            tabBarBorderTop: '#374151',
            headerBackground: '#0C0A10',
            headerTintColor: '#ffffff',
            headerBorderBottom: '#251F42', // kraken-med-dark
          }
        : {
            tabBarActiveTintColor: '#7434f3',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarBackground: '#F4F2F8',
            tabBarBorderTop: '#e5e5e5',
            headerBackground: '#F4F2F8',
            headerTintColor: '#000000',
            headerBorderBottom: '#ffffff', // white
          },
    [isDarkMode],
  );

  const accountIcon = ({ color, size }: { color: string; size: number }) => (
    <Lucide name="circle-user" size={size} color={color} />
  );

  const settingsIcon = ({ color, size }: { color: string; size: number }) => (
    <Lucide name="settings" size={size} color={color} />
  );

  const chatIcon = ({ color, size }: { color: string; size: number }) => (
    <Lucide name="message-circle" size={size} color={color} />
  );

  const screenOptions = useMemo(
    () => ({
      headerShown: true,
      tabBarActiveTintColor: theme.tabBarActiveTintColor,
      tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
      tabBarStyle: {
        backgroundColor: theme.tabBarBackground,
        borderTopColor: theme.tabBarBorderTop,
        borderTopWidth: 0,
        paddingTop: 8,
        paddingBottom: 8,
        height: 84,
      },
      headerStyle: {
        backgroundColor: theme.headerBackground,
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 1,
        borderBottomColor: theme.headerBorderBottom,
      },
      headerTintColor: theme.headerTintColor,
    }),
    [theme],
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: accountIcon,
          tabBarAccessibilityLabel: 'Account tab',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: settingsIcon,
          tabBarAccessibilityLabel: 'Settings tab',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: chatIcon,
          tabBarAccessibilityLabel: 'Chat tab',
        }}
      />
    </Tab.Navigator>
  );
}
