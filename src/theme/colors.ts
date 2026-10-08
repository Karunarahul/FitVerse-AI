export const colors = {
  // Primary Canvas & Backgrounds
  background: '#200F0D',
  backgroundDark: '#160807',
  backgroundElevated: '#251210',

  // Glass Morphism Surfaces
  surfaceL1: 'rgba(41, 23, 21, 0.55)',      // 40-50% subtle blur
  surfaceL2: 'rgba(46, 27, 24, 0.72)',      // 60-70% medium blur
  surfaceL3: 'rgba(57, 37, 34, 0.88)',      // 80-90% strong blur
  surfaceL4: '#452F2D',
  surfaceSolid: '#291715',
  surfaceCard: '#2E1B18',

  // Primary Crimson Brand & Accents
  primaryAccent: '#FFB4AB',
  primaryAction: '#FF544A',
  primaryDark: '#2C0D0F',
  primaryCrimson: '#FF2D2D',
  primaryGlow: 'rgba(255, 84, 74, 0.35)',
  
  // Gradients
  primaryGradient: ['#FF2D2D', '#FF3C38'] as const,
  actionGradient: ['#FF544A', '#E03E35'] as const,
  darkGradient: ['#2C0D0F', '#1B0F13', '#200F0D'] as const,
  heroGradient: ['rgba(255, 45, 45, 0.18)', 'transparent'] as const,
  surfaceGradient: ['rgba(57, 37, 34, 0.6)', 'rgba(41, 23, 21, 0.85)'] as const,

  // AI & Futuristic Secondary Accent
  aiAccent: '#6BD3FD',
  aiGradient: ['#6BD3FD', '#3B82F6'] as const,
  aiGlow: 'rgba(107, 211, 253, 0.35)',
  aiSurface: 'rgba(107, 211, 253, 0.12)',

  // Typography
  textPrimary: '#FEDBD6',
  textSecondary: '#E8BCB7',
  textMuted: '#AE8783',
  textDark: '#200F0D',
  textWhite: '#FFFFFF',

  // Borders & Outlines
  outline: '#AE8783',
  borderSubtle: 'rgba(174, 135, 131, 0.25)',
  borderActive: 'rgba(255, 84, 74, 0.65)',
  borderAI: 'rgba(107, 211, 253, 0.5)',

  // Status & Telemetry
  success: '#2ED573',
  successGlow: 'rgba(46, 213, 115, 0.3)',
  warning: '#FFA502',
  warningGlow: 'rgba(255, 165, 2, 0.3)',
  error: '#FF4757',
  errorGlow: 'rgba(255, 71, 87, 0.3)',
  info: '#6BD3FD',

  // Overlay
  overlay: 'rgba(10, 4, 4, 0.8)',
  glassGlow: 'rgba(255, 180, 171, 0.08)',
};
