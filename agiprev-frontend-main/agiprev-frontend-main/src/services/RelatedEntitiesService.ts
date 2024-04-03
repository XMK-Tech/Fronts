import { useQuery } from '@tanstack/react-query';
import Api, { getResp } from './Api';
import { SortDirection } from './RevenueService';
import { AddressType } from './PhysicalPersonService';

export type RelatedEntityResp = {
  name: string;
  document: string;
  imageUrl: string;
  type: number;
  id: string;
  createdAt: string;
  typeDescription: string;
  address: {
    id: string;
    street: string;
    district: string;
    number: string;
    complement: string;
    zipcode: string;
    type: AddressType;
    cityId: string;
    owner: string;
    ownerId: string;
    function: number;
    stateId: string;
    countryId: string;
    typeDescription: string;
    cityName: string;
    stateName: string;
    countryName: string;
  };
};

export type RelatedEntity = {
  name: string;
  document: string;
  imageUrl: string;
  type: number;
  id?: string;
  address: {
    id?: string;
    street: string;
    district: string;
    number: string;
    complement: string;
    zipcode: string;
    type: AddressType;
    cityId: string;
    ownerId: string;
    stateId: string;
  };
};

export enum TypeRelatedEntity {
  City = 0,
  Transit = 1,
  Foundation = 2,
}

export function useRelatedEntity(
  page: number,
  pageSize: number | null,
  search: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  name: string,
  document: string,
  type: string
) {
  return useQuery(
    [`relatedEntity`, page, search, direction, sort, name, document, type],
    async () => {
      const resp = await Api.get(`/RelatedEntity`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          Name: name || search,
          Document: document,
          Type: type,
        },
      });
      return resp.data.content;
    }
  );
}
export function useRelatedEntityId(id?: string) {
  return useQuery(
    [`entities`, id],
    async () => {
      const resp = await Api.get(`/RelatedEntity/${id}`);
      return getResp<RelatedEntityResp>(resp);
    },
    { enabled: !!id }
  );
}

export function saveRelatedEntity(props: RelatedEntity) {
  if (props.id) {
    return putRelatedEntity(props);
  }
  return postRelatedEntity(props);
}

export function postRelatedEntity(props: RelatedEntity) {
  return Api.post(`/RelatedEntity/`, props);
}

export function putRelatedEntity(props: RelatedEntity) {
  return Api.put(`/RelatedEntity/${props.id}`, props);
}

export function deleteRelatedEntity(id: string) {
  return Api.delete(`/RelatedEntity/${id}`);
}

export const relatedEntityTypeOptions = [
  {
    id: `${TypeRelatedEntity.City}`,
    name: 'Prefeitura',
  },
  {
    id: `${TypeRelatedEntity.Transit}`,
    name: 'Autarquia',
  },
  {
    id: `${TypeRelatedEntity.Foundation}`,
    name: 'Fundação',
  },
];
