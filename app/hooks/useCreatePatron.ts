import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface CreatePatronData {
  Name: string;
  Email: string;
  Salt: string;
  HashPW: string;
}

export function useCreatePatron() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePatronData) => {
      return await request('/api/inft3050/Patrons', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      // 使相关查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['patrons'] });
    },
  });
}

export default useCreatePatron;
