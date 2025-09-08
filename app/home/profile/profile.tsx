import { BASE_URL } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/models/user';
import { getUsers } from '@/service/user_service';
import { useNavigation, useRouter } from 'expo-router'; // gunakan hook ini
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter(); // inisialisasi router
  const { token, logout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const data = await getUsers();
        setUser(data.user); // ambil user dari data.user
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Akun Saya</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Image
          source={{
            uri: BASE_URL + '/' + user?.fotoselfie,
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIconContainer}>
          <Feather name="edit" size={16} color="#fff" style={styles.editIcon} />
        </TouchableOpacity>
        <Text style={styles.nameText}>{user?.nama}</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          onPress={() => router.push('/home/profile/profileuser/profileuser')}
          style={styles.menuItem}
        >
          <Feather name="user" size={24} color="#4CAF50" />
          <Text style={styles.menuItemText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/home/profile/transaksi/transaksi_list')}
          style={styles.menuItem}
        >
          <Feather name="file-text" size={24} color="#000" />
          <Text style={styles.menuItemText}>Transaksi Saya</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/home/profile/pembelian/pembelian_list')}
        >
          <Feather name="shopping-cart" size={24} color="#000" />
          <Text style={styles.menuItemText}>Pembelian Saya</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/home/profile/ticket/ticket_list')}
          style={styles.menuItem}
        >
          <Feather name="mail" size={24} color="#000" />
          <Text style={styles.menuItemText}>Keluhan & Saran</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            await logout();
            router.replace('/auth/login');
          }}
          style={styles.menuItem}
        >
          <Feather name="log-out" size={24} color="#000" />
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  profileInfo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    top: 90,
    right: '35%',
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  editIcon: {
    textAlign: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emailText: {
    fontSize: 14,
    color: 'gray',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#000',
  },
});

export default ProfileScreen;
