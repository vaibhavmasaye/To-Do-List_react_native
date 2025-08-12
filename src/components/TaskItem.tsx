import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING, SHADOWS } from '../constants/theme';
import { Task } from '../types/task';
import * as Animatable from 'react-native-animatable';

type TaskItemProps = {
  task: Task;
  onPress: () => void;
  onDelete: () => void;
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onPress, onDelete }) => {
  return (
    <Animatable.View 
      animation="fadeInUp"
      duration={500}
      style={styles.container}
    >
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
          {task.description && (
            <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
          )}
        </View>
        
        {task.mediaUri && (
          <View style={styles.mediaPreview}>
            {task.mediaType === 'image' ? (
              <Image 
                source={{ uri: task.mediaUri }} 
                style={styles.mediaImage} 
                resizeMode="cover"
              />
            ) : (
              <View style={styles.videoPlaceholder}>
                <MaterialIcons name="videocam" size={24} color={COLORS.white} />
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <MaterialIcons name="delete" size={24} color={COLORS.danger} />
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
    ...SHADOWS.medium,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.medium,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.small,
  },
  description: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  mediaPreview: {
    width: 60,
    height: 60,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: COLORS.border,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: SPACING.medium,
    padding: SPACING.small,
  },
});