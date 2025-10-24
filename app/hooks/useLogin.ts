import { useMutation } from '@tanstack/react-query';
import { request } from '@/app/lib/request';
import { LoginResponse } from '../lib/api-services';


export function useLogin() {
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return await request(`/login`, {
        method: 'POST',
        body: {
          username: data.username,
          password: data.password,
        },
      });
    }
  });
}

export default useLogin;
