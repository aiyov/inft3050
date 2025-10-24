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
    },
    onSuccess: () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      window.location.reload();
    },
  });
}

export default useLogin;
