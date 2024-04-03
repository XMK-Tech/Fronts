import { useQuery } from '@tanstack/react-query';
import Api, { getResp } from './Api';
import { ListResp } from './StateServices';

export type ProfileResp = {
  id: string;
  document: string;
  displayName: string;
  date: string;
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
  };
  user: {
    username: string;
    email: string;
    profileId: string;
    permissions: string[];
    customPermissions: boolean;
  };
  emails: string[];
  phones: {
    number: string;
    type: number;
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
    type: number;
    cityId: string;
    stateId?: string;
    countryId?: string;
  }[];
};

export function useProfile() {
  return useQuery([`profileList`], async () => {
    const resp = await Api.get(`/profiles`);
    return getResp<ProfileResp>(resp);
  });
}
export function useProfileSelect() {
  return useQuery(
    [`profileSelectList`],
    async () => {
      const resp = await Api.get(`/profiles/select`);
      return getResp<ListResp[]>(resp);
    },
    { enabled: false }
  );
}
