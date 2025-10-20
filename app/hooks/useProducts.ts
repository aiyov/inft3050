import { useQuery } from '@tanstack/react-query';
import { request } from '@/app/lib/request';
import { useState, useMemo } from 'react';

export interface Product {
  ID: number;
  Name: string;
  Author: string;
  Description: string;
  SubGenre: number;
  LastUpdatedBy: string;
  LastUpdated: string;
}

export interface PageInfo {
  totalRows: number;
  page: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface ProductsResponse {
  list: Product[];
  pageInfo: PageInfo;
}

export interface UseProductsParams {
  fields?: string;
  where?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}

export function useProducts(params: UseProductsParams = {}) {
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
    queryKey: ['products', queryParams],
    queryFn: async () => {
      return await request<ProductsResponse>('/api/inft3050/Product', {
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

export default useProducts;
