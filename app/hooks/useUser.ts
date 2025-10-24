import { useQuery } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface UserDetail {
  UserID: number;
  UserName: string;
  Email: string;
  Name: string;
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      return await request<UserDetail>(`/api/inft3050/User/${userId}`);
    },
    enabled: !!userId,
  });
}

export default useUser;
