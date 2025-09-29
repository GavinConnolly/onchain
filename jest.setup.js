/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WhenUnlockedThisDeviceOnly',
  },
  setInternetCredentials: jest.fn(),
  getInternetCredentials: jest.fn(),
  resetInternetCredentials: jest.fn(),
}));

jest.mock('react-native-qrcode-svg', () => 'QRCode');

jest.mock('@walletconnect/react-native-compat', () => ({}));

jest.mock('react-native-get-random-values', () => ({}));