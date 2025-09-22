// hooks/kossan.ts
import { FilterState } from '@/components/ui/FilterModalComponent';
import { Kamar } from '@/models/kossan';
import { getKos } from '@/service/kossan_service';
import { useEffect, useState } from 'react';

export function useKosData(filters: FilterState) {
  const [kosData, setKosData] = useState<Kamar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await getKos({
        ...filters,
        start_date: filters.start_date ?? undefined,
        end_date: filters.end_date ?? undefined,
      });
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
