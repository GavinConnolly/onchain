/**
 * @format
 */

import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import BottomTabs from './src/navigation/BottomTabs';
import { WalletProvider } from './src/features/wallet/context/WalletContext';
import { ErrorBoundary } from './src/components';
import './global.css';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? '#111827' : '#ffffff'}
          translucent={false}
        />
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
          <WalletProvider>
            <View className="flex-1">
              <BottomTabs />
            </View>
          </WalletProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
