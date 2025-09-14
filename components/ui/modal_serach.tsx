import { FilterState } from '@/hooks/kossan';
import { FasilitasResponse } from '@/models/fasilistas';
import { Fasilitas } from '@/models/kossan';
import { Lokasi, LokasiResponse } from '@/models/lokasi';
import { getFasilitas } from '@/service/fasilitas_service';
import { getLokasi } from '@/service/home_service';
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

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterState) => void;
  initialFilters: FilterState;
}

const { width } = Dimensions.get('window');

const FilterModal = ({ isVisible, onClose, onApplyFilter, initialFilters }: FilterModalProps) => {
  const [lokasi, setLokasi] = useState<Lokasi[]>([]);
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(initialFilters.location);
  const [selectedTime, setSelectedTime] = useState(initialFilters.time);
  const [selectedGender, setSelectedGender] = useState(initialFilters.gender);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(initialFilters.facilities);
  const [range, setRange] = useState([initialFilters.minPrice, initialFilters.maxPrice]);
  const [checkInDate, setCheckInDate] = useState<Date | null>(initialFilters.checkInDate);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(initialFilters.checkOutDate);

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
      checkInDate,
      checkOutDate,
    });
    onClose();
  };

  const handleConfirmCheckIn = (date: Date) => {
    setCheckInDate(date);
    setIsCheckInPickerVisible(false);
  };

  const handleConfirmCheckOut = (date: Date) => {
    setCheckOutDate(date);
    setIsCheckOutPickerVisible(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
            {/* isi filter sama persis seperti sebelumnya */}
          </ScrollView>

          {/* tombol bawah */}
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

export default FilterModal;

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
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
});
