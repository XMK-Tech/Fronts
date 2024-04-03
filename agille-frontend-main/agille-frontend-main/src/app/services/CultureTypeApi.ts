import {agilleClient} from './HttpService'

export enum CultureType {
  Null = 0,
  FishFarms = 1,
  Agriculture = 2,
  Livestock = 3,
}

export type CultureTypeApi = {
 
  name: string
  type: CultureType
  id: string
  isChecked: boolean
  isDefault: boolean
  typeDescription: string
 
}

type CreateCultureType = {
  name: string
  type: CultureType
  isChecked: boolean
}

export function getCultureType() {
  return agilleClient.get(`/CultureType`)
}

export async function createCultureType(CreateCultureType: CreateCultureType) {
  return agilleClient.post(`/CultureType`, CreateCultureType)
}

export function updateCultureCheck(
  checks: {
    cultureId: string
    isChecked: boolean
  }[]
) {
  return agilleClient.put(`/CultureType/check-state`, checks)
}
