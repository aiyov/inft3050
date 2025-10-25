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

function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string | number) => {
      return await request(`/api/inft3050/Orders/${orderId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export default useDeleteOrder;
