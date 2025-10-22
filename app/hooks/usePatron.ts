import { useQuery } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface PatronDetail {
  ID: number;
  Name: string;
  Email: string;
  Phone: string;
  Address: string;
  MembershipType: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export function usePatron(patronId: string) {
  return useQuery({
    queryKey: ['patron', patronId],
    queryFn: async () => {
      return await request<PatronDetail>(`/api/inft3050/Patrons/${patronId}`);
    },
    enabled: !!patronId,
  });
}

export default usePatron;
