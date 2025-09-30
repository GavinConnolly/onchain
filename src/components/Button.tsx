import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  View,
  PressableProps,
} from 'react-native';
import clsx from 'clsx';

export interface ButtonProps
  extends Omit<PressableProps, 'disabled' | 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'small';
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: PressableProps['style'];
}

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  className,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonClasses = clsx(
    'items-center relative',
    {
      'px-8 py-4 rounded-2xl': variant !== 'small',
      'px-4 py-2.5 rounded-3xl': variant === 'small',
      'bg-kraken-purple': variant === 'primary' && !disabled,
      'bg-transparent border-2 border-kraken-purple':
        variant === 'secondary' && !disabled,
      'bg-red-500': variant === 'danger' && !disabled,
      'bg-green-500': variant === 'small' && !disabled,
      'bg-gray-300 dark:bg-gray-600': disabled,
    },
    className,
  );

  const textClasses = clsx('text-base font-semibold', {
    'text-white':
      (variant === 'primary' || variant === 'danger' || variant === 'small') &&
      !disabled,
    'text-kraken-purple': variant === 'secondary' && !disabled,
    'text-gray-500 dark:text-gray-400': disabled,
  });

  const activityIndicatorColor =
    variant === 'primary' ||
    variant === 'danger' ||
    variant === 'small' ||
    disabled
      ? 'white'
      : '#7434f3'; // kraken-purple

  return (
    <Pressable
      className={buttonClasses}
      onPress={onPress}
      disabled={isDisabled}
      /* eslint-disable react-native/no-inline-styles */
      style={[
        {
          opacity: loading ? 0.6 : 1,
        },
        typeof style === 'function' ? undefined : style,
      ]}
      /* eslint-enable react-native/no-inline-styles */
      {...props}
    >
      <Text
        className={textClasses}
        /* eslint-disable react-native/no-inline-styles */
        style={{
          opacity: loading ? 0 : 1,
        }}
        /* eslint-enable react-native/no-inline-styles */
      >
        {title}
      </Text>
      {loading && (
        <View className="absolute inset-0 justify-center items-center">
          <ActivityIndicator size="small" color={activityIndicatorColor} />
        </View>
      )}
    </Pressable>
  );
}
