import { TransaksiProduk } from '@/models/product';
import { getTransaksiProduct } from '@/service/product_service';
import { useEffect, useState } from 'react';

export const useTransaksiProduct = (userId: string) => {
  const [data, setData] = useState<TransaksiProduk[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaksi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransaksiProduct(userId);
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || 'Gagal mengambil data transaksi produk');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTransaksi();
    }
  }, [userId]);

  return { data, loading, error, refetch: fetchTransaksi };
};
