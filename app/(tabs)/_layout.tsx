import TabIcon from '@/components/TabIcon';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getToken } from '@/utils/authStorage';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (!isLoggedIn) {
    return <Redirect href="/welcome" />;
  }
  type TabItem = {
    name: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  };

  const tabs: TabItem[] = [
    {
      name: 'index',
      label: 'Home',
      icon: 'home-outline',
    },
    {
      name: 'weekly',
      label: 'Weekly',
      icon: 'calendar-outline',
    },
    {
      name: 'plans',
      label: 'Plans',
      icon: 'card-outline',
    },
    {
      name: 'manage',
      label: 'Manage',
      icon: 'settings-outline',
    },
    {
      name: 'profile',
      label: 'Profile',
      icon: 'person-outline',
    },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        // tabBarStyle: {
        //   height: 80,
        // },

        // 🔥 THIS IS THE KEY
        tabBarItemStyle: {
          width: 'auto',
          // paddingHorizontal: 6,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                label={tab.label}
                icon={
                  <Ionicons
                    name={tab.icon as any}
                    size={22}
                    color={focused ? '#000' : '#777'}
                  />
                }
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
