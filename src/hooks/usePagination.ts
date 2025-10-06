"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  current_page: number;
  total_pages: number;
}

interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
  searchTerm?: string;
  debounceDelay?: number;
}

interface UsePaginationReturn<T> {
  data: T[];
  loading: boolean;
  error: string;
  pagination: PaginationInfo;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handlePageChange: (page: number) => void;
  refreshData: () => void;
}

const usePagination = <T>(
  endpoint: string,
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> => {
  const {
    initialPage = 1,
    pageSize = 10,
    searchTerm: initialSearchTerm = '',
    debounceDelay = 300
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    count: 0,
    next: null,
    previous: null,
    current_page: initialPage,
    total_pages: 1
  });
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);

  // Debounce search term - CLEAN VERSION
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  // Reset to page 1 when search term changes (after debounce)
  useEffect(() => {
    setPagination(prev => ({ ...prev, current_page: 1 }));
  }, [debouncedSearchTerm]);

  const fetchData = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(search && { search })
      });

      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle both paginated and non-paginated responses
      if (response.data.results) {
        setData(response.data.results);
        setPagination(prev => ({
          ...prev,
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          current_page: page,
          total_pages: Math.ceil(response.data.count / pageSize)
        }));
      } else {
        setData(Array.isArray(response.data) ? response.data : []);
        setPagination(prev => ({
          ...prev,
          count: Array.isArray(response.data) ? response.data.length : 0,
          next: null,
          previous: null,
          current_page: 1,
          total_pages: 1
        }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, pageSize]);

  // Fetch data when page or debounced search term changes
  useEffect(() => {
    fetchData(pagination.current_page, debouncedSearchTerm);
  }, [fetchData, pagination.current_page, debouncedSearchTerm]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const refreshData = () => {
    fetchData(pagination.current_page, debouncedSearchTerm);
  };

  return {
    data,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    refreshData
  };
};

export default usePagination;



// "use client";

// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// interface PaginationInfo {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   current_page: number;
//   total_pages: number;
// }

// interface UsePaginationOptions {
//   initialPage?: number;
//   pageSize?: number;
//   searchTerm?: string;
//   debounceDelay?: number;
// }

// interface UsePaginationReturn<T> {
//   data: T[];
//   loading: boolean;
//   error: string;
//   pagination: PaginationInfo;
//   searchTerm: string;
//   setSearchTerm: (term: string) => void;
//   handlePageChange: (page: number) => void;
//   refreshData: () => void;
// }

// const usePagination = <T>(
//   endpoint: string,
//   options: UsePaginationOptions = {}
// ): UsePaginationReturn<T> => {
//   const {
//     initialPage = 1,
//     pageSize = 10,
//     searchTerm: initialSearchTerm = '',
//     debounceDelay = 300
//   } = options;

//   const [data, setData] = useState<T[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     count: 0,
//     next: null,
//     previous: null,
//     current_page: initialPage,
//     total_pages: 1
//   });
//   const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);

//   // Debounce search term
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//       setPagination(prev => ({ ...prev, current_page: 1 })); // Reset to page 1 on search
//     }, debounceDelay);

//     return () => clearTimeout(timer);
//   }, [searchTerm, debounceDelay]);

//   const fetchData = useCallback(async (page: number = 1, search: string = '') => {
//     try {
//       setLoading(true);
//       setError('');

//       const params = new URLSearchParams({
//         page: page.toString(),
//         page_size: pageSize.toString(),
//         ...(search && { search })
//       });

//       const token = localStorage.getItem('accessToken');
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}?${params}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Handle both paginated and non-paginated responses
//       if (response.data.results) {
//         setData(response.data.results);
//         setPagination({
//           count: response.data.count,
//           next: response.data.next,
//           previous: response.data.previous,
//           current_page: page,
//           total_pages: Math.ceil(response.data.count / pageSize)
//         });
//       } else {
//         setData(Array.isArray(response.data) ? response.data : []);
//         setPagination({
//           count: Array.isArray(response.data) ? response.data.length : 0,
//           next: null,
//           previous: null,
//           current_page: 1,
//           total_pages: 1
//         });
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to load data');
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [endpoint, pageSize]);

//   useEffect(() => {
//     fetchData(pagination.current_page, debouncedSearchTerm);
//   }, [fetchData, pagination.current_page, debouncedSearchTerm]);

//   const handlePageChange = (page: number) => {
//     setPagination(prev => ({ ...prev, current_page: page }));
//   };

//   const refreshData = () => {
//     fetchData(pagination.current_page, debouncedSearchTerm);
//   };

//   return {
//     data,
//     loading,
//     error,
//     pagination,
//     searchTerm,
//     setSearchTerm,
//     handlePageChange,
//     refreshData
//   };
// };

// export default usePagination;