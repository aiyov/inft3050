import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface UserSignUpData {
  UserName: string;
  Email: string;
  Name: string;
  IsAdmin: boolean;
  Salt: string;
  HashPW: string;
}

export interface UserSignUpResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export function useUserSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserSignUpData) => {
      return await request<UserSignUpResponse>('/api/inft3050/User', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
    },
  });
}

export default useUserSignUp;
