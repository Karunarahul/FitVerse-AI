import { Platform, ViewStyle } from 'react-native';
import { colors } from './colors';

export const shadows: Record<string, ViewStyle> = {
  glass: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
    },
    android: {
      elevation: 6,
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
    },
  }) as ViewStyle,

  glowCrimson: Platform.select({
    ios: {
      shadowColor: colors.primaryAction,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 18,
    },
    android: {
      elevation: 8,
    },
    default: {
      shadowColor: colors.primaryAction,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 18,
    },
  }) as ViewStyle,

  glowAI: Platform.select({
    ios: {
      shadowColor: colors.aiAccent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 18,
    },
    android: {
      elevation: 8,
    },
    default: {
      shadowColor: colors.aiAccent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 18,
    },
  }) as ViewStyle,
};
