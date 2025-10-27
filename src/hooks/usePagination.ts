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
  handleSearchSubmit: () => void; 
  isClientSideSearch: boolean; 
  
}

const usePagination = <T>(
  endpoint: string,
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> => {
  const {
    initialPage = 1,
    pageSize = 10,
    searchTerm: initialSearchTerm = '',
  } = options;

  const [allData, setAllData] = useState<T[]>([]);
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
  const [apiSearchTerm, setApiSearchTerm] = useState('');
  const [isClientSideSearch, setIsClientSideSearch] = useState(true);

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

      if (response.data.results) {
        setAllData(response.data.results);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          current_page: page,
          total_pages: Math.ceil(response.data.count / pageSize)
        });
      } else {
        setAllData(Array.isArray(response.data) ? response.data : []);
        setPagination({
          count: Array.isArray(response.data) ? response.data.length : 0,
          next: null,
          previous: null,
          current_page: 1,
          total_pages: 1
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
      setAllData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, pageSize]);

  useEffect(() => {
    if (isClientSideSearch) {
      fetchData(pagination.current_page);
    } else {
      fetchData(1, apiSearchTerm);
    }
  }, [fetchData, pagination.current_page, isClientSideSearch, apiSearchTerm]);

  const clientSideFilteredData = searchTerm.trim() 
    ? allData.filter((exam: any) => 
        exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.teacher?.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.teacher?.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allData;

  const displayData = isClientSideSearch ? clientSideFilteredData : allData;

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const refreshData = () => {
    fetchData(pagination.current_page, isClientSideSearch ? '' : apiSearchTerm);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      setApiSearchTerm(searchTerm.trim());
      setIsClientSideSearch(false);
      setPagination(prev => ({ ...prev, current_page: 1 }));
    } else {
      setApiSearchTerm('');
      setIsClientSideSearch(true);
      fetchData(1);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim() && !isClientSideSearch) {
      setApiSearchTerm('');
      setIsClientSideSearch(true);
      fetchData(1);
    }
  }, [searchTerm, isClientSideSearch, fetchData]);

  return {
    data: displayData,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    refreshData,
    handleSearchSubmit, 
    isClientSideSearch 
  };
};

export default usePagination;