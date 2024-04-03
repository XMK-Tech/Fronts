import { useQuery } from '@tanstack/react-query';
import { RegisterType } from '../components/templates/PersonRegisterTemplateComponent/PersonRegisterTemplateComponent';
import Api, { getResp } from './Api';

export type RegisterPersonResp = {
  name: string;
  document: string;
  emails?: string[];
  email: string;
  agiPrevCode: string;
  admissionDate?: string;
  ctpsNumber?: string;
  ctpsSeries?: string;
  registration?: string;
  serverCategory?: number;
  pisPasepNumber?: string;
  createdAt?: string;
  hasUser?: boolean;
  registerType?: RegisterType;
  id?: string;
};

export type ListResp = {
  descricao: string;
  value: number;
};

export function useServerCategoriesList() {
  return useQuery([`ServerCategorier`], async () => {
    const resp = await Api.get(`/Server/select-categories`);
    return getResp<ListResp[]>(resp);
  });
}

export async function postServer(props: RegisterPersonResp) {
  const response = await Api.post(`/Server`, props);
  return getResp<{ personId: string }>(response);
}

export async function putServer(props: RegisterPersonResp, id: string) {
  return await Api.put(`/Server/${id}`, props);
}

export function useServerDetails(id: string, enabled: boolean) {
  return useQuery(
    [`ServerDetails`, id],
    async () => {
      const resp = await Api.get(`/Server/${id}`);
      return getResp<RegisterPersonResp>(resp);
    },
    { enabled: enabled }
  );
}
