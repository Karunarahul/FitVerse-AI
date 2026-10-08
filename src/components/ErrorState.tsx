import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from './PrimaryButton';
import { colors, typography, radii } from '../theme';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "We couldn't reach your AI coach.",
  message = 'A temporary connection fluctuation occurred. Neural protocols remain safely backed up.',
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle" size={40} color={colors.primaryAction} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <PrimaryButton
        title="TRY AGAIN"
        onPress={onRetry}
        style={styles.retryBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceL2,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 74, 0.3)',
    margin: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 84, 74, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryBtn: {
    minWidth: 180,
  },
});
