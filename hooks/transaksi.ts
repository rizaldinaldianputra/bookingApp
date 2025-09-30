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
        const parsedData = response.data.map((item) => {
          // Pastikan kamar ada
          const kamar = item.kamar || {};

          // Parsing fasilitas_ids dengan aman
          let fasilitasArray: string[] = [];
          if (kamar.fasilitas_ids) {
            try {
              fasilitasArray = Array.isArray(kamar.fasilitas_ids)
                ? kamar.fasilitas_ids
                : JSON.parse(kamar.fasilitas_ids);
            } catch {
              fasilitasArray = [];
            }
          }

          return {
            ...item,
            kamar: {
              ...kamar,
              fasilitas_ids: fasilitasArray,
            },
          };
        });

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
