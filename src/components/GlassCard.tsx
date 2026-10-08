import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { colors, radii, shadows } from '../theme';

export interface GlassCardProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
  glow?: 'crimson' | 'ai' | 'none';
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  activeOpacity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  level = 2,
  glow = 'none',
  bordered = true,
  style,
  onPress,
  activeOpacity = 0.82,
}) => {
  const getBackgroundColor = () => {
    switch (level) {
      case 1:
        return colors.surfaceL1;
      case 3:
        return colors.surfaceL3;
      case 2:
      default:
        return colors.surfaceL2;
    }
  };

  const getBorderColor = () => {
    if (!bordered) return 'transparent';
    if (glow === 'crimson') return colors.borderActive;
    if (glow === 'ai') return colors.borderAI;
    return colors.borderSubtle;
  };

  const glowShadow = glow === 'crimson' ? shadows.glowCrimson : glow === 'ai' ? shadows.glowAI : shadows.glass;

  const cardStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: bordered ? 1 : 0,
    borderRadius: radii.card,
    ...glowShadow,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        style={[styles.base, cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.base, cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    padding: 18,
    overflow: 'hidden',
  },
});
