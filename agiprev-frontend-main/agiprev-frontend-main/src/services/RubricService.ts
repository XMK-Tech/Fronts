import { useQuery } from '@tanstack/react-query';
import Api, { getResp, getRespContent } from './Api';
import { SortDirection } from './RevenueService';

export type RubricAccountsResp = {
  account: string;
  title: string;
  function: string;
  detail: string;
  status: RubricAccountStatus;
  originOfBalance: number;
  classifications: string;
  id: string;
  createdAt: string;
  statusDescription: string;
  originOfBalanceDescription: string;
};

export enum RubricAccountStatus {
  Active = 0,
  Inactive = 1,
}

export enum RubricAccountOriginOfBalance {
  Debit = 0,
  Credit = 1,
}

export type RubricResp = {
  name: string;
  stateId: string;
  reference: string;
  id: string;
  createdAt: string;
  stateName: string;
  totalAccounts: number;
  accounts: RubricAccountsResp[];
};

export type Rubric = {
  id?: string;
  name: string;
  stateId: string;
  reference: string;
  accounts: RubricAccounts[];
};

export type RubricAccounts = {
  id?: string;
  account: string;
  title: string;
  function: string;
  detail: string;
  status: number;
  originOfBalance: number;
  classifications?: string;
};

export function useRubric(
  page: number,
  pageSize: number | null,
  search: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  name: string,
  stateId: string,
  reference: string,
  year: string
) {
  return useQuery(
    [
      `rubricList`,
      page,
      search,
      direction,
      sort,
      name,
      stateId,
      reference,
      year,
    ],
    async () => {
      const resp = await Api.get(`/Rubric`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          Name: name || search,
          StateId: stateId,
          Reference: reference,
          Year: year,
        },
      });
      return resp.data.content;
    }
  );
}
export function useRubricDetails(id?: string) {
  return useQuery(
    [`Rubric`, id],
    async () => {
      const resp = await Api.get(`/Rubric/${id}`);
      return getResp<RubricResp>(resp);
    },
    { enabled: !!id }
  );
}
export function useRubricAcountsId(
  id: string,
  page?: number,
  pageSize?: number | null,
  sort: string = 'name',
  direction: SortDirection = 'asc'
) {
  return useQuery(
    [`RubricAccounts`, id, page, direction, sort],
    async () => {
      const resp = await Api.get(`/Rubric/Accounts/${id}`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
        },
      });
      return getRespContent<RubricAccountsResp[]>(resp);
    },
    { enabled: !!id }
  );
}

export function deleteRubricAccount(id: string) {
  return Api.delete(`/Rubric/accounts/${id}`);
}

export function saveRubric(props: Rubric) {
  if (props.id) {
    return putRubric(props);
  }
  return postRubric(props);
}

export function postRubric(props: Rubric) {
  return Api.post('/rubric', props);
}

export function putRubric(props: Rubric) {
  return Api.put(`/rubric/${props.id}`, props);
}

export function deleteRubric(id: string) {
  return Api.delete(`/rubric/${id}`);
}
