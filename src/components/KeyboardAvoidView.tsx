import React, { ReactNode, useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// TODO : This is a quick and dirty keyboard avoid view, more development would be needed before production (or selection of a third party library, possibly: react-native-keyboard-controller )

interface KeyboardAvoidViewProps {
  children: ReactNode;
  className?: string;
}

export default function KeyboardAvoidView({
  children,
  className,
}: KeyboardAvoidViewProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  // For iOS
  const headerHeight = Platform.OS === 'ios' ? 44 + insets.top : 0;

  // For Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        e => {
          setKeyboardHeight(e.endCoordinates.height);
        },
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardHeight(0);
        },
      );

      return () => {
        keyboardDidShowListener?.remove();
        keyboardDidHideListener?.remove();
      };
    }
  }, []);

  if (Platform.OS === 'ios') {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        className={className}
        keyboardVerticalOffset={headerHeight}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  return (
    <View
      className={className}
      style={{
        marginBottom: keyboardHeight,
      }}
    >
      {children}
    </View>
  );
}
