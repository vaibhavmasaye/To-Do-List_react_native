import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { COLORS } from './src/constants/theme';
import { View } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ 
        height: StatusBar.currentHeight, 
        backgroundColor: COLORS.primary 
      }} />
      <StatusBar barStyle="light-content" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}