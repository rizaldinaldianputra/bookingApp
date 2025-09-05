import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Screens
import SearchScreen from '../search/search';
import ProfileScreen from './profile/profile';

import { colors } from '@/constants/colors';
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
          else if (route.name === 'Wishlist') iconName = 'favorite-outline';
          else if (route.name === 'Chat') iconName = 'mail-outline';
          else if (route.name === 'Account') iconName = 'person-outline';

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary, // hijau
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      {/* <Tab.Screen name="Wishlist" component={SearchScreen} />
      <Tab.Screen name="Chat" component={ProfileScreen} /> */}
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
