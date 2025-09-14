import { colors } from '@/constants/colors'; // Pastikan path ini benar untuk proyek Anda
import { useEffect, useState } from 'react';

import { Fasilitas, FasilitasResponse } from '@/models/fasilistas'; // Pastikan path ini benar
import { Lokasi, LokasiResponse } from '@/models/lokasi'; // Pastikan path ini benar
import { getFasilitas } from '@/service/fasilitas_service'; // Pastikan path ini benar
import { getLokasi } from '@/service/lokasi_service'; // Pastikan path ini benar
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { router } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export interface FilterState {
  location: string;
  time: string;
  gender: string;
  search: string;
  checkInDate: string | null;
  checkOutDate: string | null;
}

const { width } = Dimensions.get('window');

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterState) => void;
  initialFilters: FilterState;
}

const FilterModalComponent = ({
  isVisible,
  onClose,
  onApplyFilter,
  initialFilters,
}: FilterModalProps) => {
  const [lokasi, setLokasi] = useState<Lokasi[]>([]);
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(initialFilters.location);
  const [selectedTime, setSelectedTime] = useState(initialFilters.time);
  const [selectedGender, setSelectedGender] = useState(initialFilters.gender);
  const [checkInDate, setCheckInDate] = useState<string | null>(initialFilters.checkInDate);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(initialFilters.checkOutDate);

  const [isCheckInPickerVisible, setIsCheckInPickerVisible] = useState(false);
  const [isCheckOutPickerVisible, setIsCheckOutPickerVisible] = useState(false);

  useEffect(() => {
    // Sinkronkan state lokal dengan initialFilters setiap kali isVisible atau initialFilters berubah
    if (isVisible) {
      setSelectedLocation(initialFilters.location);
      setSelectedTime(initialFilters.time);
      setSelectedGender(initialFilters.gender);

      setCheckInDate(initialFilters.checkInDate);
      setCheckOutDate(initialFilters.checkOutDate);
    }

    const fetchData = async () => {
      try {
        const lokasiData: LokasiResponse = await getLokasi();
        setLokasi(lokasiData.data);

        const fasilitasData: FasilitasResponse = await getFasilitas();
        setFasilitas(fasilitasData.data);
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      }
    };
    fetchData();
  }, [initialFilters, isVisible]);

  const handleReset = () => {
    setSelectedLocation('');
    setSelectedTime('');
    setSelectedGender('');

    setCheckInDate(null);
    setCheckOutDate(null);
  };

  const handleApply = () => {
    const filterData = {
      location: selectedLocation,
      time: selectedTime,
      gender: selectedGender,
      search: initialFilters.search,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
    };

    onApplyFilter(filterData);

    // Ubah object filter menjadi query string
    const queryString = new URLSearchParams(filterData as any).toString();

    router.push(`/home/kossan/kamarlist_filter?${queryString}`);
    onClose();
  };

  const today = new Date();

  const handleConfirmCheckIn = (date: Date) => {
    setCheckInDate(date.toISOString().split('T')[0]);
    setIsCheckInPickerVisible(false);
  };

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

            <DateTimePickerModal
              isVisible={isCheckOutPickerVisible}
              mode="date"
              onConfirm={handleConfirmCheckOut}
              onCancel={hideCheckOutPicker}
              minimumDate={checkInDate ? new Date(checkInDate) : undefined} // Biarkan minimumDate null jika checkInDate belum dipilih
              date={
                checkOutDate ? new Date(checkOutDate) : checkInDate ? new Date(checkInDate) : today
              }
            />

            <DateTimePickerModal
              isVisible={isCheckInPickerVisible}
              mode="date"
              onConfirm={handleConfirmCheckIn}
              onCancel={hideCheckInPicker}
              // minimumDate={today} // Hapus batasan minimumDate agar tidak ada batasan tanggal mundur
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
            <Text style={styles.filterSectionTitle}>Rentang Tanggal</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Tanggal Masuk */}
              <TouchableOpacity
                style={[styles.dateButton, styles.dateButtonSolid]}
                onPress={() => setIsCheckInPickerVisible(true)}
              >
                <Icon name="calendar-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                <Text style={[styles.dateButtonText, { color: '#fff' }]}>
                  {checkInDate ? checkInDate : 'Tanggal Masuk'}
                </Text>
              </TouchableOpacity>

              {/* Panah → */}
              <Icon
                name="arrow-forward"
                size={20}
                color="#166534"
                style={{ marginHorizontal: 12 }}
              />

              {/* Tanggal Keluar */}
              <TouchableOpacity
                style={[styles.dateButton, styles.dateButtonOutline]}
                onPress={() => setIsCheckOutPickerVisible(true)}
              >
                <Icon
                  name="calendar-outline"
                  size={20}
                  color="#166534"
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.dateButtonText, { color: '#166534' }]}>
                  {checkOutDate ? checkOutDate : 'Tanggal Keluar'}
                </Text>
              </TouchableOpacity>
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

export const FilterBadge = ({ label, onClose }: { label: string; onClose: () => void }) => (
  <View style={styles.filterBadge}>
    <Text style={styles.filterBadgeText}>{label}</Text>
    <TouchableOpacity onPress={onClose}>
      <Icon name="close" size={12} color="#0f172a" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  dateButtonSolid: {
    backgroundColor: '#166534', // hijau solid
  },

  dateButtonOutline: {
    borderWidth: 1,
    borderColor: '#166534', // hijau outline
    backgroundColor: 'transparent',
  },

  dateButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
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
});

export default FilterModalComponent;
