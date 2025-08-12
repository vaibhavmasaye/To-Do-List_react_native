import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskListScreen } from '../screens/TaskListScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { COLORS } from '../constants/theme';

export type RootStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
         screenOptions={{
    headerStyle: {
      backgroundColor: COLORS.primary,
    },
    headerTitleAlign: 'center',
    headerShadowVisible: false, // Remove default shadow
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
    </NavigationContainer>
  );
};