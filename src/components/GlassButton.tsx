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
import { colors, radii, typography } from '../theme';

export interface GlassButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  variant?: 'crimson' | 'ai' | 'neutral';
  icon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  size = 'small',
  variant = 'neutral',
  icon,
  style,
  textStyle,
}) => {
  const getBorderColor = () => {
    if (variant === 'crimson') return colors.borderActive;
    if (variant === 'ai') return colors.borderAI;
    return colors.borderSubtle;
  };

  const getTextColor = () => {
    if (variant === 'crimson') return colors.primaryAction;
    if (variant === 'ai') return colors.aiAccent;
    return colors.textPrimary;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.button,
        size === 'small' ? styles.small : styles.medium,
        { borderColor: getBorderColor() },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.row}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              size === 'small' ? styles.smallText : styles.mediumText,
              { color: getTextColor() },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  smallText: {
    ...typography.techSmall,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  mediumText: {
    ...typography.tech,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
});
