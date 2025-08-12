import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../constants/theme';

export const EmptyState: React.FC = () => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="check-circle-outline" size={48} color={COLORS.textSecondary} />
      <Text style={styles.title}>No Tasks Yet</Text>
      <Text style={styles.subtitle}>Tap the + button to add your first task</Text>
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
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: SPACING.medium,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.small,
    textAlign: 'center',
  },
});