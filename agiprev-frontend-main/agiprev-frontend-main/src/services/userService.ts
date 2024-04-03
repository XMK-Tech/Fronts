import { ENABLE_MIDDLEWARE } from '../environment';
import { useQuery } from '@tanstack/react-query';
import { getResp, Middleware } from './Api';
import { SortDirection } from './RevenueService';

export type userResp = {
  username: string;
  fullName: string;
  fullname?: string;
  secondaryPhoneNumber: string;
  phoneNumber: string;
  document: string;
  email: string;
  status: true;
  isVerified: true;
  logCount: number;
  id: string;
  lastLogin: Date;
  createdAt: string;
};

export type User = {
  id?: string;
  fullName: string;
  email: string;
  document: string;
  agiprevCode: string;
};

export function useUser(
  page: number,
  pageSize: number | null,
  search: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  entityId: string,
  fullName: string,
  email: string
) {
  return useQuery(
    [`userList`, page, search, direction, sort, entityId, fullName, email],
    async () => {
      const resp = await Middleware.get(`/user`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          EntityId: entityId,
          FullName: fullName || search,
          Email: email,
        },
      });
      return resp.data.content;
    },
    {
      enabled: ENABLE_MIDDLEWARE,
    }
  );
}

export function useUserId(id?: string) {
  return useQuery(
    [`user`, id],
    async () => {
      const resp = await Middleware.get(`/user/${id}`);
      return getResp<userResp>(resp);
    },
    { enabled: !!id }
  );
}
