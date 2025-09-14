// hooks/kossan.ts
import { Kamar } from '@/models/kossan';
import { getKos } from '@/service/kossan_service';
import { useEffect, useState } from 'react';
export interface FilterState {
  location: string;
  time: string;
  gender: string;
  facilities: string[];
  minPrice: number;
  maxPrice: number;
  search: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
}

export function useKosData(filters: FilterState) {
  const [kosData, setKosData] = useState<Kamar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await getKos(filters); // API service kamu
      setKosData(response.data);
    } catch (e) {
      console.error('Error getKos:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMoreData();
  }, [filters]);

  return { kosData, isLoading, hasMore, loadMoreData };
}
