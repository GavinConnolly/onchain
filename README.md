# Onchain - React Native Wallet Integration Demo

A React Native application demonstrating wallet integration with Ink Chain testnet, featuring WalletConnect integration, balance querying, and (demo) real-time chat functionality.

<img src="https://github.com/GavinConnolly/onchain/blob/main/screenshots/account.png?raw=true" alt="Account" width="200"/>

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: `>= 20.19.4`
- **npm**: `>= 10.0.0` (or **Yarn**: `>= 1.22.0`)
- **React Native CLI**: `20.0.0`
- **Xcode**: `>= 16.1` (Required for iOS development)
- **Android Studio**: `>= 2025.1` (Required for Android development)

Refer to [React Native documentation](https://reactnative.dev/docs/set-up-your-environment).

## Technology Stack

- **React Native**: `0.81.4`
- **React**: `19.1.0`
- **TypeScript**: `^5.8.3`
- **NativeWind**: `^4.2.1`
- **WalletConnect**: `^2.21.9`
- **Viem**: `^2.37.8`
- **React Native Keychain**: Secure storage for wallet sessions

## Features

- **Wallet Integration**: Connect with any WalletConnect-compatible wallet
- **Balance Queries**: View ETH and ERC-20 token balances on Ink Sepolia with pull-to-refresh
- **QR Code Connection**: Scan to connect with mobile wallets
- **Session Persistence**: Secure wallet session storage using device Keychain/Keystore
- **Auto-Reconnect**: Seamlessly restore wallet connections across app sessions
- **Real-time Chat**: WebSocket-based messaging demo
- **Light & Dark Mode**: Full theme support that responds to system preferences

## Setup

### 1. Clone and Install

```bash
git clone git@github.com:GavinConnolly/onchain.git
cd onchain
npm install
```

### 2. iOS Setup (macOS only)

```bash
# Install Ruby dependencies (CocoaPods, etc.)
bundle install

# Install iOS dependencies using bundled CocoaPods version
cd ios
bundle exec pod install
cd ..
```

## Development

### Start Metro Bundler

```bash
npm start
```

### Run on iOS

```bash
npm run ios
```

### Run on Android

```bash
npm run android
```

### Development Commands

```bash
# Linting
npm run lint

# Testing
npm run test

# Reset Metro cache (if needed)
npm start -- --reset-cache
```

## Configuration

### WalletConnect Setup

The app uses WalletConnect v2 for wallet integration:

- **Project ID**: Pre-configured in `src/config/wallet.config.ts`

### Chat Configuration

The app includes a WebSocket-based (demo) chat feature:

- **Server URL**: Pre-configured in `src/config/chat.config.ts`

### Ink Chain Configuration

- **Network**: Ink Sepolia Testnet
- **Chain ID**: 763373
- **RPC URL**: `https://rpc-gel-sepolia.inkonchain.com/`
- **Explorer**: `https://explorer-sepolia.inkonchain.com/`
- **Faucet**: [https://inkonchain.com/faucet](https://inkonchain.com/faucet)

## Architecture

### Project Structure

**Feature-Based Architecture** for scalability and maintainability:

```
├── src/
│   ├── components/          # Shared UI components
│   │   ├── Button.tsx       # Reusable button with variants
│   │   ├── ErrorBoundary.tsx
│   │   ├── KeyboardAvoidView.tsx
│   │   └── index.ts         # Barrel exports
│   ├── config/             # Global configuration
│   │   ├── chat.config.ts
│   │   └── wallet.config.ts
│   ├── features/           # Feature-based modules
│   │   ├── wallet/         # Wallet feature
│   │   │   ├── context/    # WalletContext provider
│   │   │   ├── services/   # Wallet-specific services
│   │   │   │   ├── keychain.ts
│   │   │   │   ├── linking.ts
│   │   │   │   ├── walletConnect.ts
│   │   │   │   └── index.ts # Service barrel exports
│   │   │   ├── AccountScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   └── index.ts    # Feature barrel exports
│   │   └── chat/           # Chat feature
│   │       ├── hooks/      # Chat-specific hooks
│   │       │   └── useChat.ts
│   │       ├── ChatScreen.tsx
│   │       └── index.ts    # Feature barrel exports
│   ├── navigation/         # App navigation
│   │   └── BottomTabs.tsx
│   └── styles/             # Shared styles
│       ├── shadows.ts      # Shadow style constants
│       └── index.ts        # Style barrel exports
```

## Troubleshooting

### Common Issues

1. **Metro bundler errors**: Clear cache with `npm start -- --reset-cache`
2. **iOS build issues**: Clean build folder in Xcode or run `cd ios && bundle exec pod install`
3. **Android build issues**: Clean project in Android Studio
