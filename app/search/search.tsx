import React, { useState } from 'react';
import { primaryColor } from '../../constants/Colors'; // Import the color variable

import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Mendefinisikan tipe data untuk filter menggunakan TypeScript
interface FilterState {
  location: string;
  time: string;
  gender: string;
  facilities: string[];
}

const { width } = Dimensions.get('window');

// Data dummy untuk properti yang direkomendasikan
// Data dummy untuk properti yang direkomendasikan (semua pakai network image random)
const recommendedData = [
  {
    id: '1',
    name: 'Gunung Pati Hills',
    price: '500.000',
    image: { uri: 'https://picsum.photos/100/100?random=11' },
    labels: ['1 Bathroom', '1 Bed', 'AC', 'WiFi', 'Couple'],
    gender: 'Pria',
  },
  {
    id: '2',
    name: 'Simpang Lima Apart',
    price: '700.000',
    image: { uri: 'https://picsum.photos/100/100?random=12' },
    labels: ['1 Bathroom', '1 Bed', 'AC', 'WiFi', 'Near Town', 'Televisi'],
    gender: 'Wanita',
  },
  {
    id: '3',
    name: 'Village BSB',
    price: '700.000',
    image: { uri: 'https://picsum.photos/100/100?random=13' },
    labels: ['1 Bathroom', '1 Bed', 'AC', 'WiFi', 'Near Town', 'CCTV'],
    gender: 'Pria',
  },
  {
    id: '4',
    name: 'Tembalang Residence',
    price: '650.000',
    image: { uri: 'https://picsum.photos/100/100?random=14' },
    labels: ['1 Bed', 'Wi-Fi', 'Kitchen'],
    gender: 'Pria',
  },
  {
    id: '5',
    name: 'Gajahmada Kost',
    price: '800.000',
    image: { uri: 'https://picsum.photos/100/100?random=15' },
    labels: ['1 Bed', 'AC', 'Wi-Fi', 'Parking'],
    gender: 'Wanita',
  },
];

// Komponen badge filter yang dapat ditutup
const FilterBadge = ({ label, onClose }: { label: string; onClose: () => void }) => (
  <View style={styles.filterBadge}>
    <Text style={styles.filterBadgeText}>{label}</Text>
    <TouchableOpacity onPress={onClose}>
      <Icon name="close" size={12} color="#0f172a" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  </View>
);

// Komponen untuk menampilkan item rekomendasi
const renderRecommendedItem = ({ item }: { item: (typeof recommendedData)[0] }) => (
  <View style={styles.recommendedCard}>
    <Image source={item.image} style={styles.recommendedImage} />
    <View style={styles.recommendedDetails}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <View style={styles.labelContainer}>
        {item.labels.map((label) => (
          <View key={label} style={styles.labelBadge}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
        ))}
      </View>
      <View>
        <Text style={styles.cardPrice}>Rp {item.price}</Text>
        <Text style={styles.cardMonth}>{'Bulan'}</Text>
      </View>
    </View>
  </View>
);

// Mendefinisikan properti untuk komponen FilterModal
interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterState) => void;
  initialFilters: FilterState;
}

