import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop, Line } from 'react-native-svg';
import { NeuralBackground } from '../../components/NeuralBackground';
import { GlassCard } from '../../components/GlassCard';
import { MetricCard } from '../../components/MetricCard';
import { AIInsightCard } from '../../components/AIInsightCard';
import { ProgressRing } from '../../components/ProgressRing';
import { colors, typography, radii, spacing } from '../../theme';
import { useAnalyticsStore } from '../../stores/analyticsStore';

const FILTERS = ['1M', '3M', 'YTD'] as const;

export default function StatsScreen() {
  const { width } = useWindowDimensions();
  const { stats, timeFilter, setTimeFilter } = useAnalyticsStore();

  const chartWidth = Math.max(260, width - spacing.horizontal * 2 - 36);
  const chartHeight = 150;

  // Render SVG smooth line chart for weight trend
  const renderWeightChart = () => {
    const data = stats.weightTrend;
    if (!data || data.length < 2) return null;

    const weights = data.map((d) => d.weightKg);
    const minW = Math.min(...weights) - 0.5;
    const maxW = Math.max(...weights) + 0.5;
    const range = maxW - minW || 1;

    const points = data.map((item, i) => {
      const x = (i / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((item.weightKg - minW) / range) * (chartHeight - 30) - 15;
      return { x, y, ...item };
    });

    // Create SVG Path
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

    return (
      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <SvgGradient id="weightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={colors.primaryAction} stopOpacity="0.35" />
              <Stop offset="100%" stopColor={colors.primaryAction} stopOpacity="0.0" />
            </SvgGradient>
          </Defs>

          {/* Horizontal Grid lines */}
          <Line x1="0" y1="30" x2={chartWidth} y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <Line x1="0" y1="75" x2={chartWidth} y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <Line x1="0" y1="120" x2={chartWidth} y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

          {/* Area fill */}
          <Path d={areaD} fill="url(#weightGrad)" />

          {/* Trend Line */}
          <Path d={pathD} fill="none" stroke={colors.primaryAction} strokeWidth="3" strokeLinecap="round" />

          {/* Points */}
          {points.map((p, i) => (
            <Circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill={colors.background}
              stroke={colors.primaryAction}
              strokeWidth="2.5"
            />
          ))}
        </Svg>

        {/* X-Axis labels */}
        <View style={styles.xAxisRow}>
          {data.map((item, i) => (
            <Text key={i} style={styles.xLabel}>
              {item.date}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <NeuralBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Stats & Telemetry</Text>
          <Text style={styles.subtitle}>
            Longitudinal biometric analysis and central nervous system adaptation.
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top 3 High Level KPI Cards */}
          <View style={styles.kpiRow}>
            <MetricCard
              label="CONSISTENCY"
              value={stats.consistencyScore}
              unit={`+${stats.consistencyChange}`}
              subtitle="Optimal Zone"
              accentColor={colors.primaryAction}
              style={styles.kpiCard}
            />

            <MetricCard
              label="WORKOUTS"
              value={`${stats.totalWorkoutsCompleted}/${stats.totalWorkoutsTarget}`}
              unit=""
              subtitle="Cycle Target"
              accentColor={colors.aiAccent}
              style={styles.kpiCard}
            />

            <MetricCard
              label="AVG BURN"
              value={stats.averageBurnKcal}
              unit="kcal"
              subtitle="Per Session"
              accentColor={colors.warning}
              style={styles.kpiCard}
            />
          </View>

          {/* AI Insight Card */}
          <AIInsightCard
            headline={stats.aiInsight.headline}
            details={stats.aiInsight.details}
            recommendation={stats.aiInsight.recommendation}
            confidence={stats.aiInsight.confidence}
            style={styles.insightCard}
          />

          {/* Weight Trend Chart Card */}
          <GlassCard level={2} style={styles.trendCard}>
            <View style={styles.trendHeader}>
              <View>
                <Text style={styles.trendTag}>BODY COMPOSITION TRAJECTORY</Text>
                <Text style={styles.currentWeightText}>
                  {stats.weightTrend[stats.weightTrend.length - 1]?.weightKg || 74.5} kg
                </Text>
              </View>

              {/* Filters */}
              <View style={styles.filterGroup}>
                {FILTERS.map((f) => {
                  const isActive = timeFilter === f;
                  return (
                    <TouchableOpacity
                      key={f}
                      onPress={() => setTimeFilter(f)}
                      activeOpacity={0.8}
                      style={[styles.filterBtn, isActive && styles.filterBtnActive]}
                    >
                      <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                        {f}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {renderWeightChart()}
          </GlassCard>

          {/* Weekly Output Ring Card */}
          <GlassCard level={2} style={styles.outputCard}>
            <View style={styles.outputLeft}>
              <Text style={styles.outputTag}>WEEKLY NEURAL LOAD</Text>
              <Text style={styles.outputTitle}>Volume Output</Text>
              <Text style={styles.outputDesc}>
                You have fulfilled {stats.weeklyOutputPercent}% of programmed neurological volume this microcycle.
              </Text>
            </View>

            <ProgressRing
              size={90}
              strokeWidth={8}
              progress={stats.weeklyOutputPercent}
              color={colors.aiAccent}
              gradientColors={[colors.aiAccent, '#2563EB']}
            />
          </GlassCard>

          <View style={{ height: 90 }} />
        </ScrollView>
      </SafeAreaView>
    </NeuralBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.horizontal,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    ...typography.hero,
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  scrollContent: {
    paddingHorizontal: spacing.horizontal,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    padding: 12,
  },
  insightCard: {
    marginBottom: 20,
  },
  trendCard: {
    padding: 18,
    marginBottom: 20,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  trendTag: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.0,
    marginBottom: 2,
  },
  currentWeightText: {
    ...typography.techLarge,
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  filterGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(32, 15, 13, 0.6)',
    borderRadius: radii.pill,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  filterBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  filterBtnActive: {
    backgroundColor: colors.primaryAction,
  },
  filterText: {
    ...typography.techSmall,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFF',
  },
  chartWrapper: {
    alignItems: 'center',
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  xLabel: {
    ...typography.techSmall,
    fontSize: 10,
    color: colors.textMuted,
  },
  outputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    marginBottom: 16,
  },
  outputLeft: {
    flex: 1,
    paddingRight: 16,
  },
  outputTag: {
    ...typography.techSmall,
    color: colors.aiAccent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.0,
    marginBottom: 2,
  },
  outputTitle: {
    ...typography.h3,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  outputDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
});
