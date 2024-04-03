import { useQuery } from '@tanstack/react-query';
import Api, { getResp } from './Api';
import { SortDirection } from './PhysicalPersonService';

export type JuridicalPerson = {
  id: string;
  document: string;
  name: string;
  displayName: string;
  date: string;
  profilePicUrl: string;
  stateRegistration: string;
  establishmentFormat: string;
  emails?: string[];
  phones: {
    number: string;
    type: number;
    typeDescription: string;
  }[];
  socialMedias?: {
    url: string;
    type: number;
  }[];
  addresses: {
    owner: string;
    ownerId: string;
    id: string;
    street: string;
    district: string;
    complement: string;
    zipcode: string;
    type: number;
    cityId: string;
    stateId?: string;
    countryId?: string;
  }[];
};

export type JuridicalPersonResp = {
  id: string;
  personId: string;
  displayName: string;
  document: string;
  name: string;
  phones: {
    number: string;
    type: number;
    typeDescription: string;
  }[];
  emails: string[];
  profilePicUrl?: string;
  personalEmail?: string;
  employeeTeamId?: string;
};

export function useJuridicalPerson(
  page: number,
  pageSize: number | null,
  search: string,
  searchField: string = 'name',
  sort: string = 'name',
  direction: SortDirection = 'asc',
  onlyUsers: boolean = false
) {
  return useQuery(
    [`juridicalList`, page, search, searchField, direction, sort, onlyUsers],
    async () => {
      const resp = await Api.get(`/juridical-persons`, {
        params: {
          Offset: page,
          Limit: pageSize,
          [searchField]: search,
          SortColumn: sort,
          SortDirection: direction,
          OnlyUsers: onlyUsers,
        },
      });
      return resp.data.content;
    }
  );
}

export function saveJuridicalPerson(props: JuridicalPerson) {
  if (props.id) {
    return putJuridicalPerson(props);
  }
  return postJuridicalPerson(props);
}

export function postJuridicalPerson(props: JuridicalPerson) {
  return Api.post('/juridical-persons', props);
}

export function putJuridicalPerson(props: JuridicalPerson) {
  return Api.put(`/juridical-persons/${props.id}`, props);
}

export function postOnboardingJuridicalPerson(props: JuridicalPerson) {
  return Api.post(
    '/juridical-persons/Insert-JuridicalPerson-Onboarding',
    props
  ).then((res) => console.log(res));
}

export function JuridicalPersonById(id: string, enabled: boolean = true) {
  return useQuery(
    [`juridicalPerson`, id],
    async () => {
      const resp = await Api.get(`/juridical-persons/${id}`);
      return getResp<JuridicalPerson>(resp);
    },
    { enabled: id.length >= 3 && enabled }
  );
}
