import { colors } from '@/constants/colors';
import { Kamar } from '@/models/kossan';
import { getKosById } from '@/service/kossan_service';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SearchByLokasiScreen = () => {
  const { idKossan } = useLocalSearchParams<{ idKossan: string }>();

  const [kosData, setKosData] = useState<Kamar[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchKosData = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getKosById(id);

      if (response && response.success) {
        if (Array.isArray(response.data)) {
          setKosData(response.data);
        } else {
          setKosData([]);
        }
      } else {
        setKosData([]);
      }
    } catch (error) {
      console.error(error);
      setKosData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (idKossan) {
      fetchKosData(idKossan);
    }
  }, [idKossan]);

  const renderItem = ({ item }: { item: Kamar }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nama_kamar}</Text>
      <Text style={styles.desc}>{item.tipe_kos}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ height: 70 }} />
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={{ height: 10 }} />
      <Text style={styles.header}>List Kamar</Text>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={kosData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>
              Tidak ada data kamar.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  header: {
    backgroundColor: colors.primary,
    color: '#fff',
    textAlign: 'center',
    padding: 12,
    borderRadius: 12,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  desc: { fontSize: 14, color: '#555' },
});

export default SearchByLokasiScreen;
