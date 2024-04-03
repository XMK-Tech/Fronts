import {agilleClient, middlewareClient} from './HttpService'
export type FetchFrom = 'middleware' | 'agille'

export function getStates(fetchFrom: FetchFrom = 'middleware') {
  const url = `/State?limit=1000`
  if (fetchFrom === 'middleware') {
    return middlewareClient.get(url)
  }
  return agilleClient.get(url)
}

export function getCities(state: string, fetchFrom: FetchFrom = 'middleware') {
  const url = `/City?stateId=${state}&limit=1000`
  if (fetchFrom === 'middleware') {
    return middlewareClient.get(url)
  }
  return agilleClient.get(url)
}
