import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../constants/theme';

type MediaPickerProps = {
  onSelect: (type: 'image' | 'video' | 'camera') => void;
};

export const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect }) => {
  const handleSelect = (type: 'image' | 'video' | 'camera') => {
    onSelect(type);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleSelect('image')}
      >
        <MaterialIcons name="image" size={24} color={COLORS.primary} />
        <Text style={styles.buttonText}>Image</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleSelect('video')}
      >
        <MaterialIcons name="video-library" size={24} color={COLORS.primary} />
        <Text style={styles.buttonText}>Video</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleSelect('camera')}
      >
        <FontAwesome name="camera" size={24} color={COLORS.primary} />
        <Text style={styles.buttonText}>Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    alignItems: 'center',
    padding: SPACING.small,
  },
  buttonText: {
    marginTop: SPACING.small,
    color: COLORS.primary,
    fontSize: SIZES.small,
  },
});