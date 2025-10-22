import { useQuery } from '@tanstack/react-query';
import { request } from '@/app/lib/request';
import { useState, useMemo } from 'react';

export interface User {
  ID: number;
  Username: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Role: string;
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

export interface UsersResponse {
  list: User[];
  pageInfo: PageInfo;
}

export interface UseUsersParams {
  fields?: string;
  where?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}

export function useUsers(params: UseUsersParams = {}) {
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
    queryKey: ['users', queryParams],
    queryFn: async () => {
      return await request<UsersResponse>('/api/inft3050/User', {
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

export default useUsers;
