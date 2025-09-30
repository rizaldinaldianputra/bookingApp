import { BASE_URL } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TicketDetailProps {
  id: number;
  title: string;
  description: string;
  image: string | null;
  category: string;
  status: string;
  admin_response?: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

const AppBar = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <View style={appBarStyles.appBar}>
      <TouchableOpacity onPress={() => router.back()} style={appBarStyles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#a4a4a4ff" />
      </TouchableOpacity>
      <Text style={appBarStyles.appBarTitle}>{title}</Text>
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
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  appBarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  rightPlaceholder: {
    width: 40,
  },
});

export default function TicketDetail() {
  const { data } = useLocalSearchParams();
  const ticket: TicketDetailProps = data
    ? JSON.parse(data as string)
    : {
        id: 0,
        title: '',
        description: '',
        image: null,
        category: '',
        status: '',
        admin_response: null,
        user_id: 0,
        created_at: '',
        updated_at: '',
      };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <AppBar title="Detail Ticket" />

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.rowHeader}>
            <Text style={styles.name}>{ticket.title}</Text>
            <View
              style={[
                styles.statusContainer,
                ticket.status?.toLowerCase() === 'open' && styles.open,
                ticket.status?.toLowerCase() === 'resolved' && styles.resolved,
              ]}
            >
              <Text style={styles.statusText}>{ticket.status}</Text>
            </View>
          </View>

          {ticket.image && (
            <Image
              source={{ uri: BASE_URL + '/img/tickets/' + ticket.user_id + '/' + ticket.image }}
              style={styles.image}
              resizeMode="contain"
            />
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Kategori</Text>
            <Text style={styles.value}>{ticket.category}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Deskripsi</Text>
            <Text style={styles.value}>{ticket.description}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Respon Admin</Text>
            <Text style={styles.value}>{ticket.admin_response ? ticket.admin_response : '-'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tanggal Dibuat</Text>
            <Text style={styles.value}>{ticket.created_at}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  open: {
    backgroundColor: '#ffe5b4',
  },
  resolved: {
    backgroundColor: '#e0f7e9',
  },
  statusText: {
    fontSize: 12,
    color: '#34a853',
  },
  row: {
    marginBottom: 12,
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'left',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
});
