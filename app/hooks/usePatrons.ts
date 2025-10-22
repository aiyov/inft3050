import { useQuery } from '@tanstack/react-query';
import { request } from '@/app/lib/request';
import { useState, useMemo } from 'react';

export interface Patron {
  ID: number;
  Name: string;
  Email: string;
  Phone: string;
  Address: string;
  MembershipType: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface PageInfo {
  totalRows: number;
  page: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface PatronsResponse {
  list: Patron[];
  pageInfo: PageInfo;
}

export interface UsePatronsParams {
  fields?: string;
  where?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}

export function usePatrons(params: UsePatronsParams = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = params.limit || 25;
  
  const queryParams = useMemo(() => {
    const offset = (currentPage - 1) * pageSize;
    return {
      ...params,
      limit: pageSize,
      offset,
    };
  }, [params, currentPage, pageSize]);

  const query = useQuery({
    queryKey: ['patrons', queryParams],
    queryFn: async () => {
      return await request<PatronsResponse>('/api/inft3050/Patrons', {
        params: queryParams,
      });
    },
  });

  const getNextPage = () => {
    if (query.data?.pageInfo && !query.data.pageInfo.isLastPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const getPrevPage = () => {
    if (query.data?.pageInfo && !query.data.pageInfo.isFirstPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    ...query,
    data: query.data?.list || [],
    pageInfo: query.data?.pageInfo,
    currentPage,
    getNextPage,
    getPrevPage,
    isLoading: query.isLoading,
  };
}

export default usePatrons;
