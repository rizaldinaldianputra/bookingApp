// // hooks/useKosData.ts
// import { useCallback, useEffect, useState } from 'react';
// import { KamarResponse as ApiKamarResponse, Kamar } from '../models/kossan';
// import { getKos } from '../service/kossan_service';

// export interface FilterState {
//   location: string;
//   time: string;
//   gender: string;
//   facilities: string[];
//   minPrice: number;
//   maxPrice: number;
//   search: string;
// }

// export function useKosData(initialFilters: FilterState) {
//   const [kosData, setKosData] = useState<Kamar[]>([]);
//   const [activeFilters, setActiveFilters] = useState<FilterState>(initialFilters);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const fetchKosData = useCallback(
//     async (page: number, filters: FilterState, isNewSearch: boolean = false) => {
//       if (isLoading && !isNewSearch) return;
//       if (!hasMore && page > 1 && !isNewSearch) return;

//       setIsLoading(true);

//       try {
//         const params: any = { current_page: page, per_page: 10 };
//         if (filters.search) params.search = filters.search;
//         if (filters.location) params.lokasi_kos = filters.location;
//         if (filters.gender) params.jenis_kos = filters.gender;
//         if (filters.facilities.length > 0) params.fasilitas = JSON.stringify(filters.facilities);
//         if (filters.minPrice > 0) params.min_harga = filters.minPrice;
//         if (filters.maxPrice < 10000000) params.max_harga = filters.maxPrice;

//         const response: ApiKamarResponse = await getKos(params);

//         if (response && response.success) {
//           if (response.data && response.data.length > 0) {
//             setKosData((prev) => (page === 1 ? response.data : [...prev, ...response.data]));
//             setCurrentPage(response.meta.current_page);
//             setHasMore(response.meta.current_page < response.meta.last_page);
//           } else {
//             if (page === 1) setKosData([]);
//             setHasMore(false);
//           }
//         } else {
//           setKosData([]);
//           setHasMore(false);
//         }
//       } catch (err) {
//         console.error('fetchKosData error', err);
//         setKosData([]);
//         setHasMore(false);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [isLoading, hasMore],
//   );

//   // Trigger fetch ketika filters berubah
//   useEffect(() => {
//     setKosData([]);
//     setCurrentPage(1);
//     setHasMore(true);
//     fetchKosData(1, activeFilters, true);
//   }, [activeFilters]);

//   const applyFilters = (newFilters: FilterState) => {
//     setActiveFilters(newFilters);
//   };

//   const handleSearchChange = (text: string) => {
//     setActiveFilters((prev) => ({ ...prev, search: text }));
//   };

//   const removeFilter = (label: string) => {
//     setActiveFilters((prev) => {
//       const newFilters = { ...prev };
//       if (newFilters.location === label) newFilters.location = '';
//       else if (newFilters.time === label) newFilters.time = '';
//       else if (newFilters.gender === label) newFilters.gender = '';
//       else if (label.startsWith('Rp ') && label.includes(' - Rp ')) {
//         newFilters.minPrice = 0;
//         newFilters.maxPrice = 10000000;
//       } else if (label.startsWith('Search: "') && label.endsWith('"')) newFilters.search = '';
//       else newFilters.facilities = newFilters.facilities.filter((f) => f !== label);
//       return newFilters;
//     });
//   };

//   const loadMore = () => {
//     if (hasMore && !isLoading) fetchKosData(currentPage + 1, activeFilters);
//   };

//   const getActiveFilterLabels = () => {
//     const labels: string[] = [];
//     if (activeFilters.location) labels.push(activeFilters.location);
//     if (activeFilters.time) labels.push(activeFilters.time);
//     if (activeFilters.gender) labels.push(activeFilters.gender);
//     activeFilters.facilities.forEach((f) => labels.push(f));
//     if (activeFilters.minPrice > 0 || activeFilters.maxPrice < 10000000)
//       labels.push(
//         `Rp ${activeFilters.minPrice.toLocaleString()} - Rp ${activeFilters.maxPrice.toLocaleString()}`,
//       );
//     if (activeFilters.search) labels.push(`Search: "${activeFilters.search}"`);
//     return labels;
//   };

//   return {
//     kosData,
//     activeFilters,
//     isLoading,
//     hasMore,
//     applyFilters,
//     handleSearchChange,
//     removeFilter,
//     loadMore,
//     getActiveFilterLabels,
//   };
// }
