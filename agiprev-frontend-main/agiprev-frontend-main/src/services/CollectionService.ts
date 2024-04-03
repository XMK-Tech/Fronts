import { useQuery } from '@tanstack/react-query';
import Api, { getResp, getRespContent } from './Api';
import { ExportType, SortDirection } from './RevenueService';
import { exportFile } from '../utils/functions/utility';
type CollectionAttachment = {
  id: string;
  type: string;
  owner: string;
  ownerId: string;
  url: string;
  externalId: string;
  displayName: string;
};
export type CollectionAttachments = {
  description: string;
  type: number;
  createdAt?: string;
  typeDescription?: string;
  attachment?: CollectionAttachment;
  attachmentId?: string;
};

export enum TypeCollection {
  voucher = 0,
  darf = 1,
}

export type CollectionResp = {
  pasepValue: number;
  selicValue: number;
  reference: string;
  payday: string;
  id: string;
  createdAt: string;
  attachments: CollectionAttachments[];
};

export type Collection = {
  reference: string;
  payday: string;
  pasepValue: string | number;
  selicValue: string | number;
  id?: string;
};

export function useCollection(
  page: number,
  pageSize: number | null,
  search: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  reference: string,
  payday: string,
  maxPasepValue: string,
  minPasepValue: string,
  maxSelicValue: string,
  minSelicValue: string,
  year: string,
  cityConfig: string
) {
  return useQuery(
    [
      `collectionList`,
      page,
      search,
      direction,
      sort,
      reference,
      payday,
      maxPasepValue,
      minPasepValue,
      maxSelicValue,
      minSelicValue,
      year,
      cityConfig
    ],
    async () => {
      const resp = await Api.get(`/Collection`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          Reference: reference,
          PayDay: payday,
          maxPasepValue,
          minPasepValue,
          maxSelicValue,
          minSelicValue,
          Year: year,
          CityConfig: cityConfig
        },
      });
      return getRespContent<CollectionResp[]>(resp);
    }
  );
}

export function useTotalCollection(
  search: string,
  reference: string,
  payday: string,
  maxPasepValue: string,
  minPasepValue: string,
  maxSelicValue: string,
  minSelicValue: string,
  year: string
) {
  return useQuery(
    [
      `collectionTotalizer`,
      search,
      reference,
      payday,
      maxPasepValue,
      minPasepValue,
      maxSelicValue,
      minSelicValue,
      year,
    ],
    async () => {
      const resp = await Api.get(`/Collection/totalizer`, {
        params: {
          Reference: reference,
          PayDay: payday,
          maxPasepValue,
          minPasepValue,
          maxSelicValue,
          minSelicValue,
          Year: year,
        },
      });
      return resp.data.content;
    }
  );
}

export function useCollectionId(id?: string) {
  return useQuery(
    [`Collection`, id],
    async () => {
      const resp = await Api.get(`/Collection/${id}`);
      return getResp<CollectionResp>(resp);
    },
    { enabled: !!id }
  );
}

export async function putCollectionAttachment(
  collectionAttachment: CollectionAttachments,
  collectionId: string
) {
  return await Api.put(
    `/Collection/${collectionId}/attach`,
    collectionAttachment
  );
}

export default function saveCollection(props: Collection) {
  if (props.id) {
    return putCollection(props);
  }
  return postCollection(props);
}

export async function postCollection(props: Collection) {
  return await Api.post(`/Collection`, props);
}

export async function putCollection(props: Collection) {
  return await Api.put(`/Collection/${props.id}`, props);
}

export async function deleteCollection(id: string) {
  return await Api.delete(`/Collection/${id}`);
}

export function getCollectionReport(
  sort: string = 'name',
  direction: SortDirection = 'asc',
  reference: string,
  payday: string,
  maxPasepValue: string,
  minPasepValue: string,
  maxSelicValue: string,
  minSelicValue: string,
  year: string,
  type: ExportType
) {
  return Api.get(`/Collection/report/${type}`, {
    params: {
      SortColumn: sort,
      SortDirection: direction,
      Reference: reference,
      PayDay: payday,
      maxPasepValue,
      minPasepValue,
      maxSelicValue,
      minSelicValue,
      Year: year,
    },
    responseType: 'blob',
  }).then((response) => {
    exportFile(response, 'Recolhimento');
  });
}

export async function collectionImport(reference: string) {
  return await Api.post(`/Collection/import-from-crawler`, { reference });
}
