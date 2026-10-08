import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { colors, typography } from '../theme';

export interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 100
  color?: string;
  gradientColors?: [string, string];
  trackColor?: string;
  label?: string;
  sublabel?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  size = 130,
  strokeWidth = 10,
  progress = 0,
  color = colors.primaryAction,
  gradientColors = [colors.primaryAction, colors.primaryCrimson],
  trackColor = 'rgba(255, 255, 255, 0.08)',
  label,
  sublabel,
  children,
  style,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (circumference * clampedProgress) / 100;
  const gradientId = `ringGrad_${Math.round(size)}_${Math.round(progress)}`;

  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </SvgGradient>
        </Defs>

        {/* Track Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      {/* Central Content */}
      <View style={styles.centerContainer}>
        {children ? (
          children
        ) : (
          <>
            {label ? (
              <Text style={styles.labelText}>{label}</Text>
            ) : (
              <Text style={styles.labelText}>{Math.round(clampedProgress)}%</Text>
            )}
            {sublabel && <Text style={styles.sublabelText}>{sublabel}</Text>}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    ...typography.techLarge,
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sublabelText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});
