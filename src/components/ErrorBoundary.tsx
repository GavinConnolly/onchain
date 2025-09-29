import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { shadows } from '../styles';

// NOTE : In production, this would likely be the sentry bundled error boundary

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error Info:', errorInfo);
    this.setState({
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <View className="flex-1 justify-center items-center p-6 bg-gray-100 dark:bg-gray-900">
          <View
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl w-full max-w-sm"
            // Inline style used as a temporary workaround to known Nativewind issues, eg #1557
            style={shadows.elevated}
          >
            <Text className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">
              Oops! Something went wrong
            </Text>

            <Text className="text-base text-gray-600 dark:text-gray-400 text-center mb-6 leading-6">
              The app encountered an unexpected error. Don't worry, this is
              usually temporary.
            </Text>

            <View className="space-y-3">
              <TouchableOpacity
                className="bg-blue-500 px-6 py-3 rounded-2xl"
                onPress={this.handleRetry}
              >
                <Text className="text-white text-base font-semibold text-center">
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>

            {__DEV__ && (
              <View className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <Text className="text-xs font-mono text-red-600 dark:text-red-400">
                  Debug Info:
                </Text>
                <Text className="text-xs font-mono text-red-600 dark:text-red-400 mt-1">
                  {this.state.error?.message}
                </Text>
                {this.state.error?.stack && (
                  <Text className="text-xs font-mono text-red-500 dark:text-red-300 mt-2">
                    {this.state.error.stack.split('\n').slice(0, 3).join('\n')}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
