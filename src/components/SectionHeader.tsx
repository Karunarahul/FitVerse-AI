import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, typography } from '../theme';

export interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {actionText && onAction && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
    marginTop: 8,
  },
  title: {
    ...typography.tech,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  actionText: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
