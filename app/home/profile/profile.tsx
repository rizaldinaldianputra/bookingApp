import { BASE_URL } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/models/user';
import { getUsers } from '@/service/user_service';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const fetchUser = async () => {
    try {
      const data = await getUsers();
      setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Akun Saya</Text>
        <Text style={styles.headerText}></Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Image
          source={{
            uri: `${BASE_URL}/img/user/${user?.id}/gambarktp/${user?.gambarktp}`,
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.editIconContainer}
          onPress={() => router.push('/home/profile/profileuser/profileuser')}
        >
          <Image source={require('@/assets/images/edit.png')} style={styles.editIcon} />
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
          <Image source={require('@/assets/images/useraccount.png')} style={styles.menuIcon} />
          <Text style={styles.menuItemText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/home/profile/transaksi/transaksi_list')}
          style={styles.menuItem}
        >
          <Image source={require('@/assets/images/transaksi.png')} style={styles.menuIcon} />
          <Text style={styles.menuItemText}>Transaksi Saya</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/home/profile/tagihan/tagihan_list')}
        >
          <Image source={require('@/assets/images/transaksi.png')} style={styles.menuIcon} />
          <Text style={styles.menuItemText}>Tagihan Saya</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/home/profile/ticket/ticket_list')}
          style={styles.menuItem}
        >
          <Image source={require('@/assets/images/keluhan.png')} style={styles.menuIcon} />
          <Text style={styles.menuItemText}>Keluhan & Saran</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/home/profile/pembelianproduct/pembelian_list')}
          style={styles.menuItem}
        >
          <Image source={require('@/assets/images/pembelianaccount.png')} style={styles.menuIcon} />
          <Text style={styles.menuItemText}>Pembelian Produk</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            await logout();
            router.replace('/auth/login');
          }}
          style={styles.menuItem}
        >
          <Image source={require('@/assets/images/logout.png')} style={styles.menuIcon} />
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  profileInfo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
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
  editIcon: { width: 16, height: 16, tintColor: '#fff' },
  nameText: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  emailText: { fontSize: 14, color: 'gray' },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingVertical: 10,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIcon: { width: 24, height: 24, resizeMode: 'contain' },
  menuItemText: { fontSize: 16, marginLeft: 16, color: '#000' },
});

export default ProfileScreen;
