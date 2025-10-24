import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface UpdateUserData {
  Username?: string;
  Email?: string;
  FirstName?: string;
  LastName?: string;
  Role?: string;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdateUserData }) => {
      return await request(`/api/inft3050/User/${userId}`, {
        method: 'PATCH',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: (_, { userId }) => {
      // 使相关查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export default useUpdateUser;
