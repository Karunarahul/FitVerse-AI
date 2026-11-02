import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, typography, shadows } from '../theme';

interface NavItem {
  key: string;
  label: string;
  route: string;
  iconName: keyof typeof Ionicons.glyphMap;
  activeIconName: keyof typeof Ionicons.glyphMap;
  isAiHighlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'home',
    label: 'HOME',
    route: '/(app)/home',
    iconName: 'flash-outline',
    activeIconName: 'flash',
  },
  {
    key: 'plans',
    label: 'PLANS',
    route: '/(app)/plans',
    iconName: 'barbell-outline',
    activeIconName: 'barbell',
  },
  {
    key: 'coach',
    label: 'COACH',
    route: '/(app)/coach',
    iconName: 'sparkles-outline',
    activeIconName: 'sparkles',
    isAiHighlight: true,
  },
  {
    key: 'stats',
    label: 'STATS',
    route: '/(app)/stats',
    iconName: 'stats-chart-outline',
    activeIconName: 'stats-chart',
  },
  {
    key: 'profile',
    label: 'PROFILE',
    route: '/(app)/profile',
    iconName: 'person-outline',
    activeIconName: 'person',
  },
];

export const BottomNav: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (item: NavItem) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    router.push(item.route as any);
  };

  const bottomPadding = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <View style={styles.navBar}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.includes(item.key);
          const iconColor = isActive
            ? (item.isAiHighlight ? colors.aiAccent : colors.primaryAction)
            : colors.textMuted;

          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
              style={styles.tabButton}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isActive && styles.activeIconWrapper,
                  item.isAiHighlight && styles.aiIconWrapper,
                  item.isAiHighlight && isActive && styles.aiActiveIconWrapper,
                ]}
              >
                <Ionicons
                  name={isActive ? item.activeIconName : item.iconName}
                  size={item.isAiHighlight ? 20 : 22}
                  color={iconColor}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && (item.isAiHighlight ? styles.activeAiTabLabel : styles.activeTabLabel),
                ]}
              >
                {item.label}
              </Text>
              {isActive && (
                <View
                  style={[
                    styles.activeDot,
                    item.isAiHighlight && styles.activeAiDot,
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: 'rgba(22, 8, 7, 0.94)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(174, 135, 131, 0.18)',
    ...shadows.glass,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 52,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 52,
  },
  iconWrapper: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIconWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(107, 211, 253, 0.3)',
    borderRadius: 14,
    backgroundColor: 'rgba(107, 211, 253, 0.08)',
  },
  aiActiveIconWrapper: {
    borderColor: colors.aiAccent,
    backgroundColor: 'rgba(107, 211, 253, 0.22)',
  },
  activeIconWrapper: {
    transform: [{ scale: 1.08 }],
  },
  tabLabel: {
    ...typography.techSmall,
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  activeTabLabel: {
    color: colors.primaryAction,
    fontWeight: '800',
  },
  activeAiTabLabel: {
    color: colors.aiAccent,
    fontWeight: '800',
  },
  activeDot: {
    position: 'absolute',
    bottom: 1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primaryAction,
  },
  activeAiDot: {
    backgroundColor: colors.aiAccent,
  },
});
