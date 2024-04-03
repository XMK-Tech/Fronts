import { useQuery } from '@tanstack/react-query';
import { SortDirection } from './RevenueService';
import Api, { getRespContent } from './Api';
import { openFile } from '../utils/functions/utility';

export type VerificationResp = {
  valueToArbitrate: number;
  updateValue: number;
  exercise: string;
  id: string;
};

export type verificationCalculationLogResp = {
  url: string;
};

export function useVerification(
  page: number,
  pageSize: number | null,
  search: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  exercise: string,
  maxArbitrateValue: string,
  minArbitrateValue: string,
  maxUpdatedValue: string,
  minUpdatedValue: string,
  year: string
) {
  return useQuery(
    [
      `verificationList`,
      page,
      search,
      direction,
      sort,
      exercise,
      maxArbitrateValue,
      minArbitrateValue,
      maxUpdatedValue,
      minUpdatedValue,
      year,
    ],

    async () => {
      const resp = await Api.get(`/verification`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          Exercise: exercise || search,
          MaxArbitrate: maxArbitrateValue,
          MinArbitrate: minArbitrateValue,
          MaxUpdate: maxUpdatedValue,
          MinUpdate: minUpdatedValue,
          Year: year,
        },
      });
      return getRespContent<VerificationResp[]>(resp);
    }
  );
}

export function useTotalVerification(
  search: string,
  exercise: string,
  maxArbitrateValue: string,
  minArbitrateValue: string,
  maxUpdatedValue: string,
  minUpdatedValue: string,
  year: string
) {
  return useQuery(
    [
      `verificationTotalizer`,
      search,
      exercise,
      maxArbitrateValue,
      minArbitrateValue,
      maxUpdatedValue,
      minUpdatedValue,
      year,
    ],

    async () => {
      const resp = await Api.get(`/verification/totalizer`, {
        params: {
          Exercise: exercise || search,
          MaxArbitrate: maxArbitrateValue,
          MinArbitrate: minArbitrateValue,
          MaxUpdate: maxUpdatedValue,
          MinUpdate: minUpdatedValue,
          Year: year,
        },
      });
      return resp.data.content;
    }
  );
}

export function useVerificationCalculationLog(year: string) {
  return useQuery([`verificationCalculationLog`, year], async () => {
    const resp = await Api.get(`/verification/calculation-log/${year}`);
    return getRespContent<verificationCalculationLogResp>(resp);
  });
}

export function getAgiprevCalculation(year: string) {
  return Api.get(`/AgiprevCalculation/${year}`, {
    responseType: 'blob',
  }).then((response) => {
    openFile(response);
  });
}

export function getAgiprevCalculationMonth(year: string, month: number) {
  return Api.get(`/AgiprevCalculation/${year}/${month}`, {
    responseType: 'blob',
  }).then((response) => {
    openFile(response);
  });
}
