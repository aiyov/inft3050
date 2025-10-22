import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface UpdateProductData {
  Name?: string;
  Author?: string;
  Description?: string;
  SubGenre?: number;
  LastUpdatedBy?: string;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: UpdateProductData }) => {
      return await request(`/api/inft3050/Product/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
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