// Komponen modal filter
const FilterModal = ({ isVisible, onClose, onApplyFilter, initialFilters }: FilterModalProps) => {
  const [selectedLocation, setSelectedLocation] = useState(initialFilters.location);
  const [selectedTime, setSelectedTime] = useState(initialFilters.time);
  const [selectedGender, setSelectedGender] = useState(initialFilters.gender);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(initialFilters.facilities);

  const facilities = [
    'Single Bed',
    'Televisi',
    'Wi-Fi',
    'Kitchen',
    'Twin Bed',
    'Parking',
    'Bathroom',
    'CCTV',
  ];

  const handleFacilityToggle = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility],
    );
  };

  const handleReset = () => {
    setSelectedLocation('');
    setSelectedTime('');
    setSelectedGender('');
    setSelectedFacilities([]);
  };

  const handleApply = () => {
    onApplyFilter({
      location: selectedLocation,
      time: selectedTime,
      gender: selectedGender,
      facilities: selectedFacilities,
    });
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
            <Text style={styles.modalTitle}>Filter</Text>

            {/* Filter Lokasi */}
            <Text style={styles.filterSectionTitle}>Lokasi</Text>
            <View style={styles.filterChipContainer}>
              {['Semarang', 'Jakarta', 'Bandung'].map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[styles.chip, selectedLocation === loc && styles.chipSelected]}
                  onPress={() => setSelectedLocation(loc)}
                >
                  <Text
                    style={[styles.chipText, selectedLocation === loc && styles.chipTextSelected]}
                  >
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Filter Waktu */}
            <Text style={styles.filterSectionTitle}>Waktu</Text>
            <View style={styles.filterChipContainer}>
              {['Perbulan', 'Pertahun'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[styles.chip, selectedTime === time && styles.chipSelected]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[styles.chipText, selectedTime === time && styles.chipTextSelected]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Filter Gender */}
            <Text style={styles.filterSectionTitle}>Gender</Text>
            <View style={styles.filterChipContainer}>
              {['Pria', 'Wanita', 'Campur'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[styles.chip, selectedGender === gender && styles.chipSelected]}
                  onPress={() => setSelectedGender(gender)}
                >
                  <Text
                    style={[styles.chipText, selectedGender === gender && styles.chipTextSelected]}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Filter Fasilitas */}
            <Text style={styles.filterSectionTitle}>Fasilitas</Text>
            <View style={styles.facilityGrid}>
              {facilities.map((facility) => (
                <TouchableOpacity
                  key={facility}
                  style={styles.facilityCheckboxContainer}
                  onPress={() => handleFacilityToggle(facility)}
                >
                  <Icon
                    name={selectedFacilities.includes(facility) ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={selectedFacilities.includes(facility) ? primaryColor : '#9CA3AF'}
                  />
                  <Text style={styles.facilityText}>{facility}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Range Harga */}
            <Text style={styles.filterSectionTitle}>Harga</Text>
            <View style={styles.priceRangeContainer}>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>Rp 100.000</Text>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>Rp 500.000</Text>
              </View>
            </View>
          </ScrollView>

          {/* Tombol aksi */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Komponen Utama
export default function App() {
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    location: '',
    time: '',
    gender: '',
    facilities: [],
  });

  const handleApplyFilter = (newFilters: FilterState) => {
    setActiveFilters(newFilters);
  };

  const getActiveFilterLabels = () => {
    const labels: string[] = [];
    if (activeFilters.time) labels.push(activeFilters.time);
    if (activeFilters.gender) labels.push(activeFilters.gender);
    activeFilters.facilities.forEach((facility) => labels.push(facility));
    return labels;
  };

  const filteredData = recommendedData.filter((item) => {
    const matchesGender = !activeFilters.gender || item.gender === activeFilters.gender;
    const matchesFacilities = activeFilters.facilities.every((facility) =>
      item.labels.includes(facility),
    );
    return matchesGender && matchesFacilities;
  });

  return (
    <View style={styles.fullScreenContainer}>
      {/* Header Pencarian */}
      <View style={styles.searchHeader}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Input Pencarian dan Tombol Filter */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Semarang"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Icon name="options-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Badge Filter Aktif */}
      <View style={styles.filtersContainer}>
        {getActiveFilterLabels().map((label, index) => (
          <FilterBadge
            key={index}
            label={label}
            onClose={() => {
              const newFilters = { ...activeFilters };
              if (label === newFilters.time) {
                newFilters.time = '';
              } else if (label === newFilters.gender) {
                newFilters.gender = '';
              } else {
                newFilters.facilities = newFilters.facilities.filter((f) => f !== label);
              }
              setActiveFilters(newFilters);
            }}
          />
        ))}
      </View>

      <ScrollView style={styles.container}>
        {/* Bagian Hasil Pencarian */}
        <Text style={styles.resultsTitle}>Result ({filteredData.length})</Text>
        <FlatList
          data={filteredData}
          renderItem={renderRecommendedItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Modal Filter */}
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilter={handleApplyFilter}
        initialFilters={activeFilters}
      />
    </View>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  fullScreenContainer: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, paddingHorizontal: 20 },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    color: '#1F2937',
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4F6E6',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4F8B6E',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 15,
    color: '#1F2937',
  },
  recommendedCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedImage: { width: 100, height: 100, borderRadius: 10 },
  recommendedDetails: { marginLeft: 10, flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 5 },
  labelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  labelBadge: {
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#949494',
  },
  cardMonth: {
    fontSize: 10,
    fontWeight: '400',
    color: '#121212',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: primaryColor,
  },
  // Style Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  filterChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  chip: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: primaryColor,
  },
  chipText: {
    color: '#374151',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  facilityCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  facilityText: {
    marginLeft: 8,
    color: '#374151',
    fontSize: 14,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  priceBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  priceText: {
    color: '#374151',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#D1FAE5',
    borderRadius: 60,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  resetButtonText: {
    color: '#065F46',
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#065F46',
    borderRadius: 60,
    padding: 15,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
