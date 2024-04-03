import { useQuery } from '@tanstack/react-query';
import Api, { getResp, getRespContent } from './Api';
import { ExportType, SortDirection } from './RevenueService';
import { exportFile } from '../utils/functions/utility';

type Attachment = {
  id: string;
  type: string;
  owner: string;
  ownerId: string;
  url: string;
  externalId: string;
  displayName: string;
};

export type ExpenseAttachments = {
  favored: string;
  document: string;
  contract: string;
  validity: string;
  description: string;
  type: TypeExpenseAttachment;
  createdAt?: string;
  typeDescription?: string;
  attachment?: Attachment;
  attachmentId?: string;
};

export enum TypeExpenseAttachment {
  reinforcing = 0,
  correction = 1,
}

export type ExpenseResp = {
  description: string;
  year: string;
  pasep: string;
  index: number;
  value: number;
  reference: string;
  id: string;
  createdAt: string;
  type: number;
  typeDescription: string;
  attachments: ExpenseAttachments[];
};

export type Expense = {
  id?: string;
  type: number;
  description: string;
  year: string;
  pasep: number | string;
  index: number;
  value: number | string;
  reference: string;
};

export enum TypeExpense {
  Budget = 0,
  Extra = 1,
}

export function useExpense(
  page: number,
  pageSize: number | null,
  search: string,
  sort: string = 'index',
  direction: SortDirection = 'asc',
  type: string,
  pasep: string,
  description: string,
  maxValue: string,
  minValue: string,
  reference: string,
  year: string,
  cityConfig: string
) {
  return useQuery(
    [
      `expenseList`,
      page,
      search,
      direction,
      sort,
      type,
      pasep,
      description,
      maxValue,
      minValue,
      reference,
      year,
      cityConfig
    ],
    async () => {
      const resp = await Api.get(`/Expense`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          Type: type,
          Effort: pasep,
          Creditor: description || search,
          maxValue,
          minValue,
          Competence: reference,
          Year: year,
          CityConfig: cityConfig
        },
      });
      return getRespContent<ExpenseResp[]>(resp);
    }
  );
}

export function useTotalExpense(
  search: string,
  type: string,
  pasep: string,
  description: string,
  maxValue: string,
  minValue: string,
  reference: string,
  year: string
) {
  return useQuery(
    [
      `expenseTotalizer`,
      search,
      type,
      pasep,
      description,
      maxValue,
      minValue,
      reference,
      year,
    ],
    async () => {
      const resp = await Api.get(`/Expense/totalizer`, {
        params: {
          Type: type,
          Effort: pasep,
          Creditor: description || search,
          maxValue,
          minValue,
          Competence: reference,
          Year: year,
        },
      });
      return resp.data.content;
    }
  );
}

export function useExpenseDetails(id?: string) {
  return useQuery(
    [`Expense`, id],
    async () => {
      const resp = await Api.get(`/Expense/${id}`);
      return getResp<ExpenseResp>(resp);
    },
    { enabled: !!id }
  );
}

export async function putExpenseAttachment(
  expenseAttachment: ExpenseAttachments,
  expenseId: string
) {
  return await Api.put(`/Expense/${expenseId}/attach`, expenseAttachment);
}

export function saveExpense(props: Expense) {
  if (props.id) {
    return putExpense(props);
  }
  return postExpense(props);
}

export function postExpense(props: Expense) {
  return Api.post('/expense', props);
}

export function putExpense(props: Expense) {
  return Api.put(`/expense/${props.id}`, props);
}

export function deleteExpense(id: string) {
  return Api.delete(`/expense/${id}`);
}

export function getExpenseReport(
  search: string,
  sort: string = 'index',
  direction: SortDirection = 'asc',
  type: string,
  pasep: string,
  description: string,
  maxValue: string,
  minValue: string,
  reference: string,
  year: string,
  exportType: ExportType
) {
  return Api.get(`/expense/report/${exportType}`, {
    params: {
      SortColumn: sort,
      SortDirection: direction,
      Type: type,
      Effort: pasep,
      Creditor: description || search,
      maxValue,
      minValue,
      Competence: reference,
      Year: year,
    },
    responseType: 'blob',
  }).then((response) => {
    exportFile(response, 'Despesas');
  });
}

export async function expenseImport(reference: string) {
  return await Api.post(`/Expense/import-from-crawler`, { reference });
}

export const expenseTypeOptions = [
  {
    id: `${TypeExpense.Budget}`,
    name: 'Orçamentária',
  },
  {
    id: `${TypeExpense.Extra}`,
    name: 'Extra',
  },
];
