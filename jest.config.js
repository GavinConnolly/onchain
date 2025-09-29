module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-css-interop|nativewind|@react-native-vector-icons)/)',
  ],
  moduleNameMapper: {
    '\\.(ttf|otf|eot|woff|woff2)$': 'identity-obj-proxy',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
