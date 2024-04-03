import { ENABLE_MIDDLEWARE } from './../environment';
import { useQuery } from '@tanstack/react-query';
import { Middleware, getResp, getRespContent } from './Api';
import { SortDirection } from './RevenueService';
import { ListResp } from './StateServices';

export type AccessProfilePermissionsResp = {
  id: string;
  name: string;
  description: string;
  isSelected?: boolean;
};

export type AccessProfileResp = {
  id: string;
  name: string;
  description: string;
  ownerProfileName: null;
  permissions: AccessProfilePermissionsResp[];
};

export type AccessProfile = {
  id: string;
  name: string;
  description: string;
  ownerProfileId: null;
  permissionsId: string[];
};

export function useAccessProfile(
  page: number,
  pageSize: number | null,
  search: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  name: string
) {
  return useQuery(
    [`accessPermissionList`, page, search, direction, sort, name],
    async () => {
      const resp = await Middleware.get(`/profiles`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          Name: name || search,
        },
      });
      return getRespContent<AccessProfileResp[]>(resp);
    },
    {
      enabled: ENABLE_MIDDLEWARE,
    }
  );
}

export function useAccessProfileSelect() {
  return useQuery(
    [`accessPermissionSelect`],
    async () => {
      const resp = await Middleware.get(`/profiles/select`);
      return getResp<ListResp[]>(resp);
    },
    {
      enabled: ENABLE_MIDDLEWARE,
    }
  );
}

export function useAccessProfileDetails(id?: string) {
  return useQuery(
    [`accessPermissionDetails`, id],
    async () => {
      const resp = await Middleware.get(`/profiles/${id}`);
      return getResp<AccessProfileResp>(resp);
    },
    {
      enabled: !!id,
    }
  );
}

export default function saveAccessProfile(props: AccessProfile) {
  if (props.id) {
    return putAccessProfile(props);
  }
  return postAccessProfile(props);
}

export async function postAccessProfile(props: AccessProfile) {
  return await Middleware.post(`/profiles`, props);
}

export async function putAccessProfile(props: AccessProfile) {
  return await Middleware.put(`/profiles/${props.id}`, props);
}

export type AccessProfileRelationUser = {
  profileId: string;
  userId: string;
  franchiseId: null;
  entityId: string;
};

export async function createRelationUser(props: AccessProfileRelationUser) {
  return await Middleware.put(
    `/profiles/CreateRelationshipBetweenUserAndProfile`,
    props
  );
}
