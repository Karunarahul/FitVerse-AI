import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography } from '../theme';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  stepIndicator?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  stepIndicator,
  showBack = false,
  onBack,
  rightAction,
  style,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Top action row */}
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        {stepIndicator && (
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>{stepIndicator}</Text>
          </View>
        )}

        {rightAction ? (
          <View style={styles.rightAction}>{rightAction}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Main title & subtitle */}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    minHeight: 36,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadge: {
    backgroundColor: 'rgba(255, 84, 74, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 74, 0.3)',
  },
  stepText: {
    ...typography.techSmall,
    color: colors.primaryAction,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  rightAction: {
    minWidth: 36,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 36,
  },
  title: {
    ...typography.hero,
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
});
