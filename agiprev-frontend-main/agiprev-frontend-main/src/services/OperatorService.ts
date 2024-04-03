import { useQuery } from '@tanstack/react-query';
import Api, { getResp } from './Api';
import { RegisterPersonResp } from './Server';

export async function postOperator(props: RegisterPersonResp) {
  const response = await Api.post(`/Operator`, props);
  return getResp<{ personId: string }>(response);
}

export async function putOperator(props: RegisterPersonResp, id: string) {
  return await Api.put(`/Operator/${id}`, props);
}

export function useOperatorDetails(id: string, enabled: boolean) {
  return useQuery(
    [`OperatorDetails`, id],
    async () => {
      const resp = await Api.get(`/Operator/${id}`);
      return getResp<RegisterPersonResp>(resp);
    },
    { enabled: enabled }
  );
}
