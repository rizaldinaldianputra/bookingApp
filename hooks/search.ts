import { useCallback, useEffect, useState } from 'react';
import { KamarResponse as ApiKamarResponse, Kamar } from '../models/kossan';
import { getKos } from '../service/kossan_service';

export interface FilterState {
  location: string;
  time: string;
  gender: string;
  facilities: string[];
  minPrice: number;
  maxPrice: number;
  search: string;
}

export const useSearchHook = () => {
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    location: '',
    time: '',
    gender: '',
    facilities: [],
    minPrice: 0,
    maxPrice: 10000000,
    search: '',
  });

  const [kosData, setKosData] = useState<Kamar[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchKosData = useCallback(
    async (page: number, filters: FilterState, isNewSearch: boolean = false) => {
      if (isLoading && !isNewSearch) return;
      if (!hasMore && page > 1 && !isNewSearch) return;

      setIsLoading(true);

      try {
        const params: any = { current_page: page, per_page: 10 };
        if (filters.search) params.search = filters.search;
        if (filters.location) params.lokasi_kos = filters.location;
        if (filters.gender) params.jenis_kos = filters.gender;
        if (filters.facilities.length > 0) params.fasilitas = JSON.stringify(filters.facilities);
        if (filters.minPrice > 0) params.min_harga = filters.minPrice;
        if (filters.maxPrice < 10000000) params.max_harga = filters.maxPrice;

        const response: ApiKamarResponse = await getKos(params);

        if (response && response.success) {
          if (response.data && response.data.length > 0) {
            setKosData((prevData) =>
              page === 1 ? response.data : [...prevData, ...response.data],
            );
            setCurrentPage(response.meta.current_page);
            setHasMore(response.meta.current_page < response.meta.last_page);
          } else {
            if (page === 1) setKosData([]);
            setHasMore(false);
          }
        } else {
          setKosData([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error(error);
        setKosData([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore],
  );

  useEffect(() => {
    setKosData([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchKosData(1, activeFilters, true);
  }, [activeFilters]);

  const handleApplyFilter = (newFilters: FilterState) => {
    setActiveFilters(newFilters);
  };

  const handleSearchChange = (text: string) => {
    setActiveFilters((prev) => ({ ...prev, search: text }));
  };

  const handleSearchSubmit = () => {
    setActiveFilters((prev) => ({ ...prev, search: prev.search }));
  };

  const loadMoreData = () => {
    if (hasMore && !isLoading) fetchKosData(currentPage + 1, activeFilters);
  };

  return {
    isFilterModalVisible,
    setFilterModalVisible,
    activeFilters,
    setActiveFilters,
    kosData,
    isLoading,
    hasMore,
    fetchKosData,
    handleApplyFilter,
    handleSearchChange,
    handleSearchSubmit,
    loadMoreData,
  };
};
