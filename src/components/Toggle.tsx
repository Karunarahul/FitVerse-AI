import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

export interface ToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[
        styles.track,
        value ? styles.trackActive : styles.trackInactive,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View
        style={[
          styles.thumb,
          value ? styles.thumbActive : styles.thumbInactive,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  trackActive: {
    backgroundColor: colors.primaryAction,
  },
  trackInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  thumbActive: {
    alignSelf: 'flex-end',
  },
  thumbInactive: {
    alignSelf: 'flex-start',
  },
  disabled: {
    opacity: 0.5,
  },
});
