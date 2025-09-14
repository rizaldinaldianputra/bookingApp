import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons'; // contoh icon library
import { JSX } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface Kamar {
  id: string;
  name: string;
  location: string;
  priceNight: string;
  priceMonth: string;
  kos: string;
  image: string;
  facilities: string[];
}

const kamarData: Kamar[] = [
  {
    id: '1',
    name: 'Kamar Exclusive',
    location: 'Kota Semarang',
    priceNight: 'IDR 150.000',
    priceMonth: 'IDR 750.000',
    kos: 'KOS UNNES',
    image: 'https://i.ibb.co/0FhR4Ff/kos-semangat.jpg',
    facilities: ['WiFi', 'Bed', 'Parking', 'AC'],
  },
];

const facilityIcons: { [key: string]: JSX.Element } = {
  WiFi: <FontAwesome name="wifi" size={16} color="#1D4D3C" />,
  Bed: <MaterialIcons name="bed" size={16} color="#1D4D3C" />,
  Parking: <FontAwesome name="car" size={16} color="#1D4D3C" />,
  AC: <Entypo name="air" size={16} color="#1D4D3C" />,
};

const KamarListScreen = () => {
  const renderItem = ({ item }: { item: Kamar }) => (
    <View style={styles.card}>
      <Image source={require('../../../assets/images/onboarding.png')} style={styles.image} />
      <View style={styles.cardlist}>
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>📍 {item.location}</Text>

          <Text style={styles.facilityLabel}>facility</Text>
          <View style={styles.facilitiesContainer}>
            {item.facilities.map((facility, index) => (
              <View key={index} style={styles.facilityBox}>
                {facilityIcons[facility]}
              </View>
            ))}
          </View>
        </View>
        <View style={styles.priceDetailContainer}>
          <Text style={styles.priceLabel}>Harga</Text>

          <View>
            <Text style={styles.priceLabel}>from {item.priceNight} / Night</Text>
            <Text style={styles.priceLabel}>from {item.priceMonth} / Month</Text>
          </View>
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Detail</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ height: 70 }} />
      <Text style={styles.header}>List Kos Semarang</Text>

      <FlatList
        data={kamarData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1D4D3C',
    color: '#fff',
    textAlign: 'center',
    padding: 12,
    borderRadius: 12,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  cardlist: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
  },

  card: { borderRadius: 12, overflow: 'hidden', marginBottom: 16, backgroundColor: '#A3B7A1' },
  image: { width: '100%', height: 180 },
  cardContent: { padding: 12 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  location: { color: '#fff', marginBottom: 8 },
  priceDetailContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  priceLabel: { color: '#fff', fontSize: 12 },
  detailButton: {
    backgroundColor: '#1D4D3C',
    paddingVertical: 6,
    marginTop: 20,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  facilityLabel: { color: '#fff', fontSize: 12, marginBottom: 4, fontWeight: 'bold' },
  facilitiesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  facilityBox: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default KamarListScreen;
