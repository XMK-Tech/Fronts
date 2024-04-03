import { useQuery } from '@tanstack/react-query';
import Api, { getResp } from './Api';
import { SortDirection } from './RevenueService';

export type IndexResp = {
  type: number;
  percentage: number;
  reference: string;
  id: string;
  createdAt: string;
  typeDescription: string;
};
export type Index = {
  id?: string;
  percentage: string | number;
  type: number;
  reference: string;
};
export function useIndex(
  page: number,
  pageSize: number | null,
  search: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  percentage: string,
  reference: string,
  type: string,
  year: string
) {
  return useQuery(
    [
      `indexList`,
      page,
      search,
      direction,
      sort,
      percentage,
      reference,
      type,
      year,
    ],
    async () => {
      const resp = await Api.get(`/Index`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          Percentage: percentage || search,
          Reference: reference,
          Type: type,
          Year: year,
        },
      });
      return resp.data.content;
    }
  );
}

export function useIndexId(id?: string) {
  return useQuery(
    [`Index`, id],
    async () => {
      const resp = await Api.get(`/Index/${id}`);
      return getResp<IndexResp>(resp);
    },
    { enabled: !!id }
  );
}
export function saveIndex(payload: Index) {
  if (payload.id) {
    return putIndex(payload);
  }
  return postIndex(payload);
}
export function postIndex(payload: Index) {
  return Api.post(`/Index`, payload);
}
export function putIndex(payload: Index) {
  return Api.put(`/Index/${payload.id}`, payload);
}

export function deleteIndex(id: string) {
  return Api.delete(`/Index/${id}`);
}
