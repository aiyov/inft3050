import { useQuery } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface UserDetail {
  ID: number;
  Username: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Role: string;
  CreatedAt: string;
  UpdatedAt: string;
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
