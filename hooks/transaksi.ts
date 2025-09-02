import { Transaksi } from '@/models/transansaksi';
import { getTransaksi } from '@/service/transaksi_service';
import { useEffect, useState } from 'react';

export const useTransaksi = (userId: string) => {
  const [data, setData] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaksi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransaksi(userId);
      if (response.success) {
        // parsing fasilitas_ids yang awalnya string menjadi array
        const parsedData = response.data.map((item) => ({
          ...item,
          kamar: {
            ...item.kamar,
            fasilitas_ids: JSON.parse(item.kamar.fasilitas_ids as unknown as string) as string[],
          },
        }));

        setData(parsedData);
      } else {
        setError(response.message || 'Gagal mengambil data transaksi');
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
