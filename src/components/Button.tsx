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
  variant?: 'primary' | 'secondary' | 'danger' | 'round' | 'small';
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: PressableProps['style'];
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'only';
}

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  className,
  style,
  icon,
  iconPosition = 'left',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonClasses = clsx(
    'items-center justify-center relative',
    {
      'flex-row': iconPosition === 'left' || iconPosition === 'right',
      'bg-kraken-purple':
        (variant === 'primary' || variant === 'small') && !disabled,
      'bg-transparent border-2 border-kraken-purple':
        variant === 'secondary' && !disabled,
      'bg-red-500': variant === 'danger' && !disabled,
      'bg-green-500': variant === 'round' && !disabled,
      'bg-gray-300 dark:bg-gray-600': disabled,
      'px-8 py-4 rounded-2xl':
        variant !== 'round' && variant !== 'small' && variant !== 'secondary' && iconPosition !== 'only',
      'px-4 py-2.5 rounded-3xl': variant === 'round' && iconPosition !== 'only',
      'px-8 py-2.5 rounded-2xl': (variant === 'small' || variant === 'secondary') && iconPosition !== 'only',
      'px-4 py-4 rounded-2xl': iconPosition === 'only' && variant !== 'small' && variant !== 'secondary',
      'px-4 py-2.5 rounded-2xl': iconPosition === 'only' && (variant === 'small' || variant === 'secondary'),
    },
    className,
  );

  const textClasses = clsx('text-base font-semibold text-center', {
    'text-white':
      (variant === 'primary' ||
        variant === 'danger' ||
        variant === 'round' ||
        variant === 'small') &&
      !disabled,
    'text-kraken-purple': variant === 'secondary' && !disabled,
    'text-gray-500 dark:text-gray-400': disabled,
  });

  const activityIndicatorColor =
    variant === 'primary' ||
    variant === 'danger' ||
    variant === 'round' ||
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
      {iconPosition === 'left' && icon && (
        <View
          /* eslint-disable react-native/no-inline-styles */
          style={{ opacity: loading ? 0 : 1, marginRight: 8 }}
          /* eslint-enable react-native/no-inline-styles */
        >
          {icon}
        </View>
      )}

      {iconPosition !== 'only' && (
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
      )}

      {iconPosition === 'right' && icon && (
        <View
          /* eslint-disable react-native/no-inline-styles */
          style={{ opacity: loading ? 0 : 1, marginLeft: 8 }}
          /* eslint-enable react-native/no-inline-styles */
        >
          {icon}
        </View>
      )}

      {iconPosition === 'only' && icon && (
        <View
          /* eslint-disable react-native/no-inline-styles */
          style={{ opacity: loading ? 0 : 1 }}
          /* eslint-enable react-native/no-inline-styles */
        >
          {icon}
        </View>
      )}

      {loading && (
        <View className="absolute inset-0 justify-center items-center">
          <ActivityIndicator size="small" color={activityIndicatorColor} />
        </View>
      )}
    </Pressable>
  );
}
