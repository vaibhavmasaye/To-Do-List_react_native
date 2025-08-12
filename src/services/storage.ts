import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Task } from '../types/task';

const TASKS_KEY = '@tasks';

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks', error);
    throw error;
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Failed to load tasks', error);
    throw error;
  }
};

export const deleteMediaFile = async (uri: string): Promise<void> => {
  try {
    if (uri.startsWith('file://')) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
  } catch (error) {
    console.error('Failed to delete media file', error);
  }
};