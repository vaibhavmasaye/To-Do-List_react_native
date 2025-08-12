import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Task } from '../types/task';

const TASKS_KEY = '@tasks';

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    console.log('Saving tasks:', tasks); // Debug log
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
  } catch (error) {
    console.error('Failed to save tasks', error);
    throw error;
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    console.log('Loaded tasks:', jsonValue); // Debug log
    return jsonValue != null ? JSON.parse(jsonValue) : [];
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