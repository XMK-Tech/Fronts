import { useQuery } from '@tanstack/react-query';
import Api, { getResp } from './Api';
import React from 'react';
import { exportFile, validateOptionalFields } from '../utils/functions/utility';
import { Permission } from './PermissionService';
import {
  FormAddressOnboarding,
  FormPersonsOnboarding,
  PersonType,
} from '../components/UI/molecules/OnboardingFormComponent/OnboardingFormComponent';
import { RegisterPersonResp } from './Server';

export enum AgiPrevPersonType {
  Null = '0',
  Operator = '1',
  Server = '2',
}

export type PhysicalPerson = {
  id?: string;
  agiPrevPersonType: AgiPrevPersonType;
  document: string;
  displayName: string;
  date: string;
  name?: string;
  firstName: string;
  lastName: string;
  gender: number;
  detail: string;
  profilePicUrl: string;
  companyId: string;
  employee: {
    position: string;
    code: string;
    salary: number;
    technicalHourValue: number;
    contractionDate: string;
    resignationDate: string;
  } | null;
  user: {
    username: string;
    email: string;
    profileId: string;
    permissions: string[];
    customPermissions: boolean;
    entities?: string[];
  };
  emails: string[];
  phones: {
    number: string;
    type: PhoneType;
    typeDescription: string;
  }[];
  socialMedias: {
    url: string;
    type: number;
  }[];
  addresses: {
    owner: string;
    ownerId: string;
    id?: string;
    street: string;
    district: string;
    complement: string;
    zipcode: string;
    type: AddressType;
    cityId: string;
    stateId?: string;
    countryId?: string;
  }[];
  serverOrOperator: RegisterPersonResp;
};

export type PhysicalPersonResp = {
  companyDisplayName: string;
  companyId: string;
  displayName: string;
  employeeId: string;
  employeePosition: string;
  firstName: string;
  id: string;
  personEmail: string;
  personId: string;
  profileName: string;
  profilePicUrl: string;
  userEmail: string;
  userName: string;
  userId: string;
  phone: string;
  document: string;
  name: string;
  permissions: Permission[];
};

export type SortDirection = 'asc' | 'desc';

export enum PhoneType {
  Null = 0,
  Residential = 1,
  Commercial = 2,
  Mobile = 3,
  Others = 4,
}

export enum AddressType {
  Null = 0,
  Residential = 1,
  Commercial = 2,
  Others = 3,
}

export function usePhysicalPerson(
  page: number,
  pageSize: number | null,
  search: string,
  searchField: string = 'name',
  sort: string = 'name',
  direction: SortDirection = 'asc',
  onlyUsers: boolean = false
) {
  return useQuery(
    [`physicalList`, page, search, searchField, direction, sort, onlyUsers],
    async () => {
      const resp = await Api.get(`/physical-persons`, {
        params: {
          Offset: page,
          Limit: pageSize,
          [searchField]: search,
          SortColumn: sort || '',
          SortDirection: direction,
          OnlyUsers: onlyUsers,
        },
      });
      return resp.data.content;
    }
  );
}

export function usePhysicalPersonReport(
  type: number,
  setType: (number: number) => void,
  page: number,
  pageSize: number | null,
  search: string,
  searchField: string = 'name'
) {
  React.useEffect(() => {
    if (type >= 0) {
      Api.get(`/physical-persons/report/${type}`, {
        params: {
          Offset: page,
          Limit: pageSize,
          [searchField]: search,
        },
        responseType: 'blob',
      }).then((response) => {
        exportFile(response, 'Usuários');
        setType(-1);
      });
    }
  }, [type, setType, page, pageSize, search, searchField]);
}

export function savePhysicalPerson(props: PhysicalPerson) {
  if (props.id) {
    return putPhysicalPerson(props);
  }
  return postPhysicalPerson(props);
}

export function postPhysicalPerson(props: PhysicalPerson) {
  return Api.post('/physical-persons', props);
}

export function putPhysicalPerson(props: PhysicalPerson) {
  return Api.put(`/physical-persons/${props.id}`, props);
}

export function postOnboardingPhysicalPerson(props: PhysicalPerson) {
  return Api.post(
    '/physical-persons/Insert-PhysicalPerson-Onboarding',
    props
  ).then((res) => console.log(res));
}

export function PhysicalPersonById(id: string, enabled: boolean = true) {
  return useQuery(
    [`physicalPerson`, id],
    async () => {
      const resp = await Api.get(`/physical-persons/${id}`);
      return getResp<PhysicalPerson>(resp);
    },
    { enabled: id.length >= 3 && enabled }
  );
}

export function useMyProfile() {
  return useQuery([`myProfile`], async () => {
    const resp = await Api.get(`/my-profile`);
    return getResp<PhysicalPerson>(resp);
  });
}

export function userIsValid(
  form: FormPersonsOnboarding,
  address: FormAddressOnboarding,
  personT: PersonType
) {
  const defaultKeys: (keyof FormPersonsOnboarding)[] = ['profilePicUrl', 'id'];
  return (
    !validateOptionalFields(
      form,
      PersonType.physical === personT
        ? [...defaultKeys, 'stateRegistration']
        : [...defaultKeys, 'lastName', 'gender']
    ) && !validateOptionalFields(address, ['owner', 'ownerId'])
  );
}
