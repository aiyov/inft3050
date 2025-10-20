import { useQuery } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface Genre {
  Name: string;
  GenreID: number;
}

export function useGenres() {
  return useQuery({
    queryKey: ['genres', 'Name,GenreID'],
    queryFn: async () => {
      return await request<{list: Genre[]}>('/api/inft3050/Genre', {
        params: { fields: 'Name,GenreID' },
      });
    },
  });
}

export default useGenres;


