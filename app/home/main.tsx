import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LoginScreen from '../auth/login';
import HomeScreen from './home';
import LokasiList from './kossan/lokasilist';
import ProductList from './product/product';
import ProfileScreen from './profile/profile';

const Tab = createBottomTabNavigator();

export default function Main() {
  const { token } = useAuth();
  const navigation = useNavigation<any>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Kossan') iconName = 'place';
          else if (route.name === 'Toko') iconName = 'store';
          else if (route.name === 'Account') iconName = 'person-outline';

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Kossan" component={LokasiList} />
      <Tab.Screen name="Toko" component={ProductList} />

      <Tab.Screen
        name="Account"
        component={token ? ProfileScreen : LoginScreen}
        listeners={{
          tabPress: (e) => {
            if (!token) {
              e.preventDefault(); // cegah pindah ke tab
              router.replace('/auth/login'); // arahkan ke login
            }
          },
        }}
      />
    </Tab.Navigator>
  );
}
