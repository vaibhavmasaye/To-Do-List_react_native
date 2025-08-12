import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING, SHADOWS } from '../constants/theme';
import { Task } from '../types/task';
import * as Animatable from 'react-native-animatable';
import { format } from 'date-fns';

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
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>
                {format(new Date(task.updatedAt || task.createdAt), 'MMM d')}
              </Text>
            </View>
          </View>
          
          {task.description && (
            <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
          )}
          
          {task.updatedAt && task.updatedAt !== task.createdAt && (
            <View style={styles.updatedTag}>
              <MaterialIcons name="update" size={14} color={COLORS.white} />
              <Text style={styles.updatedText}>
                Updated {format(new Date(task.updatedAt), 'MMM d, h:mm a')}
              </Text>
            </View>
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
                <MaterialIcons name="videocam" size={20} color={COLORS.white} />
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onDelete} 
        style={styles.deleteButton}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <MaterialIcons name="delete-outline" size={22} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
    ...SHADOWS.small,
    borderLeftWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.medium,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.small,
  },
  description: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.small,
  },
  dateBadge: {
    backgroundColor: COLORS.lightPrimary,
    paddingHorizontal: SPACING.small,
    paddingVertical: 2,
    borderRadius: 12,
  },
  dateText: {
    fontSize: SIZES.small - 2,
    color: COLORS.primary,
    fontWeight: '500',
  },
  updatedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.small,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: SPACING.small / 2,
  },
  updatedText: {
    fontSize: SIZES.small - 2,
    color: COLORS.white,
    marginLeft: 4,
  },
  mediaPreview: {
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
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
    marginLeft: SPACING.small,
    padding: 4,
  },
});