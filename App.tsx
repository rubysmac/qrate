import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import PostSongScreen from './src/screens/PostSongScreen';
import CurationScreen from './src/screens/CurationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registerRootComponent } from 'expo';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const EmptyScreen = () => (
  <View>
    <Text>Placeholder</Text>
  </View>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Search') {
          iconName = 'search';
        } else if (route.name === 'Post') {
          iconName = 'add-circle';
        } else if (route.name === 'Curation') {
          iconName = 'library';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#FF5A75',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: '#1C1B33' },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Post" component={PostSongScreen} />
    <Tab.Screen name="Curation" component={CurationScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

registerRootComponent(App); // ✅ Ensure this is at the bottom for Expo projects
export default App;
