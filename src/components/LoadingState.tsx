import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AIOrb } from './AIOrb';
import { colors, typography } from '../theme';

export interface LoadingStateProps {
  message?: string;
  submessage?: string;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Synthesizing Neural Protocols...',
  submessage = 'Calibrating to your biometrics and metabolic telemetry',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <AIOrb size={100} glowColor="ai" />
      <Text style={styles.message}>{message}</Text>
      {submessage && <Text style={styles.submessage}>{submessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: 24,
    textAlign: 'center',
    fontWeight: '700',
  },
  submessage: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});
