import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface UpdatePatronData {
  Name?: string;
  Email?: string;
  Phone?: string;
  Address?: string;
  MembershipType?: string;
}

export function useUpdatePatron() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patronId, data }: { patronId: string; data: UpdatePatronData }) => {
      return await request(`/api/inft3050/Patrons/${patronId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
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
