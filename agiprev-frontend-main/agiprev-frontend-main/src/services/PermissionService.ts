import { PhysicalPersonResp } from './PhysicalPersonService';
import React from 'react';
import { usePagination } from './../components/UI/molecules/PaginationComponent/PaginationComponent';
import { useToast } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Api, { Middleware, getResp, getRespContent } from './Api';
import { useDebounce } from '../utils/functions/debounce';
import { showToast } from '../utils/showToast';
import { getError } from '../utils/functions/utility';
import { useUserData } from './LoginService';

enum management {
  Nenhuma = 0,
  Atribuir = 1,
  Remover = 2,
  Completo = 3,
}

export type PermissionResp = {
  id: string;
  code: string;
  name: string;
  description: string;
  users: Permission[];
};

export type Permission = {
  userId: string;
  permissionId: string;
  management: management;
  managementText?: string;
  permissionName?: string;
  userName?: string;
};

export type Permissions = {
  items: Permission[];
};

export type PermissionUser = {
  userId: string;
  franchiseId: null;
  entityId: string;
  permissionsId: string[];
};

export function usePermissions(
  page: number,
  pageSize: number | null,
  search: string
) {
  return useQuery([`permissionList`, page, search], async () => {
    const resp = await Api.get(`/permission`, {
      params: {
        Offset: page,
        Limit: pageSize,
        QuickSearch: search,
      },
    });
    return resp.data.content;
  });
}

export function usePermissionsMiddleware() {
  return useQuery([`permissionListMiddleware`], async () => {
    const resp = await Middleware.get(`/permission`);
    return getRespContent<PermissionResp[]>(resp);
  });
}

export function permissionAssign(props: Permissions) {
  return Api.post(`/Permission/Assign`, props);
}

export function permissionRemove(props: Permissions) {
  return Api.post(`/Permission/Remove`, props);
}

export function useUserPermission(id?: string) {
  return useQuery(
    [`userPermission`, id],
    async () => {
      const resp = await Middleware.get(`/Permission/GetByUserId/${id}`);
      return getResp<PermissionResp[]>(resp);
    },
    { enabled: !!id }
  );
}

export function putUserPermission(props: PermissionUser) {
  return Middleware.put(
    `/Permission/CreateRelationshipBetweenUserAndPermission`,
    props
  );
}

export type PermissionNames =
  | 'person'
  | 'index'
  | 'relatedentity'
  | 'collection'
  | 'verification'
  | 'users'
  | 'rubric'
  | 'revenue'
  | 'expense';
type PermissionTypes = 'read' | 'add' | 'edit' | 'delete';

export function useExistsPermission(
  permissionName: PermissionNames,
  type: PermissionTypes
) {
  const permPrefix = 'agiprev-pasep-';
  const user = useUserData();
  return user?.permissions?.some(
    (item) => item.permissionName === `${permPrefix}${permissionName}-${type}`
  );
}

export function usePermissionDialog() {
  const toast = useToast();
  const { pageSize, selectedPage, setSelectedPage } = usePagination();
  const [searchInput, search, setSearch] = useDebounce('');
  const [management, setManagement] = React.useState<management>(0);
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  function assignRemovePermission(
    permission: PermissionResp | undefined,
    user: PhysicalPersonResp | undefined,
    assign: boolean
  ) {
    const permissionList: Permissions = {
      items: [
        {
          userId: user?.userId || '',
          permissionId: permission?.id || '',
          management: management,
        },
      ],
    };
    if (assign) {
      return permissionAssign(permissionList)
        .then((res) => {
          showToast({
            toast,
            status: 'success',
            title: 'Sucesso',
            description: 'Permissão atribuída com sucesso',
          });
        })
        .catch((err) => {
          console.error(err);
          showToast({
            toast,
            status: 'error',
            title: 'Error',
            description: getError(err),
          });
        });
    } else {
      return permissionRemove(permissionList)
        .then((res) => {
          showToast({
            toast,
            status: 'success',
            title: 'Sucesso',
            description: 'Permissão removida com sucesso',
          });
        })
        .catch((err) => {
          console.error(err);
          showToast({
            toast,
            status: 'error',
            title: 'Error',
            description: getError(err),
          });
        });
    }
  }
  return {
    pageSize,
    selectedPage,
    searchInput,
    search,
    setSearch,
    management,
    setManagement,
    onSelectedPageChanged,
    assignRemovePermission,
  };
}
