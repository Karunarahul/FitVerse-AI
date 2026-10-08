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

export interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  borderGlow?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  borderGlow = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        borderGlow && styles.buttonGlow,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} size="small" />
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surfaceL2,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGlow: {
    borderColor: colors.borderActive,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.tech,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.8,
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
