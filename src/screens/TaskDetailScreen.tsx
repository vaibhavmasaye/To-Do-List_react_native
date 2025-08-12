import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES, SPACING } from '../constants/theme';
import { MediaPicker } from '../components/MediaPicker';
import { Video, ResizeMode } from 'expo-av';
import { TaskFormData } from '../types/task';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC = () => {
  const { params } = useRoute<TaskDetailScreenRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { tasks, addTask, updateTask, pickMedia, takePhoto, loadTasks } = useTasks();

const [formData, setFormData] = useState<TaskFormData>({
  title: '',
  description: '',
  mediaUri: undefined,
  mediaType: undefined,
  createdAt: Date.now(), // Initialize with current time
});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (params.taskId) {
      const task = tasks.find((t) => t.id === params.taskId);
      if (task) {
         setFormData({
        title: task.title,
        description: task.description || '',
        mediaUri: task.mediaUri,
        mediaType: task.mediaType || undefined,
        createdAt: task.createdAt,
      });
        setIsEditing(true);
      }
    }
  }, [params.taskId, tasks]);

  const handleMediaSelect = async (type: 'image' | 'video' | 'camera') => {
    try {
      let media;
      if (type === 'camera') {
        media = await takePhoto();
      } else {
        media = await pickMedia(type);
      }

      if (media) {
        setFormData((prev) => ({
          ...prev,
          mediaUri: media.uri,
          mediaType: media.type,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select media');
    }
  };

  const handleRemoveMedia = () => {
    setFormData((prev) => ({
      ...prev,
      mediaUri: undefined,
      mediaType: undefined,
    }));
  };

  const handleSubmit = async () => {
  if (!formData.title.trim()) {
    Alert.alert('Validation', 'Title is required');
    return;
  }

  try {
    const now = Date.now();
    if (isEditing && params.taskId) {
      await updateTask(params.taskId, {
        ...formData,
        updatedAt: now
      });
    } else {
      await addTask({
        ...formData,
        createdAt: now
      });
    }
    await loadTasks();
    navigation.goBack();
  } catch (error) {
    Alert.alert('Error', 'Failed to save task');
  }
};

  const headerHeight = 50;

  return (
    <View style={styles.container}>
      {/* Custom Gradient Header */}
     <LinearGradient
  colors={[COLORS.primary, COLORS.primaryLight]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={[styles.header, {
    height: headerHeight,
    paddingBottom: SPACING.small,
    paddingTop: SPACING.small,
  }]}
>
  <View style={styles.headerContent}>
    <TouchableOpacity
      style={styles.headerBack}
      onPress={() => navigation.goBack()}
    >
      <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
    </TouchableOpacity>
    
    {/* Added marginRight to create gap between arrow and text */}
    <View style={{ width: SPACING.small }} />
    
    <Text style={styles.headerTitle}>
      {isEditing ? 'Edit Task' : 'New Task'}
    </Text>
    
    {/* Empty view to balance the layout */}
    <View style={{ width: 24 }} />
  </View>
</LinearGradient>
      {/* Form */}
      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.contentContainer}
      >
        <TextInput
          style={styles.titleInput}
          placeholder="Title *"
          value={formData.title}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, title: text }))
          }
          placeholderTextColor={COLORS.textSecondary}
        />

        <TextInput
          style={styles.descriptionInput}
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, description: text }))
          }
          multiline
          numberOfLines={4}
          placeholderTextColor={COLORS.textSecondary}
        />

        {formData.mediaUri && (
          <Animatable.View
            animation="fadeIn"
            duration={500}
            style={styles.mediaContainer}
          >
            {formData.mediaType === 'image' ? (
              <Image
                source={{ uri: formData.mediaUri }}
                style={styles.media}
                resizeMode={ResizeMode.CONTAIN}
              />
            ) : (
              <Video
                source={{ uri: formData.mediaUri }}
                style={styles.media}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                isLooping
              />
            )}
            <TouchableOpacity
              style={styles.removeMediaButton}
              onPress={handleRemoveMedia}
            >
              <MaterialIcons name="close" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </Animatable.View>
        )}

        <MediaPicker onSelect={handleMediaSelect} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Update Task' : 'Add Task'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.medium,
    paddingBottom: SPACING.small,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SPACING.small, // Added horizontal padding
  },
   headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    flex: 1,
    marginLeft: SPACING.small, // Added left margin for more spacing
  },
  headerBack: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: { flex: 1 },
  contentContainer: { padding: SPACING.large },
  titleInput: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: SPACING.medium,
    ...SHADOWS.small,
  },
  descriptionInput: {
    fontSize: SIZES.medium,
    color: COLORS.text,
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: SPACING.medium,
    minHeight: 120,
    textAlignVertical: 'top',
    ...SHADOWS.small,
  },
  mediaContainer: {
    height: 200,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    marginBottom: SPACING.medium,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: { width: '100%', height: '100%' },
  removeMediaButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.danger,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.medium,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.large,
    ...SHADOWS.medium,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});
