import {buildSearchArgs} from '../utils/functions'
import {agilleClient} from './HttpService'
import {getPaginationParams} from './UsersApi'

export async function getDataCrossing(page: number, limit: number = 6) {
  return agilleClient.get(`/DataCrossing`, {...getPaginationParams(page, limit)})
}

export async function getDataCrossingResults(id: string) {
  return agilleClient.get(`/DataCrossing/${id}/results`)
}

export async function getCardOperatorDataCrossing(
  page: number,
  limit: number = 6,
  text?: string,
  field?: string
) {
  return agilleClient.get(`/CardCrossing`, {
    ...getPaginationParams(page, limit),
    ...buildSearchArgs(text, field),
  })
}

export async function getCardOperatorDataCrossingResults(id: string) {
  return agilleClient.get(`/CardCrossing/${id}`)
}
