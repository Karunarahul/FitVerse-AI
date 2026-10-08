import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, shadows, typography } from '../theme';

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'crimson' | 'ai';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'crimson',
  icon,
  iconPosition = 'right',
  style,
  textStyle,
}) => {
  const gradientColors =
    variant === 'ai' ? colors.aiGradient : colors.primaryGradient;

  const glowShadow =
    variant === 'ai' ? shadows.glowAI : shadows.glowCrimson;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[styles.wrapper, glowShadow, style]}
    >
      <LinearGradient
        colors={disabled ? ['#422927', '#331B19'] : gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={colors.textWhite} size="small" />
        ) : (
          <View style={styles.contentRow}>
            {icon && iconPosition === 'left' && <View style={styles.leftIcon}>{icon}</View>}
            <Text
              style={[
                styles.title,
                disabled && styles.disabledTitle,
                textStyle,
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && <View style={styles.rightIcon}>{icon}</View>}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.tech,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  disabledTitle: {
    color: colors.textMuted,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
