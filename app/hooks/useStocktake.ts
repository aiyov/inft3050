import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface StocktakeDetail {
  ItemId: number;
  SourceId: number;
  ProductId: number;
  Quantity: number;
  Price: number;
  Product: {
    ID: number;
    Name: string;
  };
}

export function useStocktake(rowId: string | number) {
  return useQuery({
    queryKey: ['stocktake', rowId],
    queryFn: async () => {
      return await request<StocktakeDetail>(`/api/inft3050/Stocktake/${rowId}`);
    },
    enabled: !!rowId,
  });
}

export function useDeleteStocktake() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rowId: string | number) => {
      return await request(`/api/inft3050/Stocktake/${rowId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocktake'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export default useStocktake;
