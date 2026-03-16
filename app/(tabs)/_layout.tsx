import TabIcon from '@/components/TabIcon';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getToken } from '@/utils/authStorage';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      name: "index",
      label: "Home",
      icon: "home-outline",
    },
    // {
    //   name: "Orders",
    //   label: "Orders",
    //   icon: "menu",
    // },
    {
      name: "Subscription",
      label: "Subscription",
      icon: "fast-food-outline",
    },
    {
      name: "Profile",
      label: "Profile",
      icon: "person-outline",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={['top', 'left', 'right', 'bottom']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarInactiveTintColor: "#ffffff40",
          tabBarActiveTintColor: "#ffffff",
          tabBarStyle: {
            backgroundColor: "white",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "transparent",
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
                      size={25}
                    // color={focused ? "#000" : "#777"}
                    />
                  }
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </SafeAreaView>
  );
}
