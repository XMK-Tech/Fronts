import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { showToast } from '../utils/showToast';
import Api, { getResp, getRespContent } from './Api';

type ApplicationApiResponse = {};

export type usersAcceptedType = {
  policyId?: string;
  userId?: string;
  name?: string;
  date?: string;
  status?: number;
  statusText?: string;
};

export type ApplicationPolicyApi = {
  attachmentId?: string;
  attachmentUrl?: string;
  createdAt?: string;
  description: string;
  id?: string;
  policy: string;
  replacedById?: string;
  replacedIn?: string;
  status?: number;
  statusText?: string;
  title: string;
  users?: usersAcceptedType[];
};

export function useGetApplicationPolicy(page: number, pageSize: number | null) {
  return useQuery([`applicationPolicy`, page], async () => {
    const resp = await Api.get(`/applicationPolicy`, {
      params: {
        Offset: page,
        Limit: pageSize,
        SortColumn: 'createdAt',
        SortDirection: 'desc',
      },
    });
    return getRespContent<ApplicationPolicyApi[]>(resp);
  });
}

export function useNotAnsweredApplicationPolicy() {
  return useQuery([`applicationPolicy`], async () => {
    const resp = await Api.get(`/applicationPolicy/not-answered`);
    return getResp<ApplicationPolicyApi[]>(resp);
  });
}

export function AcceptPolicy(id: string) {
  return Api.put(`/ApplicationPolicy/${id}/accept`);
}

export function RejectPolicy(id: string) {
  return Api.put(`/ApplicationPolicy/${id}/reject`);
}

export function usePostApplicationPolicy() {
  const toast = useToast();
  const { mutate, isLoading, error, data } = useMutation({
    onError: (error) => {
      showToast({
        toast,
        status: 'error',
        title: 'Erro',
        description: 'Erro ao salvar política de aplicativo',
      });
    },
    onSuccess: () => {
      showToast({
        toast,
        status: 'success',
        title: 'Sucesso',
        description: 'Política de aplicativo salva com sucesso',
      });
    },

    mutationFn: async (data: ApplicationPolicyApi) => {
      const resp = await Api.post(`/applicationPolicy`, {
        title: data.title,
        description: data.description,
        policy: data.policy,
      });
      return getResp<ApplicationApiResponse>(resp);
    },
  });

  return {
    creatPost: mutate,
    isLoading,
    error,
    data,
  };
}
