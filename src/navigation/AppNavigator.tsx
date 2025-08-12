import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskListScreen } from '../screens/TaskListScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { COLORS } from '../constants/theme';
import { Animated, StyleSheet, StatusBar, View ,Text} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export type RootStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (    
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TaskList"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="TaskList"
          component={TaskListWithCustomHeader}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const TaskListWithCustomHeader = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const headerHeight = 40 + insets.top; // Increased height to accommodate subtitle

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="light-content" 
      />

      {/* Fixed Header - No Animation */}
      <View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={[styles.headerContent]}>
            <Text style={styles.title}>
              TaskMaster Pro
            </Text>
            <Text style={styles.subtitle}>
              Organize your day like a pro ✨
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* List with padding to account for header */}
      <TaskListScreen 
        scrollY={scrollY}
        contentContainerStyle={{ paddingTop: headerHeight }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  gradient: {
    flex: 1,
  },
  headerContent: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 2,
  },
});