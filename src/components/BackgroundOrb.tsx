import React from 'react';
import { View, Image, StyleSheet, useColorScheme } from 'react-native';

const styles = StyleSheet.create({
  orb: {
    width: 1200,
    height: 1200,
    position: 'absolute',
    bottom: -450,
    right: -700,
  },
});

export default function BackgroundOrb() {
  const colorScheme = useColorScheme();

  return (
    <View className="absolute inset-0 bg-kraken-light dark:bg-kraken-dark">
      <Image
        source={require('../assets/background-orb.png')}
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.orb, { opacity: colorScheme === 'light' ? 0.05 : 0.2 }]}
        resizeMode="cover"
      />
    </View>
  );
}
