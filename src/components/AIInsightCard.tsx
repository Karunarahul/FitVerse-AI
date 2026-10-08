import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { colors, typography, radii } from '../theme';

export interface AIInsightCardProps {
  headline: string;
  details: string;
  recommendation: string;
  confidence?: number;
  onPressAction?: () => void;
  actionLabel?: string;
  style?: ViewStyle | ViewStyle[];
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  headline,
  details,
  recommendation,
  confidence = 96,
  style,
}) => {
  return (
    <GlassCard level={3} glow="ai" bordered style={[styles.card, style]}>
      {/* Header Badge */}
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={13} color={colors.aiAccent} />
          <Text style={styles.badgeText}>NEURAL ADAPTATION INSIGHT</Text>
        </View>
        <View style={styles.confidenceTag}>
          <Text style={styles.confidenceText}>{confidence}% CONFIDENCE</Text>
        </View>
      </View>

      {/* Main Headline */}
      <Text style={styles.headline}>{headline}</Text>

      {/* Details */}
      <Text style={styles.details}>{details}</Text>

      {/* Recommendation Block */}
      <View style={styles.recContainer}>
        <View style={styles.recIndicator} />
        <Text style={styles.recText}>{recommendation}</Text>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: radii.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 211, 253, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(107, 211, 253, 0.3)',
  },
  badgeText: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 6,
    letterSpacing: 0.8,
  },
  confidenceTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  confidenceText: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
  },
  headline: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 6,
  },
  details: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  recContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(41, 23, 21, 0.6)',
    padding: 12,
    borderRadius: radii.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.aiAccent,
  },
  recIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.aiAccent,
    marginRight: 10,
  },
  recText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontSize: 13,
    flex: 1,
  },
});
