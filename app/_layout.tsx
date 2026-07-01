import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TuningsProvider } from '../src/tunings/useTunings';

export default function RootLayout() {
  return (
    <TuningsProvider>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#111',
            borderTopColor: '#222',
          },
          tabBarActiveTintColor: '#4caf50',
          tabBarInactiveTintColor: '#666',
          headerStyle: {
            backgroundColor: '#111',
          },
          headerTintColor: '#fff',
          headerShadowVisible: false,
          sceneStyle: {
            backgroundColor: '#111',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Tuner', tabBarLabel: 'Tuner' }}
        />
        <Tabs.Screen
          name="tunings"
          options={{ title: 'Tunings', tabBarLabel: 'Tunings' }}
        />
        <Tabs.Screen
          name="custom-tuning"
          options={{ title: 'Custom Tuning', tabBarLabel: 'Custom' }}
        />
      </Tabs>
    </TuningsProvider>
  );
}
