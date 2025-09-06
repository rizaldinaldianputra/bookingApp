// App.tsx
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, { useCallback, useEffect, useState } from 'react';
import { colors } from '../../constants/colors';

import {
  ActivityIndicator,
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
import { Fasilitas, FasilitasResponse } from '../../models/fasilistas';
import { Lokasi, LokasiResponse } from '../../models/lokasi';
import { getFasilitas } from '../../service/fasilitas_service';
import { getLokasi } from '../../service/lokasi_service';

import { BASE_URL } from '@/constants/config';
import { router, useNavigation } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Ubah import ini
import { KamarResponse as ApiKamarResponse, Kamar } from '../../models/kossan';
import { getKos } from '../../service/kossan_service';

interface FilterState {
  location: string;
  time: string;
  gender: string;
  facilities: string[];
  minPrice: number;
  maxPrice: number;
  search: string;
  checkInDate: string | null; // Tambah checkInDate
  checkOutDate: string | null; // Tambah checkOutDate
}

const { width } = Dimensions.get('window');

const FilterBadge = ({ label, onClose }: { label: string; onClose: () => void }) => (
  <View style={styles.filterBadge}>
    <Text style={styles.filterBadgeText}>{label}</Text>
    <TouchableOpacity onPress={onClose}>
      <Icon name="close" size={12} color="#0f172a" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  </View>
);

const renderRecommendedItem = ({ item }: { item: Kamar }) => {
  let facilitiesArray: string[] = [];
  try {
    if (item.fasilitas && typeof item.fasilitas === 'string') {
      facilitiesArray = JSON.parse(item.fasilitas);
    }
  } catch (e) {
    facilitiesArray = item.fasilitas ? [item.fasilitas as string] : [];
  }

  const displayedPrice = item.paket_harga?.perbulan_harga || 0;
  const imageUrl =
    item.gallery && item.gallery.length > 0
      ? `${BASE_URL}${item.gallery[0].url}`
      : 'https://via.placeholder.com/100';

  return (
    <TouchableOpacity onPress={() => router.push(`/home/kossan/detail?id=${item.id}`)}>
      <View style={styles.recommendedCard}>
        <Image source={{ uri: imageUrl }} style={styles.recommendedImage} />
        <View style={styles.recommendedDetails}>
          <Text style={styles.cardTitle}>{item.nama_kamar}</Text>
          <View style={styles.labelContainer}>
            {item.tipe_kos && (
              <View key={item.tipe_kos} style={styles.labelBadge}>
                <Text style={styles.labelText}>{item.tipe_kos}</Text>
              </View>
            )}
            {item.jenis_kos && (
              <View key={item.jenis_kos} style={styles.labelBadge}>
                <Text style={styles.labelText}>{item.jenis_kos}</Text>
              </View>
            )}
            {facilitiesArray.slice(0, 1).map((facility, index) => (
              <View key={`fac-${index}`} style={styles.labelBadge}>
                <Text style={styles.labelText}>{facility}</Text>
              </View>
            ))}
          </View>
          <View>
            <Text style={styles.cardPrice}>Rp {displayedPrice.toLocaleString('id-ID')}</Text>
            <Text style={styles.cardMonth}>{'Bulan'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterState) => void;
  initialFilters: FilterState;
}

const FilterModal = ({ isVisible, onClose, onApplyFilter, initialFilters }: FilterModalProps) => {
  const [lokasi, setLokasi] = useState<Lokasi[]>([]);
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(initialFilters.location);
  const [selectedTime, setSelectedTime] = useState(initialFilters.time);
  const [selectedGender, setSelectedGender] = useState(initialFilters.gender);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(initialFilters.facilities);
  const [range, setRange] = useState([initialFilters.minPrice, initialFilters.maxPrice]);
  const [checkInDate, setCheckInDate] = useState<string | null>(initialFilters.checkInDate);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(initialFilters.checkOutDate);

  const [isCheckInPickerVisible, setIsCheckInPickerVisible] = useState(false);
  const [isCheckOutPickerVisible, setIsCheckOutPickerVisible] = useState(false);

  useEffect(() => {
    setSelectedLocation(initialFilters.location);
    setSelectedTime(initialFilters.time);
    setSelectedGender(initialFilters.gender);
    setSelectedFacilities(initialFilters.facilities);
    setRange([initialFilters.minPrice, initialFilters.maxPrice]);
    setCheckInDate(initialFilters.checkInDate);
    setCheckOutDate(initialFilters.checkOutDate);

    const fetchData = async () => {
      try {
        const lokasiData: LokasiResponse = await getLokasi();
        setLokasi(lokasiData.data);

        const fasilitasData: FasilitasResponse = await getFasilitas();
        setFasilitas(fasilitasData.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [initialFilters, isVisible]);

  const handleFacilityToggle = (facilityName: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityName)
        ? prev.filter((f) => f !== facilityName)
        : [...prev, facilityName],
    );
  };

  const handleReset = () => {
    setSelectedLocation('');
    setSelectedTime('');
    setSelectedGender('');
    setSelectedFacilities([]);
    setRange([0, 10000000]);
    setCheckInDate(null);
    setCheckOutDate(null);
  };

  const handleApply = () => {
    onApplyFilter({
      location: selectedLocation,
      time: selectedTime,
      gender: selectedGender,
      facilities: selectedFacilities,
      minPrice: range[0],
      maxPrice: range[1],
      search: initialFilters.search,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
    });
    onClose();
  };

  const today = new Date();

  // Handler untuk DatePicker Check-in
  const handleConfirmCheckIn = (date: Date) => {
    setCheckInDate(date.toISOString().split('T')[0]);
    setIsCheckInPickerVisible(false);
  };

  // Handler untuk DatePicker Check-out
  const handleConfirmCheckOut = (date: Date) => {
    setCheckOutDate(date.toISOString().split('T')[0]);
    setIsCheckOutPickerVisible(false);
  };

  const hideCheckInPicker = () => {
    setIsCheckInPickerVisible(false);
  };

  const hideCheckOutPicker = () => {
    setIsCheckOutPickerVisible(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
            <Text style={styles.modalTitle}>Filter</Text>
            <Text style={styles.filterSectionTitle}>Tanggal Check-in</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setIsCheckInPickerVisible(true)}
            >
              <Text style={styles.dateInputText}>
                {checkInDate ? checkInDate : 'Pilih Tanggal Check-in'}
              </Text>
              <Icon name="calendar-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <Text style={styles.filterSectionTitle}>Tanggal Check-out</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setIsCheckOutPickerVisible(true)}
            >
              <Text style={styles.dateInputText}>
                {checkOutDate ? checkOutDate : 'Pilih Tanggal Check-out'}
              </Text>
              <Icon name="calendar-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isCheckOutPickerVisible}
              mode="date"
              onConfirm={handleConfirmCheckOut}
              onCancel={hideCheckOutPicker}
              minimumDate={checkInDate ? new Date(checkInDate) : today}
              date={
                checkOutDate ? new Date(checkOutDate) : checkInDate ? new Date(checkInDate) : today
              }
            />

            <DateTimePickerModal
              isVisible={isCheckInPickerVisible}
              mode="date"
              onConfirm={handleConfirmCheckIn}
              onCancel={hideCheckInPicker}
              minimumDate={today}
              date={checkInDate ? new Date(checkInDate) : today}
            />
            <Text style={styles.filterSectionTitle}>Lokasi</Text>
            <View style={styles.filterChipContainer}>
              {lokasi.map((loc) => (
                <TouchableOpacity
                  key={loc.id}
                  style={[styles.chip, selectedLocation === loc.nama && styles.chipSelected]}
                  onPress={() => setSelectedLocation(loc.nama)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedLocation === loc.nama && styles.chipTextSelected,
                    ]}
                  >
                    {loc.nama}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionTitle}>Waktu</Text>
            <View style={styles.filterChipContainer}>
              {['Perbulan', '3 Bulan', '6 Bulan', 'Pertahun', 'Harian'].map((time) => (
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

            <Text style={styles.filterSectionTitle}>Gender</Text>
            <View style={styles.filterChipContainer}>
              {['Pria', 'Wanita', 'Pria/Wanita'].map((gender) => (
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

            <Text style={styles.filterSectionTitle}>Fasilitas</Text>
            <View style={styles.facilityGrid}>
              {fasilitas.map((facility) => (
                <TouchableOpacity
                  key={facility.id}
                  style={styles.facilityCheckboxContainer}
                  onPress={() => handleFacilityToggle(facility.nama)}
                >
                  <Icon
                    name={
                      selectedFacilities.includes(facility.nama) ? 'checkbox' : 'square-outline'
                    }
                    size={20}
                    color={selectedFacilities.includes(facility.nama) ? colors.primary : '#9CA3AF'}
                  />
                  <Text style={styles.facilityText}>{facility.nama}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionTitle}>Harga</Text>
            <View style={styles.containerPrice}>
              <MultiSlider
                values={range}
                min={0}
                max={10000000}
                step={100000}
                onValuesChange={setRange}
                sliderLength={width - 80}
                selectedStyle={{ backgroundColor: colors.primary }}
                markerStyle={{ backgroundColor: colors.primary }}
                minMarkerOverlapDistance={20}
              />
            </View>
            <View style={styles.rangePrice}>
              <View style={styles.priceBox}>
                <Text style={styles.filterRange}>Rp {range[0].toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.filterRange}>Rp {range[1].toLocaleString('id-ID')}</Text>
              </View>
            </View>
          </ScrollView>

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

export default function App() {
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    location: '',
    time: '',
    gender: '',
    facilities: [],
    minPrice: 0,
    maxPrice: 10000000,
    search: '',
    checkInDate: null,
    checkOutDate: null,
  });

  const [kosData, setKosData] = useState<Kamar[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchKosData = useCallback(
    async (page: number, filters: FilterState, isNewSearch: boolean = false) => {
      if (isLoading && !isNewSearch) return;
      if (!hasMore && page > 1 && !isNewSearch) return;

      setIsLoading(true);

      try {
        const params: any = { current_page: page, per_page: 10 };
        if (filters.search) params.search = filters.search;
        if (filters.location) params.lokasi_kos = filters.location;
        if (filters.gender) params.jenis_kos = filters.gender;
        if (filters.facilities.length > 0) params.fasilitas = JSON.stringify(filters.facilities);
        if (filters.minPrice > 0) params.min_harga = filters.minPrice;
        if (filters.maxPrice < 10000000) params.max_harga = filters.maxPrice;
        if (filters.checkInDate) params.start_date = filters.checkInDate; // Tambah parameter check-in
        if (filters.checkOutDate) params.end_date = filters.checkOutDate; // Tambah parameter check-out

        const response: ApiKamarResponse = await getKos(params);

        if (response && response.success) {
          if (response.data && response.data.length > 0) {
            setKosData((prevData) =>
              page === 1 ? response.data : [...prevData, ...response.data],
            );
            setCurrentPage(response.meta.current_page);
            setHasMore(response.meta.current_page < response.meta.last_page);
          } else {
            if (page === 1) setKosData([]);
            setHasMore(false);
          }
        } else {
          setKosData([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error(error);
        setKosData([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore],
  );

  useEffect(() => {
    setKosData([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchKosData(1, activeFilters, true);
  }, [activeFilters]);

  const handleApplyFilter = (newFilters: FilterState) => {
    setActiveFilters(newFilters);
  };

  const handleSearchChange = (text: string) => {
    setActiveFilters((prev) => ({ ...prev, search: text }));
  };

  const handleSearchSubmit = () => {
    setActiveFilters((prev) => ({ ...prev, search: prev.search }));
  };

  const getActiveFilterLabels = () => {
    const labels: string[] = [];
    if (activeFilters.location) labels.push(activeFilters.location);
    if (activeFilters.time) labels.push(activeFilters.time);
    if (activeFilters.gender) labels.push(activeFilters.gender);
    if (activeFilters.checkInDate) labels.push(`Check-in: ${activeFilters.checkInDate}`);
    if (activeFilters.checkOutDate) labels.push(`Check-out: ${activeFilters.checkOutDate}`);
    activeFilters.facilities.forEach((facility) => labels.push(facility));
    if (activeFilters.minPrice > 0 || activeFilters.maxPrice < 10000000) {
      labels.push(
        `Rp ${activeFilters.minPrice.toLocaleString(
          'id-ID',
        )} - Rp ${activeFilters.maxPrice.toLocaleString('id-ID')}`,
      );
    }
    if (activeFilters.search) labels.push(`Search: "${activeFilters.search}"`);
    return labels;
  };

  const removeFilter = (labelToRemove: string) => {
    setActiveFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (newFilters.location === labelToRemove) newFilters.location = '';
      else if (newFilters.time === labelToRemove) newFilters.time = '';
      else if (newFilters.gender === labelToRemove) newFilters.gender = '';
      else if (labelToRemove.startsWith('Check-in: ')) newFilters.checkInDate = null;
      else if (labelToRemove.startsWith('Check-out: ')) newFilters.checkOutDate = null;
      else if (labelToRemove.startsWith('Rp ') && labelToRemove.includes(' - Rp ')) {
        newFilters.minPrice = 0;
        newFilters.maxPrice = 10000000;
      } else if (labelToRemove.startsWith('Search: "') && labelToRemove.endsWith('"')) {
        newFilters.search = '';
      } else {
        newFilters.facilities = newFilters.facilities.filter((f) => f !== labelToRemove);
      }
      return newFilters;
    });
  };

  const loadMoreData = () => {
    if (hasMore && !isLoading) fetchKosData(currentPage + 1, activeFilters);
  };

  const renderFooter = () =>
    isLoading && kosData.length > 0 ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ) : null;
  const navigation = useNavigation();

  return (
    <View style={styles.fullScreenContainer}>
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Search</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kos..."
            placeholderTextColor="#9CA3AF"
            value={activeFilters.search}
            onChangeText={handleSearchChange}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Icon name="options-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        {getActiveFilterLabels().map((label, index) => (
          <FilterBadge key={index} label={label} onClose={() => removeFilter(label)} />
        ))}
      </View>

      <FlatList
        data={kosData}
        renderItem={renderRecommendedItem}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : `item-${index}`)}
        contentContainerStyle={styles.listContentContainer}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading && kosData.length === 0 && !hasMore ? (
            <Text style={styles.emptyText}>Tidak ada kos yang ditemukan.</Text>
          ) : isLoading && kosData.length === 0 && currentPage === 1 ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
          ) : null
        }
      />

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
  containerPrice: { alignItems: 'center', marginHorizontal: 5 },
  rangePrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  priceBox: {
    borderRadius: 18,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: 'rgba(222, 222, 222, 1.0)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  searchInput: { flex: 1, color: '#1F2937', paddingVertical: 0 },
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
  filterBadgeText: { fontSize: 10, fontWeight: '600', color: '#4F8B6E' },
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
  recommendedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'cover',
  },
  recommendedDetails: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 5 },
  labelContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  labelBadge: {
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  labelText: { fontSize: 10, fontWeight: '400', color: '#949494' },
  cardMonth: { fontSize: 10, fontWeight: '400', color: '#121212' },
  cardPrice: { fontSize: 16, fontWeight: '700', color: colors.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
    paddingTop: 15,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  filterRange: { fontSize: 12, fontWeight: '600', color: '#1F2937' },
  filterChipContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20 },
  chip: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: colors.primary },
  chipText: { color: '#374151', fontWeight: '500' },
  chipTextSelected: { color: '#fff' },
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  facilityCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
    marginRight: '2%',
  },
  facilityText: { marginLeft: 8, color: '#374151', fontSize: 14 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#D1FAE5',
    borderRadius: 60,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  resetButtonText: { color: '#065F46', fontWeight: 'bold' },
  applyButton: {
    flex: 1,
    backgroundColor: '#065F46',
    borderRadius: 60,
    padding: 15,
    alignItems: 'center',
  },
  applyButtonText: { color: '#fff', fontWeight: 'bold' },
  listContentContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  footerLoader: { paddingVertical: 20, alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#9CA3AF' },
  // Styles for DatePicker
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateInputText: {
    color: '#1F2937',
    flex: 1,
  },
  centeredView: {
    // Ini tidak lagi diperlukan untuk DateTimePickerModal
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  datePickerModalView: {
    // Ini tidak lagi diperlukan untuk DateTimePickerModal
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeDatePickerButton: {
    // Ini tidak lagi diperlukan untuk DateTimePickerModal
    marginTop: 15,
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  closeDatePickerButtonText: {
    // Ini tidak lagi diperlukan untuk DateTimePickerModal
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
