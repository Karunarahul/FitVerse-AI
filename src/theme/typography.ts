import { Platform, TextStyle } from 'react-native';

const headingFont = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

const bodyFont = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const techFont = Platform.select({
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

export const typography: Record<string, TextStyle> = {
  hero: {
    fontFamily: headingFont,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily: headingFont,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: headingFont,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  h3: {
    fontFamily: headingFont,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  bodyLarge: {
    fontFamily: bodyFont,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body: {
    fontFamily: bodyFont,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodyMedium: {
    fontFamily: bodyFont,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  caption: {
    fontFamily: bodyFont,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  techLarge: {
    fontFamily: techFont,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: 0.5,
  },
  tech: {
    fontFamily: techFont,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.8,
  },
  techSmall: {
    fontFamily: techFont,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    letterSpacing: 1.0,
  },
};
