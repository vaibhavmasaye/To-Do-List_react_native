import React, { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  ActivityIndicator,
  Animated,
  StyleProp,
  ViewStyle
} from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { TaskItem } from '../components/TaskItem';
import { EmptyState } from '../components/EmptyState';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES, SPACING } from '../constants/theme';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { format } from 'date-fns';
import { Task } from '../types/task';

type TaskListScreenProps = {
  scrollY?: Animated.Value;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

type TaskListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskList'>;

export const TaskListScreen: React.FC<TaskListScreenProps> = ({ 
  scrollY, 
  contentContainerStyle 
}) => {
  const { tasks, isLoading, deleteTask, loadTasks } = useTasks();
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const navigation = useNavigation<TaskListScreenNavigationProp>();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadTasks();
    }
  }, [isFocused]);

  const handleDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const navigateToTaskDetail = (taskId?: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  const groupTasksByDate = (tasks: Task[]) => {
    const grouped: {[key: string]: Task[]} = {};
    
    tasks.forEach(task => {
      const taskDate = task.updatedAt && task.updatedAt > task.createdAt 
        ? task.updatedAt 
        : task.createdAt;
      
      const dateKey = format(new Date(taskDate), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(task);
    });

    return Object.entries(grouped).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
  };

  const groupedTasks = groupTasksByDate(tasks);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <Animated.FlatList
          data={groupedTasks}
          keyExtractor={([date]) => date}
          renderItem={({ item: [date, tasks] }) => (
            <View style={styles.dateSection}>
              <View style={styles.dateHeaderContainer}>
                <Text style={styles.dateHeader}>
                  {format(new Date(date), 'EEEE, MMMM d')}
                </Text>
                <View style={styles.dateLine} />
              </View>
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onPress={() => navigateToTaskDetail(task.id)}
                  onDelete={() => setTaskToDelete(task.id)}
                />
              ))}
            </View>
          )}
          contentContainerStyle={[
            styles.listContent,
            contentContainerStyle
          ]}
          scrollEventThrottle={16}
          onScroll={
            scrollY ? Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            ) : undefined
          }
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigateToTaskDetail()}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color={COLORS.white} />
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
    paddingTop: SPACING.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.medium,
    color: COLORS.textSecondary,
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: SPACING.large,
    paddingBottom: SPACING.large * 2,
  },
  dateSection: {
    marginBottom: SPACING.large,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.medium,
    paddingHorizontal: SPACING.small,
  },
  dateHeader: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.small,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
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
    ...SHADOWS.large,
    elevation: 6,
  },
});