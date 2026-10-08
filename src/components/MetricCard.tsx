import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors, typography, radii } from '../theme';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  progressPercent?: number; // 0 to 100
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subtitle,
  icon,
  accentColor = colors.primaryAction,
  progressPercent,
  style,
  onPress,
}) => {
  return (
    <GlassCard level={2} style={[styles.card, style]} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={[styles.unit, { color: accentColor }]}>{unit}</Text>}
      </View>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {typeof progressPercent === 'number' && (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                backgroundColor: accentColor,
              },
            ]}
          />
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: radii.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    ...typography.techSmall,
    color: colors.textMuted,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  iconContainer: {
    opacity: 0.85,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  value: {
    ...typography.techLarge,
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  unit: {
    ...typography.techSmall,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    letterSpacing: 0.6,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});
