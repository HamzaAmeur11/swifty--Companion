import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#18181b',
          borderTopColor: '#27272a',
          paddingVertical: 8,
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#71717a',
        tabBarLabelStyle: {
          marginTop: 4,
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
          tabBarLabel: 'Search',
        }}
      />
      <Tabs.Screen
        name="profile/[login]"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          href: null,
        }}
      />
    </Tabs>
  );
}
