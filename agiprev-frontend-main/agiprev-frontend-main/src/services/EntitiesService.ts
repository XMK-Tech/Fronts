import { ENABLE_MIDDLEWARE } from './../environment';
import { useQuery } from '@tanstack/react-query';
import Api, { getResp, getRespContent, Middleware } from './Api';
import { SortDirection } from './RevenueService';
import { AddressType } from './PhysicalPersonService';
import { ListResp } from './StateServices';

export type EntitiesResp = {
  id: string;
  name: string;
  document: string;
  imageUrl: string;
  type: number;
  typeDescription: string;
  responsible: {
    id: string;
    document: string;
  };
  address: {
    id?: string;
    street: string;
    district: string;
    complement: string;
    zipcode: string;
    number: string;
    type: AddressType;
    cityId: string;
    cityName: string;
    stateId: string;
    stateName: string;
  };
};

export type Entities = {
  id?: string;
  name: string;
  document: string;
  imageUrl: string;
  type: number;
  address?: EntitiesAddress;
  franchiseId?: string;
  responsible?: EntitiesResp;
  contract?: {
    name: string;
  };
};

export type EntitiesAddress = {
  id?: string;
  street: string;
  district: string;
  complement: string;
  zipcode: string;
  number: string;
  type: AddressType;
  cityId: string;
  stateId: string;
  ownerId: string;
};

export function useEntitiesSelectUser() {
  return useQuery(
    [`entitySelectList`],
    async () => {
      const resp = await Middleware.get(`/entities/Select/CurrentUser`);
      return getResp<ListResp[]>(resp);
    },
    {
      enabled: ENABLE_MIDDLEWARE,
    }
  );
}

export function useEntitites(
  page: number,
  pageSize: number | null,
  search: string,
  sort: string = 'name',
  direction: SortDirection = 'asc',
  name: string,
  document: string,
  type: string,
  responsibleDocument: string
) {
  return useQuery(
    [
      `entitiesList`,
      page,
      search,
      direction,
      sort,
      name,
      document,
      type,
      responsibleDocument,
    ],
    async () => {
      const resp = await Middleware.get(`/entities`, {
        params: {
          Offset: page,
          Limit: pageSize,
          SortColumn: sort,
          SortDirection: direction,
          Name: name || search,
          Document: document,
          Type: type,
          ResponsibleDocument: responsibleDocument,
        },
      });
      return getRespContent<EntitiesResp[]>(resp);
    },
    {
      enabled: ENABLE_MIDDLEWARE,
    }
  );
}

export function useEntitiesDetails(id?: string) {
  return useQuery([`entities`, id], async () => {
    const resp = await Middleware.get(`/entities/${id}`);
    return getResp<EntitiesResp>(resp);
  });
}

export function saveEntities(props: Entities) {
  if (props.id) {
    return putEntities(props);
  }
  return postEntities(props);
}

export function postEntities(props: Entities) {
  return Middleware.post(`/entities/`, props);
}

export function putEntities(props: Entities) {
  return Middleware.put(`/entities/${props.id}`, props);
}

export type EntitiesApiResp = {
  name: string;
  entityImage: string;
  document: string;
  demoMode: boolean;
  address: {
    street: string;
    district: string;
    complement: string;
    zipcode: string;
    number: string;
    type: number;
    cityId: string;
    cityName: string;
    stateId: string;
    stateName: string;
  };
  iss: {
    responsibleName: string;
    legalBasisWarning: string;
    legalBasisNotice: string;
  };
  itr: {
    document: string;
    ibgeCode: string;
    state: string;
    seal: string;
    proprietyCount: number;
    municipalityNumber: string;
    neighborhood: string;
    financeSecretary: string;
    logoUrl: string;
    contractStatus: boolean;
    demarcationZones: boolean;
    contractComplaint: string;
    contractValidity: string;
    fundraisingPerspective: number;
    fundraisingEffective: number;
    herdIndex: number;
    aliquot: number;
    carShapeFileUrl: string;
    center: string;
    gMapsName: string;
    cityLimitsFile: string;
    credentials: {
      user: string;
      password: string;
      administrativeCode: string;
      contract: string;
      document: string;
      se: string;
      card: string;
    };
  };
  dte: {
    dteModel: string;
  };
  agiprev: {
    ipmUrl: string;
    fpmUrl: string;
    processNumber: string;
    estadoSigla?: string;
    municipioNome?: string,
    documents: string[];
  };
};

export function useApiEntities() {
  return useQuery([`entitiesApi`], async () => {
    const resp = await Api.get(`/entities`);
    return getResp<EntitiesApiResp>(resp);
  });
}

export function patchApiEntities(props: EntitiesApiResp) {
  return Api.patch(`/entities`, props);
}
