import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/app/lib/request';


export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return await request(`/login`, {
        method: 'POST',
        body: {
          username: data.username,
          password: data.password,
        },
      });
    },
    onSuccess: (data:any) => {
      localStorage.setItem('isLoggedIn', 'true');
      // queryClient.invalidateQueries({ queryKey: ['users'] });
      // queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export default useDeleteUser;
