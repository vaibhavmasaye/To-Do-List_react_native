import { useState, useEffect, useCallback } from 'react';
import { saveTasks, loadTasks, deleteMediaFile } from '../services/storage';
import * as ImagePicker from 'expo-image-picker';
import { Task, TaskFormData, MediaType } from '../types/task';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const loadedTasks = await loadTasks();
        setTasks(loadedTasks);
      } catch (error) {
        Alert.alert('Error', 'Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const saveTasksToStorage = useCallback(async (updatedTasks: Task[]) => {
    try {
      await saveTasks(updatedTasks);
    } catch (error) {
      Alert.alert('Error', 'Failed to save tasks');
      throw error;
    }
  }, []);

  const pickMedia = useCallback(async (type: 'image' | 'video') => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'We need access to your media library to attach files');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'image'
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return null;

    const file = result.assets[0];

    // Check file size
    if (file.fileSize && file.fileSize > MAX_FILE_SIZE) {
      Alert.alert('File too large', `Please select a file smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return null;
    }

    // For iOS, copy the file to a permanent location
    if (file.uri) {
      const newPath = `${FileSystem.documentDirectory}${Date.now()}_${file.fileName || 'media'}`;
      await FileSystem.copyAsync({
        from: file.uri,
        to: newPath,
      });
      return {
        uri: newPath,
        type: type,
      };
    }

    return null;
  }, []);

  const takePhoto = useCallback(async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'We need access to your camera to take photos');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return null;

    const file = result.assets[0];

    // For iOS, copy the file to a permanent location
    if (file.uri) {
      const newPath = `${FileSystem.documentDirectory}${Date.now()}_${file.fileName || 'photo.jpg'}`;
      await FileSystem.copyAsync({
        from: file.uri,
        to: newPath,
      });
      return {
        uri: newPath,
        type: 'image' as const,
      };
    }

    return null;
  }, []);

  // Update the addTask function in useTasks.ts
  const addTask = useCallback(async (formData: TaskFormData) => {
    const newTask: Task = {
      ...formData,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    try {
      await saveTasksToStorage(updatedTasks);
      return newTask;
    } catch (error) {
      Alert.alert('Error', 'Failed to save task');
      throw error;
    }
  }, [tasks, saveTasksToStorage]);

  const updateTask = useCallback(async (id: string, formData: TaskFormData) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return;

    const oldMediaUri = tasks[taskIndex].mediaUri;
    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...formData,
      updatedAt: Date.now(),
    };

    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;
    setTasks(updatedTasks);

    // Delete old media if it was replaced
    if (oldMediaUri && oldMediaUri !== formData.mediaUri) {
      await deleteMediaFile(oldMediaUri);
    }

    await saveTasksToStorage(updatedTasks);
    return updatedTask;
  }, [tasks, saveTasksToStorage]);

  const deleteTask = useCallback(async (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) return;

    // Delete associated media file
    if (taskToDelete.mediaUri) {
      await deleteMediaFile(taskToDelete.mediaUri);
    }

    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    await saveTasksToStorage(updatedTasks);
  }, [tasks, saveTasksToStorage]);

  const loadTasksFromStorage = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run initial load
  useEffect(() => {
    loadTasksFromStorage();
  }, []);


  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    pickMedia,
    takePhoto,
     loadTasks: loadTasksFromStorage, 
  };
};