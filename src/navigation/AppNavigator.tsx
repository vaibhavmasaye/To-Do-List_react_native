import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TaskListScreen } from '../screens/TaskListScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { COLORS } from '../constants/theme';

export type RootStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="TaskList" 
        component={TaskListScreen} 
        options={{ title: 'My Tasks' }}
      />
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetailScreen} 
        options={({ route }) => ({ 
          title: route.params.taskId ? 'Edit Task' : 'New Task' 
        })}
      />
    </Stack.Navigator>
  );
};