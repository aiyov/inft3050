import { useQuery } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface ProductDetail {
  ID: number;
  Name: string;
  Author: string;
  Description: string;
  SubGenre: number;
  LastUpdatedBy: string;
  LastUpdated: string;
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      return await request<ProductDetail>(`/api/inft3050/Product/${productId}`);
    },
    enabled: !!productId,
  });
}

export default useProduct;
