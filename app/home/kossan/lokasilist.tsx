import { Lokasi } from '@/models/lokasi';
import { getLokasi } from '@/service/home_service';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 48) / numColumns;

const LokasiList = () => {
  const [lokasi, setLokasi] = useState<Lokasi[]>([]);

  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const response = await getLokasi();
        setLokasi(response.data);
      } catch (e) {
        console.log('Error getLokasi:', e);
      }
    };
    fetchLokasi();
  }, []);

  const renderItem = ({ item }: { item: Lokasi }) => (
    <TouchableOpacity onPress={() => router.push('/home/kossan/kossanlist')}>
      <View style={styles.card}>
        <ImageBackground
          source={require('../../../assets/images/onboarding.png')}
          style={styles.image}
          imageStyle={{ borderRadius: 20 }}
        >
          {/* Overlay untuk text */}
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>{item.nama}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ height: 50 }} />

      <View style={styles.header}>
        <Text style={styles.headerText}>Lokasi Kos</Text>
      </View>
      <Text style={styles.subHeader}>Daftar Lokasi Kost Di Heaven App</Text>
      <FlatList
        data={lokasi}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1D4E2B',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subHeader: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: itemWidth,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // supaya overlay di bawah
  },
  overlay: {
    width: '100%',

    margin: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default LokasiList;
