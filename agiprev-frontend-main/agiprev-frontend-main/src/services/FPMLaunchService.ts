import { useQuery } from '@tanstack/react-query';
import Api, { getResp, getRespContent } from './Api';
import { SortDirection } from './RevenueService';

export type FPMLaunchResp = {
  id: string;
  createdAt: string;
  description: string;
  incomeAccount: string;
  collected: number;
  accumulated: number;
  reference: string;
  competence: string;
};

export function useFPMLaunch(
  page: number,
  pageSize: number | null,
  search: string,
  incomeAccount: string,
  description: string,
  competence: string,
  minReference: string,
  maxReference: string,
  minCollected: string,
  maxCollected: string,
  minAccumulated: string,
  maxAccumulated: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  year: string,
  cityConfig: string,
) {
  return useQuery(
    [
      `FPMLaunchList`,
      page,
      search,
      direction,
      sort,
      incomeAccount,
      description,
      competence,
      minReference,
      maxReference,
      minCollected,
      maxCollected,
      minAccumulated,
      maxAccumulated,
      year,
    ],
    async () => {
      const resp = await Api.get(`/FPMLaunch`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          IncomeAccount: incomeAccount,
          Description: description || search,
          competence,
          minReference,
          maxReference,
          MinCollected: minCollected,
          MaxCollected: maxCollected,
          MinAccumulated: minAccumulated,
          MaxAccumulated: maxAccumulated,
          Year: year,
          CityConfig: cityConfig,
        },
      });
      
      return getRespContent<FPMLaunchResp[]>(resp);
    }
  );
}

export function useFPMLaunchDetails(id?: string) {
  return useQuery([`FPMLaunch`, id], async () => {
    const resp = await Api.get(`/FPMLaunch/${id}`);
    return getResp<FPMLaunchResp>(resp);
  });
}

export async function FPMLaunchImport(reference: string) {
  return await Api.post(`/FPMLaunch/import-from-crawler`, {
    reference,
  });
}
