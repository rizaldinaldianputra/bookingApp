import CustomButton from '@/components/ui/button';
import { useTicket } from '@/hooks/ticket';
import { User } from '@/models/user';
import { getUsers } from '@/service/user_service';
import { formatDate } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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
// --- AppBar Component ---
const AppBar = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <View style={appBarStyles.appBar}>
      <TouchableOpacity onPress={() => router.back()} style={appBarStyles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#a4a4a4ff" />
      </TouchableOpacity>
      <Text style={appBarStyles.appBarTitle}>{title}</Text>
      {/* For spacing - this comment is now outside any problematic JSX */}
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
    paddingVertical: 12, // Adjust padding
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginLeft: -8, // Adjust to visually align icon with screen edge
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
    width: 40, // Match back button width for balanced spacing
  },
});

// --- TransaksiList Component ---
export default function TicketList() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUsers();
        setUser(data.user); // ambil user dari data.user
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const { data, loading, error, refetch } = useTicket(user?.id?.toString() || '');
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (item: any) =>
        item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.created_at?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.admin_response?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const itemsPerPageNum = parseInt(itemsPerPage, 10);
  // Ensure totalPages is at least 1, even if filteredData is empty
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPageNum));
  const indexOfLastItem = currentPage * itemsPerPageNum;
  const indexOfFirstItem = indexOfLastItem - itemsPerPageNum;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>#{item.title}</Text>
      <Text style={styles.cell}>{formatDate(item.created_at)}</Text>
      <Text style={styles.cell}>{item.admin_response}</Text>
      <TouchableOpacity
        style={styles.actionCell}
        onPress={() =>
          router.push({
            pathname: '/home/profile/ticket/ticket_detail',
            params: {
              data: JSON.stringify(item), // kirim object sebagai string
            },
          })
        }
      >
        <Ionicons name="eye-outline" size={20} />
      </TouchableOpacity>
    </View>
  );

  if (!user || loading) {
    return (
      <SafeAreaView style={styles.fullScreenCenter}>
        <AppBar title="Daftar Ticket" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.fullScreenCenter}>
        <AppBar title="Daftar Ticket" />
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
      <AppBar title="Daftar Ticket" />

      <View style={styles.container}>
        <View style={styles.controlsContainer}>
          <View style={styles.showEntriesWrapper}>
            <Text style={styles.showEntriesText}>Show</Text>
            <View style={styles.pickerWrapper}>
              {/* Added Text component to display selected value */}
              <Text style={styles.pickerSelectedText}>{itemsPerPage}</Text>
              <Picker
                selectedValue={itemsPerPage}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setItemsPerPage(itemValue);
                  setCurrentPage(1);
                }}
              >
                <Picker.Item label="10" value="10" />
                <Picker.Item label="25" value="25" />
                <Picker.Item label="50" value="50" />
                <Picker.Item label="100" value="100" />
              </Picker>
              {/* Optional: Add a dropdown icon */}
              <Ionicons name="chevron-down" size={16} color="#555" style={styles.pickerIcon} />
            </View>
            <Text style={styles.showEntriesText}>entries</Text>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchTerm}
              onChangeText={(text) => {
                setSearchTerm(text);
                setCurrentPage(1);
              }}
            />
          </View>
        </View>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.headerText]}>No Ticket</Text>
          <Text style={[styles.cell, styles.headerText]}>Date</Text>
          <Text style={[styles.cell, styles.headerText]}>Kamar</Text>
          <Text style={[styles.cell, styles.headerText]}>Action</Text>
        </View>
        {/* FlatList needs flex: 1 to properly scroll within its parent */}
        <FlatList
          data={currentItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
          style={styles.flatListContent} // Add this style
          contentContainerStyle={styles.flatListPadding} // Optional: for inner padding
        />
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={goToPreviousPage}
            disabled={currentPage === 1}
            style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
          >
            <Text style={styles.paginationButtonText}>Previous</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumberText}>
            Page {currentPage} of {totalPages}
          </Text>
          <TouchableOpacity
            onPress={goToNextPage}
            disabled={currentPage === totalPages}
            style={[
              styles.paginationButton,
              currentPage === totalPages && styles.paginationButtonDisabled,
            ]}
          >
            <Text style={styles.paginationButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
        <View>
          <CustomButton
            onPress={() => router.replace('/home/profile/ticket/ticket_submit')}
            title="Open Ticket"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    // New style for the root container to take full height
    flex: 1,
    backgroundColor: '#f8f8f8', // Consistent background
  },
  fullScreenCenter: {
    // For loading/error screens with app bar
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    margin: 16,
    marginBottom: 50,
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1, // Make the main content container also flexible
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,

    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  showEntriesWrapper: { flexDirection: 'row', alignItems: 'center' },
  showEntriesText: { fontSize: 13, color: '#555', marginHorizontal: 4 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    height: 30,
    width: 80, // Fixed width for picker wrapper
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative', // For absolute positioning of picker
  },
  pickerSelectedText: {
    position: 'absolute',
    left: 10, // Adjust as needed
    fontSize: 13,
    color: '#555',
    zIndex: 1, // Ensure text is above the hidden picker
    pointerEvents: 'none', // Allow touches to pass through to picker
  },
  picker: {
    width: '100%', // Take full width of wrapper
    height: 30,
    color: 'transparent', // Make the picker text transparent
    position: 'absolute', // Position over the displayed text
    opacity: 0, // Make it invisible but interactive
    // Ensure it's clickable on iOS/Android
  },
  pickerIcon: {
    position: 'absolute',
    right: 8,
    zIndex: 1,
    pointerEvents: 'none', // Allow touches to pass through to picker
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 30,
    width: 150,
  },
  searchIcon: { marginRight: 5 },
  searchInput: { flex: 1, fontSize: 13, paddingVertical: 0 },
  row: { flexDirection: 'row', paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff' },
  header: {
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  headerText: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  cell: { flex: 1, textAlign: 'center', fontSize: 13, color: '#555' },
  actionCell: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 0 },
  separator: { height: 1, backgroundColor: '#eee' },
  center: {
    flex: 1, // Ensure center takes available space to center its content
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: { marginTop: 8, padding: 8, backgroundColor: '#007bff', borderRadius: 4 },
  buttonText: { color: '#fff', fontSize: 14 },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  paginationButtonDisabled: { backgroundColor: '#f0f0f0' },
  paginationButtonText: { color: '#333', fontSize: 13 },
  pageNumberText: { fontSize: 13, color: '#555' },
  emptyText: { textAlign: 'center', paddingVertical: 20, color: '#888', fontSize: 14 },
  flatListContent: {
    // Style for the FlatList itself to allow scrolling
    flex: 1,
  },
  flatListPadding: {
    // Style for content *inside* FlatList (optional)
    paddingHorizontal: 0,
    paddingBottom: 10, // Give some bottom padding if needed
  },
});
