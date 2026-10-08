import React from 'react';
import { StyleSheet, View, ViewProps, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

interface NeuralBackgroundProps extends ViewProps {
  children?: React.ReactNode;
  showOrb?: boolean;
}

export const NeuralBackground: React.FC<NeuralBackgroundProps> = ({
  children,
  showOrb = true,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {/* Base Deep Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={['#2C0D0F', '#1F0B09', '#140605']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Ambient Top Crimson Glow */}
        {showOrb && (
          <LinearGradient
            colors={['rgba(255, 45, 45, 0.16)', 'rgba(255, 84, 74, 0.05)', 'transparent']}
            locations={[0, 0.5, 1]}
            style={styles.topAmbientGlow}
          />
        )}

        {/* Ambient Bottom AI Glow */}
        <LinearGradient
          colors={['transparent', 'rgba(107, 211, 253, 0.04)', 'rgba(255, 45, 45, 0.08)']}
          locations={[0, 0.7, 1]}
          style={styles.bottomAmbientGlow}
        />
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topAmbientGlow: {
    position: 'absolute',
    top: -80,
    left: -40,
    right: -40,
    height: 380,
    borderRadius: 200,
  },
  bottomAmbientGlow: {
    position: 'absolute',
    bottom: -100,
    left: -50,
    right: -50,
    height: 350,
    borderRadius: 200,
  },
});
