import {CultureType} from './CultureTypeApi'
import {agilleClient} from './HttpService'

export type CultureDeclaration = {
  year?: string,
  month: number
  maleCount: number
  femaleCount: number
  count: number
  area: number
  cultureId: string
  id: string
  userId: string
  taxProcedureId: string
  cultureName: string
  type: CultureType
  typeDescription: string
  monthDescription: string
}

type CreateCultureDeclaration = {

  month: number
  maleCount: number
  femaleCount: number
  count: number
  area: number
  cultureId: string
  ProprietyId: string
}

export function getCultureDeclaration(ProprietyId: string) {
  return agilleClient.get(`/CultureDeclaration`, {
    ProprietyId: ProprietyId,
  })
}

export async function createCultureDelaration(CreateCultureDeclaration: CreateCultureDeclaration) {
  return agilleClient.post(`/CultureDeclaration`, CreateCultureDeclaration)
}
