import { colors } from '@/constants/colors';
import { KatalogProductById } from '@/models/katalogproductbyid';
import { getProductById, postTransaksiProduct } from '@/service/product_service';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';

const { width } = Dimensions.get('window');

export default function DetailProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const [product, setProduct] = useState<KatalogProductById | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      getProductById(id).then((res) => {
        setProduct(res.data); // res = { success, data }, jadi ambil .data
        if (res.data.gambar && res.data.gambar.length > 0) {
          setSelectedImage(res.data.gambar[0].url_gambar);
        }
      });
    }
  }, [id]);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image Section */}
        <View style={styles.mainImageContainer}>
          <Image
            source={{ uri: selectedImage || 'https://via.placeholder.com/300' }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          {/* Header over Main Image */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Feather name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Feather name="heart" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Produk and Thumbnails */}
        <View style={styles.contentCard}>
          {/* Thumbnail Carousel */}
          <FlatList
            data={product.gambar || []}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailList}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => setSelectedImage(item.url_gambar)}
                style={{ marginRight: 8 }}
              >
                <Image
                  source={{ uri: item.url_gambar }}
                  style={[
                    styles.thumbnail,
                    selectedImage === item.url_gambar && styles.thumbnailSelected,
                  ]}
                />
                {index === 4 && product.gambar && product.gambar.length > 5 && (
                  <View style={styles.moreImagesOverlay}>
                    <Text style={styles.moreImagesText}>+{product.gambar.length - 5}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />

          <View style={styles.infoContainer}>
            <Text style={styles.productName}>{product.judul_produk}</Text>
            <Text style={styles.price}>Rp{product.harga},-</Text>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.description}>
              Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry's standard dummy text ever since the 1500s, when an{' '}
              <Text style={styles.readMore}>lihat selengkapnya</Text>
              {/* Anda bisa menggunakan product.deskripsi di sini jika datanya sudah sesuai */}
              {/* {product.deskripsi} */}
            </Text>

            {/* Quantity */}
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantityBox}>
                <TouchableOpacity onPress={decreaseQty} style={styles.quantityBtn}>
                  <Text style={styles.quantityBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={increaseQty} style={styles.quantityBtn}>
                  <Text style={styles.quantityBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Bottom Buttons */}

      <SafeAreaView edges={['bottom']}>
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            onPress={async () => {
              try {
                const response = await postTransaksiProduct({
                  id_user: 1,
                  id_produk: 1,
                  jumlah: 3,
                  harga_satuan: 75000,
                  subtotal: 225000,
                  tanggal_transaksi: '2025-08-26 14:35:00',
                  status: 'belum_lunas',
                });

                toast.show(`${response.message}\nNo. Order: ${response.data.no_order}`, {
                  type: 'success',
                  placement: 'bottom',
                });

                router.replace('/home/main');
              } catch (error: any) {
                console.error('Gagal post transaksi:', error);

                const errMsg = error.response?.data?.message || 'Transaksi tidak dapat diproses';

                toast.show(errMsg, {
                  type: 'danger',
                  placement: 'bottom',
                });
              }
            }}
            style={styles.buyNow}
          >
            <Text style={styles.buyNowText}>Buy now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
  },
  mainImageContainer: {
    width: '100%',
    height: 350, // Tinggi gambar utama
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 50, // Sesuaikan posisi header dari atas
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  headerButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20, // Untuk membuat card sedikit overlap dengan gambar
    paddingTop: 16,
    paddingHorizontal: 16,
    flex: 1,
    paddingBottom: 20, // Memberi ruang di bawah untuk tombol
  },
  thumbnailList: {
    paddingVertical: 10,
    marginBottom: 10,
    justifyContent: 'center', // Agar thumbnail berada di tengah jika jumlahnya sedikit
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  thumbnailSelected: {
    borderColor: '#344e41', // Warna border saat terpilih
    borderWidth: 2,
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    paddingVertical: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#344e41', // Warna hijau gelap
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 20,
  },
  readMore: {
    color: '#344e41',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    overflow: 'hidden',
  },
  quantityBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  quantityBtnText: {
    fontSize: 20,
    color: '#555555',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    paddingHorizontal: 12,
  },
  bottomButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  favButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCart: {
    flex: 1,
    backgroundColor: '#344e41', // Warna hijau gelap
    borderRadius: 10,
    paddingVertical: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buyNow: {
    flex: 1,
    backgroundColor: colors.primary, // Warna hijau yang lebih terang untuk "Buy Now"
    borderRadius: 10,
    paddingVertical: 14,
    marginLeft: 8,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
