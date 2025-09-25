import { useTransaksi } from '@/hooks/transaksi';
import { User } from '@/models/user';
import { getUsers } from '@/service/user_service';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// --- AppBar Component ---
const AppBar = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <View style={appBarStyles.appBar}>
      <TouchableOpacity onPress={() => router.back()} style={appBarStyles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#a4a4a4ff" />
      </TouchableOpacity>
      <Text style={appBarStyles.appBarTitle}>{title}</Text>
      <View style={appBarStyles.rightPlaceholder} />
    </View>
  );
};

const appBarStyles = StyleSheet.create({
  appBar: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  appBarTitle: {
    fontFamily: 'Raleway',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 16,
    color: '#000000',
  },
  rightPlaceholder: {
    width: 40,
  },
});

// --- TransaksiList Component ---
export default function TransaksiList() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUsers();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const { data, loading, error, refetch } = useTransaksi(user?.id?.toString() || '');
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (item: any) =>
        item.kos.nama.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by Kos name
        item.kamar.nama.toLowerCase().includes(searchTerm.toLowerCase()), // Search by Kamar name
    );
  }, [data, searchTerm]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push({
          pathname: '/home/profile/tagihan/tagihan_detail',
          params: {
            id: item.id,
          },
        });
      }}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardKosName}>{item.kos.nama}</Text>
        <Text style={styles.cardKamarName}>Room: {item.kamar.nama}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#555" />
    </TouchableOpacity>
  );

  if (!user || loading) {
    return (
      <SafeAreaView style={styles.fullScreenCenter}>
        <AppBar title="Daftar Tagihan" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.fullScreenCenter}>
        <AppBar title="Daftar Tagihan" />
        <View style={styles.center}>
          <Text>{error}</Text>
          <TouchableOpacity onPress={refetch} style={styles.button}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flexContainer}>
      <AppBar title="Daftar Tagihan" />

      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari berdasarkan nama Kos atau Kamar..."
            value={searchTerm}
            onChangeText={(text) => {
              setSearchTerm(text);
            }}
          />
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada transaksi ditemukan.</Text>}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Light gray background
  },
  fullScreenCenter: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row', // Make content and icon side-by-side
    justifyContent: 'space-between', // Push icon to the right
    alignItems: 'center', // Vertically center content and icon
  },
  cardContent: {
    flex: 1, // Allow content to take up available space
    marginRight: 10, // Add some space between text and icon
  },
  cardKosName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4, // Space between kos and kamar
  },
  cardKamarName: {
    fontSize: 14,
    color: '#555',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 30,
    color: '#888',
    fontSize: 15,
  },
  flatListContent: {
    paddingBottom: 10,
  },
});
