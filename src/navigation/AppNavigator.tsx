import React, { useRef } from 'react';
import { NavigationContainer  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskListScreen } from '../screens/TaskListScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { COLORS } from '../constants/theme';
import { Animated, StyleSheet, StatusBar, View } from 'react-native';
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
          options={({ route }) => ({
            headerShown: true,
            title: route.params.taskId ? 'Edit Task' : 'New Task',
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const TaskListWithCustomHeader = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const headerHeight = 40 + insets.top;

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight / 3],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
       <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="light-content" 
      />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            backgroundColor: 'transparent', 
          },
        ]}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.headerContent}>
            <Animated.Text
              style={[
                styles.title,
                {
                  transform: [
                    { translateY: titleTranslateY },
                    { scale: titleScale },
                  ],
                },
              ]}
            >
              TaskMaster Pro
            </Animated.Text>

            <Animated.Text
              style={[
                styles.subtitle,
                { opacity: subtitleOpacity },
              ]}
            >
              Organize your day like a pro ✨
            </Animated.Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* List */}
      <TaskListScreen scrollY={scrollY} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: 'transparent', 
  },
  header: {
    backgroundColor: 'transparent',
    borderColor:'red',
    borderWidth: 2,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.85,
    marginTop: 2,
  },
});