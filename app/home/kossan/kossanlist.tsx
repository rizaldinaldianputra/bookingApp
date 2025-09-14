import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const kosData = [
  {
    id: '1',
    name: 'Kos Graha Semarang',
    rooms: 2,
    image: 'https://i.ibb.co/0FhR4Ff/kos-semangat.jpg',
  },
  {
    id: '2',
    name: 'Kos Graha Semarang',
    rooms: 2,
    image: 'https://i.ibb.co/0FhR4Ff/kos-semangat.jpg',
  },
];

const KosListScreen = () => {
  const [search, setSearch] = useState('');

  const filteredKos = kosData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={require('../../../assets/images/onboarding.png')} style={styles.image} />
      {/* Tombol melayang */}
      <TouchableOpacity
        onPress={() => router.push('/home/kossan/kamarlist')}
        style={styles.floatingButton}
      >
        <Text style={styles.buttonText}>Lihat Kamar</Text>
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.rooms}>{item.rooms} Kamar tersedia</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ height: 70 }} />

      <Text style={styles.header}>List Kos Semarang</Text>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Cari Lokasi Kos Lainnya..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Telusuri</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredKos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1D4D3C',
    color: '#fff',
    textAlign: 'center',
    padding: 12,
    borderRadius: 12,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#1D4D3C',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rooms: {
    color: '#555',
    marginBottom: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default KosListScreen;
