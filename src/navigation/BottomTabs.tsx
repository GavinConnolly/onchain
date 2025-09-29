import React, { useCallback, useMemo } from 'react';
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
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarBackground: '#1f2937',
            tabBarBorderTop: '#374151',
            headerBackground: '#1f2937',
            headerTintColor: '#ffffff',
          }
        : {
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarBackground: '#ffffff',
            tabBarBorderTop: '#e5e5e5',
            headerBackground: '#ffffff',
            headerTintColor: '#000000',
          },
    [isDarkMode],
  );

  const accountIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Lucide name="circle-user" size={size} color={color} />
    ),
    [],
  );

  const settingsIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Lucide name="settings" size={size} color={color} />
    ),
    [],
  );

  const chatIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Lucide name="message-circle" size={size} color={color} />
    ),
    [],
  );

  const screenOptions = useMemo(
    () => ({
      headerShown: true,
      tabBarActiveTintColor: theme.tabBarActiveTintColor,
      tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
      tabBarStyle: {
        backgroundColor: theme.tabBarBackground,
        borderTopColor: theme.tabBarBorderTop,
        paddingTop: 8,
        paddingBottom: 8,
        height: 84,
      },
      headerStyle: {
        backgroundColor: theme.headerBackground,
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
