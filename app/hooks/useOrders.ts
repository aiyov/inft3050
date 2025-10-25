import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface Order {
  OrderID: number;
  Customer: number;
  StreetAddress: string;
  PostCode: number;
  Suburb: string;
  State: string;
  TO: {
    CustomerID: number;
    PatronId: number;
  };
  "Stocktake List": Array<{
    ItemId: number;
    SourceId: number;
  }>;
  "ProductsInOrders List": Array<{
    OrderId: number;
  }>;
}

export interface PageInfo {
  totalRows: number;
  page: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface OrdersResponse {
  list: Order[];
  pageInfo: PageInfo;
}

export interface UseOrdersParams {
  limit?: number;
  offset?: number;
  fields?: string;
  where?: string;
}

function useOrders(params: UseOrdersParams = {}) {
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
    queryKey: ['orders', queryParams],
    queryFn: async () => {
      return await request<OrdersResponse>('/api/inft3050/Orders', {
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

export default useOrders;
