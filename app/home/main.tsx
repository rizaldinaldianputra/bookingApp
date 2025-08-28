import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { primaryColor } from '../../constants/Colors'; // Import the color variable

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Screens
import ProfileScreen from '../profile/profile';
import SearchScreen from '../search/search';

import HomeScreen from './home';

const Tab = createBottomTabNavigator();

export default function Main() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Search') iconName = 'search';
          else if (route.name === 'Notifications') iconName = 'notifications';
          else if (route.name === 'Profile') iconName = 'mail';
          else if (route.name === 'Settings') iconName = 'settings';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: primaryColor, // hijau
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Notifications" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SearchScreen} />
    </Tab.Navigator>
  );
}
