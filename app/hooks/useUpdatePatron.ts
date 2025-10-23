import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface UpdatePatronData {
  UserID?: number;
  Name?: string;
  Email?: string;
  Salt?: string;
  HashPW?: string;
}

export function useUpdatePatron() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patronId, data }: { patronId: string; data: UpdatePatronData }) => {
      return await request(`/api/inft3050/Patrons/${patronId}`, {
        method: 'PATCH',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: (_, { patronId }) => {
      // 使相关查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['patron', patronId] });
      queryClient.invalidateQueries({ queryKey: ['patrons'] });
    },
  });
}

export default useUpdatePatron;
