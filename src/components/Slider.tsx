import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

export interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onValueChange: (val: number) => void;
  style?: ViewStyle;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onValueChange,
  style,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleDecrement = () => {
    const next = Math.max(min, value - step);
    onValueChange(Number(next.toFixed(1)));
  };

  const handleIncrement = () => {
    const next = Math.min(max, value + step);
    onValueChange(Number(next.toFixed(1)));
  };

  return (
    <View style={[styles.container, style]}>
      {/* Label and Value Display */}
      <View style={styles.header}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.valDisplay}>
          <Text style={styles.valueText}>{value}</Text>
          {unit && <Text style={styles.unitText}>{unit}</Text>}
        </View>
      </View>

      {/* Interactive Bar & Steppers */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          onPress={handleDecrement}
          activeOpacity={0.7}
          style={styles.stepBtn}
        >
          <Ionicons name="remove" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Visual Progress Track */}
        <View style={styles.track}>
          <View style={[styles.progress, { width: `${percentage}%` }]} />
        </View>

        <TouchableOpacity
          onPress={handleIncrement}
          activeOpacity={0.7}
          style={styles.stepBtn}
        >
          <Ionicons name="add" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  label: {
    ...typography.techSmall,
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 0.8,
  },
  valDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    ...typography.techLarge,
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryAction,
  },
  unitText: {
    ...typography.techSmall,
    color: colors.textMuted,
    marginLeft: 4,
    fontSize: 11,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceL2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primaryAction,
  },
});
