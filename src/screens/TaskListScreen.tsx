import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { TaskItem } from '../components/TaskItem';
import { EmptyState } from '../components/EmptyState';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING } from '../constants/theme';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type TaskListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskList'>;

export const TaskListScreen: React.FC = () => {
  const { tasks, isLoading, deleteTask } = useTasks();
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const navigation = useNavigation<TaskListScreenNavigationProp>();

  const handleDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const navigateToTaskDetail = (taskId?: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onPress={() => navigateToTaskDetail(item.id)}
              onDelete={() => setTaskToDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigateToTaskDetail()}
      >
        <MaterialIcons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>

      <ConfirmationModal
        visible={!!taskToDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        onConfirm={handleDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.medium,
  },
  addButton: {
    position: 'absolute',
    right: SPACING.large,
    bottom: SPACING.large,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
});