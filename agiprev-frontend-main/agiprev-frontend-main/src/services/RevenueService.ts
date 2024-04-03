import { useQuery } from '@tanstack/react-query';
import Api, { getResp } from './Api';
import { exportFile } from '../utils/functions/utility';

export type SortDirection = 'asc' | 'desc';
export type RevenueResp = {
  index?: number;
  account?: string;
  predictedDeductions: number;
  deductions: number;
  description: string;
  predictedUpdated: number;
  effectedValue: number;
  predictedValue: number;
  collection: number;
  id: string;
  createdAt: string;
  reference: string;
};
export type Revenue = {
  id?: string;
  index?: number;
  account?: string;
  description: string;
  predictedValue: number | string;
  predictedDeductions: number | string;
  predictedUpdated: number | string;
  collection: number | string;
  deductions: number | string;
  effectedValue: number | string;
  reference: string;
};

export function useTotalRevenue(
  search: string,
  account: string,
  description: string,
  reference: string,
  maxEffectedValue: string,
  minEffectedValue: string,
  year: string
) {
  return useQuery(
    [
      `revenueTotalizer`,
      search,
      account,
      description,
      reference,
      maxEffectedValue,
      minEffectedValue,
      year,
    ],
    async () => {
      const resp = await Api.get(`/Revenue/Totalizer`, {
        params: {
          Account: account,
          Description: description || search,
          Reference: reference,
          maxEffectedValue,
          minEffectedValue,
          Year: year,
        },
      });
      return resp.data.content as { data: { sum: number; count: number } };
    }
  );
}

export function useRevenue(
  page: number,
  pageSize: number | null,
  search: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  account: string,
  description: string,
  reference: string,
  maxEffectedValue: string,
  minEffectedValue: string,
  year: string,
  cityConfig: string
) {
  return useQuery(
    [
      `revenueList`,
      page,
      search,
      direction,
      sort,
      account,
      description,
      reference,
      maxEffectedValue,
      minEffectedValue,
      year,
      cityConfig
    ],
    async () => {
      const resp = await Api.get(`/Revenue`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          Account: account,
          Description: description || search,
          Reference: reference,
          maxEffectedValue,
          minEffectedValue,
          Year: year,
          CityConfig: cityConfig
        },
      });
      return resp.data.content;
    }
  );
}

export function useRevenueId(id?: string) {
  return useQuery(
    [`Revenue`, id],
    async () => {
      const resp = await Api.get(`/Revenue/${id}`);
      return getResp<RevenueResp>(resp);
    },
    { enabled: !!id }
  );
}
export function saveRevenue(props: Revenue) {
  if (props.id) {
    return putRevenue(props);
  }
  return postRevenue(props);
}
export function postRevenue(props: Revenue) {
  return Api.post(`/Revenue`, props);
}
export function putRevenue(props: Revenue) {
  return Api.put(`/Revenue/${props.id}`, props);
}

export function deleteRevenue(id: string) {
  return Api.delete(`/Revenue/${id}`);
}

export type ExportType = 'PDF' | 'CSV';

export function getRevenueReport(
  search: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  account: string,
  description: string,
  reference: string,
  maxEffectedValue: string,
  minEffectedValue: string,
  year: string,
  type: ExportType
) {
  return Api.get(`/Revenue/report/${type}`, {
    params: {
      SortColumn: sort,
      SortDirection: direction,
      Account: account,
      Description: description || search,
      Reference: reference,
      maxEffectedValue,
      minEffectedValue,
      Year: year,
    },
    responseType: 'blob',
  }).then((response) => {
    exportFile(response, 'Receitas');
  });
}

export async function revenueImport(reference: string) {
  return await Api.post(`/Revenue/import-from-crawler`, { reference });
}
