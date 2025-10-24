import { useMutation } from '@tanstack/react-query';
import { request } from '@/app/lib/request';
import { LoginResponse } from '../lib/api-services';


export function useLogin() {

  return useMutation({
    mutationFn: async () => {
      return await request(`/logout`, {
        method: 'POST',
        body: {},
      });
    }
  });
}

export default useLogin;
