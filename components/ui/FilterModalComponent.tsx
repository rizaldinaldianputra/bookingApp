// FilterModalComponent.tsx
import { colors } from '@/constants/colors';
import { Fasilitas, FasilitasResponse } from '@/models/fasilistas';
import { Lokasi, LokasiResponse } from '@/models/lokasi';
import { Room, RoomResponse } from '@/models/typekos';
import { getFasilitas } from '@/service/fasilitas_service';
import { getTipekos } from '@/service/kossan_service';
import { getLokasi } from '@/service/lokasi_service';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';

export interface FilterState {
  tipe: string;
  daerah: string;
  durasi: string;
  jenis: string;
  start_date: string | null;
  end_date: string | null;
}

const { width } = Dimensions.get('window');

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const FilterModalComponent = ({
  isVisible,
  onClose,
  onApplyFilter,
  initialFilters = {
    daerah: '',
    durasi: '',
    jenis: '',
    start_date: null,
    end_date: null,
    tipe: '',
  },
}: FilterModalProps) => {
  const [lokasi, setLokasi] = useState<Lokasi[]>([]);
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
  const [typeKos, setTypeKos] = useState<Room[]>([]);

  const [selectedTypeKos, setSelectedTypeKos] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDurasi, setSelectedDurasi] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('');
  const [start_date, setstart_date] = useState<string | null>(null);
  const [end_date, setend_date] = useState<string | null>(null);

  const [isCheckInPickerVisible, setIsCheckInPickerVisible] = useState(false);
  const [isCheckOutPickerVisible, setIsCheckOutPickerVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // reset filter saat modal dibuka
      setSelectedTypeKos(initialFilters?.tipe || '');
      setSelectedLocation(initialFilters?.daerah || '');
      setSelectedDurasi(initialFilters?.durasi || '');
      setSelectedJenis(initialFilters?.jenis || '');
      setstart_date(initialFilters?.start_date || null);
      setend_date(initialFilters?.end_date || null);

      const fetchData = async () => {
        try {
          const lokasiData: LokasiResponse = await getLokasi();
          setLokasi(lokasiData.data);

          const fasilitasData: FasilitasResponse = await getFasilitas();
          setFasilitas(fasilitasData.data);

          const typeKosData: RoomResponse = await getTipekos();
          setTypeKos(typeKosData.data);
        } catch (error) {
          console.error('Failed to fetch filter data:', error);
        }
      };
      fetchData();
    }
  }, [initialFilters, isVisible]);

  const handleApply = () => {
    const filterData: FilterState = {
      tipe: selectedTypeKos,
      daerah: selectedLocation,
      durasi: selectedDurasi,
      jenis: selectedJenis,
      start_date: start_date || '',
      end_date: end_date || '',
    };

    onApplyFilter(filterData);

    // Hanya sertakan field yang punya value (bukan kosong)
    const filteredParams: Record<string, string> = {};
    Object.entries(filterData).forEach(([key, value]) => {
      if (value.trim() !== '') {
        // skip string kosong
        filteredParams[key] = value;
      }
    });

    const queryString = new URLSearchParams(filteredParams).toString();
    console.log('Filtered URL:', `/home/kossan/kamarlist_filter?${queryString}`);
    router.push(`/home/kossan/kamarlist_filter?${queryString}`);
    onClose();
  };

  const today = new Date();

  const handleConfirmCheckIn = (date: Date) => {
    const selected = date.toISOString().split('T')[0];
    setstart_date(selected);
    if (!end_date || new Date(end_date) < date) setend_date(selected);
    setIsCheckInPickerVisible(false);
  };

  const handleConfirmCheckOut = (date: Date) => {
    setend_date(date.toISOString().split('T')[0]);
    setIsCheckOutPickerVisible(false);
  };

  const hideCheckInPicker = () => setIsCheckInPickerVisible(false);
  const hideCheckOutPicker = () => setIsCheckOutPickerVisible(false);

  const durasiOptions = ['Perharian', 'Perbulan', 'Pertigabulan', 'Perenambulan', 'Pertahun'];
  const toggleSelection = (current: string, value: string) => (current === value ? '' : value);

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
              }}
            >
              <Text style={styles.modalTitle}></Text>
              <Text style={styles.modalTitle}>Filter</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={24} color="#ff0318ff" />
              </TouchableOpacity>
            </View>

            <DateTimePickerModal
              isVisible={isCheckInPickerVisible}
              mode="date"
              onConfirm={handleConfirmCheckIn}
              onCancel={hideCheckInPicker}
              date={start_date ? new Date(start_date) : today}
              maximumDate={today}
            />

            <DateTimePickerModal
              isVisible={isCheckOutPickerVisible}
              mode="date"
              onConfirm={handleConfirmCheckOut}
              onCancel={hideCheckOutPicker}
              minimumDate={start_date ? new Date(start_date) : today}
              date={end_date ? new Date(end_date) : start_date ? new Date(start_date) : today}
            />

            <Text style={styles.filterSectionTitle}>Type Kos</Text>
            <View style={styles.filterChipContainer}>
              {typeKos.map((tk) => (
                <TouchableOpacity
                  key={tk.id}
                  style={[styles.chip, selectedTypeKos === tk.nama && styles.chipSelected]}
                  onPress={() => setSelectedTypeKos(toggleSelection(selectedTypeKos, tk.nama))}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedTypeKos === tk.nama && styles.chipTextSelected,
                    ]}
                  >
                    {tk.nama}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionTitle}>Lokasi</Text>
            <View style={styles.filterChipContainer}>
              {lokasi.map((loc) => (
                <TouchableOpacity
                  key={loc.id}
                  style={[styles.chip, selectedLocation === loc.nama && styles.chipSelected]}
                  onPress={() => setSelectedLocation(toggleSelection(selectedLocation, loc.nama))}
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

            <Text style={styles.filterSectionTitle}>Durasi</Text>
            <View style={styles.filterChipContainer}>
              {durasiOptions.map((durasi) => (
                <TouchableOpacity
                  key={durasi}
                  style={[styles.chip, selectedDurasi === durasi && styles.chipSelected]}
                  onPress={() => setSelectedDurasi(toggleSelection(selectedDurasi, durasi))}
                >
                  <Text
                    style={[styles.chipText, selectedDurasi === durasi && styles.chipTextSelected]}
                  >
                    {durasi}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionTitle}>Jenis</Text>
            <View style={styles.filterChipContainer}>
              {['Putra', 'Putri', 'Campur'].map((jenis) => (
                <TouchableOpacity
                  key={jenis}
                  style={[styles.chip, selectedJenis === jenis && styles.chipSelected]}
                  onPress={() => setSelectedJenis(toggleSelection(selectedJenis, jenis))}
                >
                  <Text
                    style={[styles.chipText, selectedJenis === jenis && styles.chipTextSelected]}
                  >
                    {jenis}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionTitle}>Rentang Tanggal</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                style={[styles.dateButton, styles.dateButtonSolid]}
                onPress={() => setIsCheckInPickerVisible(true)}
              >
                <Icon name="calendar-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                <Text style={[styles.dateButtonText, { color: '#fff' }]}>
                  {start_date ? start_date : 'Tanggal Masuk'}
                </Text>
              </TouchableOpacity>

              <Icon
                name="arrow-forward"
                size={20}
                color="#166534"
                style={{ marginHorizontal: 12 }}
              />

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
                  {end_date ? end_date : 'Tanggal Keluar'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 50 }} />
          </ScrollView>

          <View style={styles.buttonContainer}>
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
  dateButtonSolid: { backgroundColor: '#166534' },
  dateButtonOutline: { borderWidth: 1, borderColor: '#166534', backgroundColor: 'transparent' },
  dateButtonText: { fontSize: 14, fontWeight: '500' },
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#065F46',
    borderRadius: 60,
    padding: 15,
    alignItems: 'center',
  },
  applyButtonText: { color: '#fff', fontWeight: 'bold' },
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
});

export default FilterModalComponent;
