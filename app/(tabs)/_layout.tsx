import { colors } from '@/constants/theme';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { getToken } from '@/utils/authStorage';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { isLoading: profileLoading } = useProfileCompletion();

  useEffect(() => {
    getToken().then((token) => setIsLoggedIn(!!token));
  }, []);

  if (isLoggedIn === null || profileLoading) return null;

  if (!isLoggedIn) {
    return <Redirect href="/welcome" />;
  }

  type TabItem = {
    name: string;
    label: string;
    icon: {
      active: string;
      inactive: string;
    };
  };

  const tabs: TabItem[] = [
    {
      name: "index",
      label: "Home",
      icon: {
        active: "home",
        inactive: "home-outline",
      },
    },
    {
      name: "Subscription",
      label: "Subscription",
      icon: {
        active: "fast-food",
        inactive: "fast-food-outline",
      },
    },
    {
      name: "Profile",
      label: "Profile",
      icon: {
        active: "person",
        inactive: "person-outline",
      },
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={['top', 'left', 'right']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarInactiveTintColor: "#6b7280",
          tabBarActiveTintColor: colors.primary,
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }} />
          ),
          tabBarStyle: { paddingTop: 8 },
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.label,
              tabBarLabel: tab.label,
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? tab.icon.active : tab.icon.inactive}
                  size={24}
                  color={color}
                />
              )
            }}
          />
        ))}
      </Tabs>
    </SafeAreaView>
  );
}
