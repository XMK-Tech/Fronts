import { useQuery } from '@tanstack/react-query';
import Api, { getResp } from './Api';

export type ListResp = {
  id: string;
  name: string;
};

export function useCountryList() {
  return useQuery([`CountryList`], async () => {
    const resp = await Api.get(`/Country`);
    return getResp<ListResp[]>(resp);
  });
}

export default function useStateList(country: string) {
  return useQuery(
    [`StateList`, country],
    async () => {
      const resp = await Api.get(`/State`, {
        params: {
          countryId: country,
        },
      });
      return getResp<ListResp[]>(resp);
    },
    { enabled: country.length >= 3 }
  );
}

export function useStates() {
  return useQuery([`States`], async () => {
    const resp = await Api.get(`/State`);
    return getResp<ListResp[]>(resp);
  });
}

export function useCities(state: string) {
  return useQuery(
    [`Cities`, state],
    async () => {
      const resp = await Api.get(`/City`, {
        params: {
          stateId: state,
        },
      });
      return getResp<ListResp[]>(resp);
    },
    { enabled: state.length >= 3 }
  );
}

export function useCityList(state: string) {
  return useQuery(
    [`CityList`, state],
    async () => {
      const resp = await Api.get(`/City`, {
        params: {
          stateId: state,
        },
      });
      return getResp<ListResp[]>(resp);
    },

    { enabled: state.length >= 3 }
  );
}
