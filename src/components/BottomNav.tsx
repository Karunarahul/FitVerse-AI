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

          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
              style={styles.tabButton}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                <Ionicons
                  name={isActive ? item.activeIconName : item.iconName}
                  size={22}
                  color={isActive ? colors.primaryAction : colors.textMuted}
                />
              </View>
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {item.label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
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
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'rgba(22, 8, 7, 0.92)',
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
  activeDot: {
    position: 'absolute',
    bottom: 1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primaryAction,
  },
});
