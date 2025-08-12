import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../constants/theme';

export const EmptyState: React.FC = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name="clipboard-text-outline" 
        size={64} 
        color={COLORS.primaryLight} 
      />
      <Text style={styles.title}>No Tasks Yet</Text>
      <Text style={styles.subtitle}>Get started by adding your first task</Text>
      <View style={styles.waveDecoration} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xLarge,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.medium,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.small,
    textAlign: 'center',
    maxWidth: '70%',
  },
  waveDecoration: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
});