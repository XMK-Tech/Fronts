import { useQuery } from '@tanstack/react-query';
import { SortDirection } from './RevenueService';
import Api, { getResp } from './Api';

export type PersonResp = {
  name: string;
  document: string;
  emails: string[];
  createdAt: string;
  hasUser: boolean;
  agiPrevCode: string;
};

export type PutAgiprevUser = {
  name: string;
  email: string;
  document: string;
  agiPrevCode: string;
};

export function usePerson(
  page: number,
  pageSize: number | null,
  search: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  name: string,
  document: string,
  displayname: string,
  initialdate: string,
  enddate: string,
  generalrecord: string
) {
  return useQuery(
    [
      `personList`,
      page,
      search,
      direction,
      sort,
      name,
      document,
      displayname,
      initialdate,
      enddate,
      generalrecord,
    ],
    async () => {
      const resp = await Api.get(`/Persons`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          Name: name || search,
          Document: document,
          DisplayName: displayname,
          InitialDate: initialdate,
          EndDate: enddate,
          GeneralRecord: generalrecord,
        },
      });
      return resp.data.content;
    }
  );
}

export function usePersonsDetails(id: string) {
  return useQuery(
    [`PersonsDetails`, id],
    async () => {
      const resp = await Api.get(`/persons/${id}`);
      return getResp<PersonResp>(resp);
    },
    { enabled: !!id }
  );
}

export async function putEnableAgiprevUser(props: PutAgiprevUser, id: string) {
  return await Api.put(`/persons/agiprev/user/${id}`, props);
}
