import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export function useDeletePatron() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patronId: string) => {
      return await request(`/api/inft3050/Patrons/${patronId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      // 使相关查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['patrons'] });
      queryClient.invalidateQueries({ queryKey: ['patron'] });
    },
  });
}

export default useDeletePatron;
