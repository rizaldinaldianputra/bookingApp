import { colors } from '@/constants/colors';
import { BASE_URL } from '@/constants/config';
import { KatalogProduct, KatalogProductResponse } from '@/models/katalogproduct';
import { getProduct } from '@/service/product_service';
import { router, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const renderProductItem = ({ item }: { item: KatalogProduct }) => {
  const displayedPrice = parseFloat(item.harga || '0');
  const imageUrl =
    item.gambar && item.gambar.length > 0
      ? `${BASE_URL}/${item.gambar[0].url_gambar}`
      : 'https://placehold.co/600x400';

  return (
    <TouchableOpacity
      onPress={() => router.push(`/home/product/product_detail?id=${item.id_produk}`)}
    >
      <View style={styles.productCard}>
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.judul_produk}</Text>
          <Text style={styles.productPrice}>Rp {displayedPrice.toLocaleString('id-ID')},-</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ProductList() {
  const [productData, setProductData] = useState<KatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchProductData = useCallback(async (search?: string) => {
    setIsLoading(true);
    try {
      const response: KatalogProductResponse = await getProduct(search);
      if (response && response.success) {
        setProductData(response.data || []);
      } else {
        setProductData([]);
      }
    } catch (error) {
      console.error(error);
      setProductData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch awal tanpa search
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  // Debounce search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProductData(searchText);
    }, 500); // delay 500ms

    return () => clearTimeout(delayDebounce);
  }, [searchText, fetchProductData]);

  const renderFooter = () => (isLoading && productData.length > 0 ? <View></View> : null);

  const navigation = useNavigation();

  return (
    <View style={styles.fullScreenContainer}>
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Katalog Produk</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari produk..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <FlatList
        data={productData}
        renderItem={renderProductItem}
        keyExtractor={(item, index) =>
          item.id_produk ? item.id_produk.toString() : `item-${index}`
        }
        contentContainerStyle={styles.listContentContainer}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading && productData.length === 0 ? (
            <Text style={styles.emptyText}>Tidak ada produk yang ditemukan.</Text>
          ) : isLoading && productData.length === 0 ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
          ) : null
        }
      />
    </View>
  );
}

// Styles tetap sama
const styles = StyleSheet.create({
  fullScreenContainer: { flex: 1, backgroundColor: '#F9FAFB' },
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
    marginBottom: 10,
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
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: (width - 60) / 2,
    marginHorizontal: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },
  productDetails: { padding: 10 },
  productName: { fontSize: 14, fontWeight: '500', color: '#1F2937', marginBottom: 5 },
  productPrice: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  listContentContainer: { paddingHorizontal: 10, paddingTop: 20, paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  footerLoader: { paddingVertical: 20, alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#9CA3AF' },
});
