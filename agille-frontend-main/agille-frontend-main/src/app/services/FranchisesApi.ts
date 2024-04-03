import {middlewareClient} from './HttpService'
import {getPaginationParams} from './UsersApi'

export function getFranchises() {
  return middlewareClient.get(`/franchise`).then((response) => {
    return {
      data: response,
    }
  })
}
export function getFilteredFranchises(page: number, limit: number = 6) {
  return middlewareClient.get(`/franchise`, getPaginationParams(page, limit))
}

type FranchiseParams = {
  name: string
  email: string
  document: string
  phoneNumber: number
  username: string
  address: {
    street: string
    district: string
    complement: string
    zipcode: string
    type: number
    cityId: string
  }
}

export async function getFranchise(id: string) {
  return await middlewareClient.get(`/franchise/${id}`)
}

export async function createFranchise(franchise: FranchiseParams) {
  return await middlewareClient.post(`/franchise`, franchise)
}

export async function updateFranchise(id: string, franchise: FranchiseParams) {
  return await middlewareClient.put(`/franchise/${id}`, franchise)
}
