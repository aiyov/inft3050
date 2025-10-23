import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface CreateProductData {
  Name: string;
  Author: string;
  Description: string;
  SubGenre: number;
  LastUpdatedBy: string;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductData) => {
      return await request(`/api/inft3050/Product`, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: (_, { productId }) => {
      // 使相关查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export default useUpdateProduct;
