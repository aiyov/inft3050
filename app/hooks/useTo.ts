import { useQuery } from '@tanstack/react-query';
import { request } from '@/app/lib/request';

export interface ToDetail {
  CustomerID: number;
  PatronId: number;
  Email: string;
  PhoneNumber: string | null;
  StreetAddress: string | null;
  PostCode: string | null;
  Suburb: string | null;
  State: string | null;
  CardNumber: string;
  CardOwner: string;
  Expiry: string;
  CVV: number;
  Patrons: {
    UserID: number;
    Email: string;
  };
}

export function useTo(rowId: string | number) {
  return useQuery({
    queryKey: ['to', rowId],
    queryFn: async () => {
      return await request<ToDetail>(`/api/inft3050/TO/${rowId}`);
    },
    enabled: !!rowId,
  });
}

export default useTo;
