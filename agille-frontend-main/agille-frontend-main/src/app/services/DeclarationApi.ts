import {parse} from 'path'
import {buildSearchArgs} from '../utils/functions'
import {agilleClient} from './HttpService'
import {getPaginationParams} from './UsersApi'

type Declarations = {
  area: number
  landValue: number
  description: string
}
export type ITRDeclarationType = {
  declarations: Declarations[]
  totalITRValue: number
}

export type BareLandType = {
  goodAptitude: number
  regularAptitude: number
  restrictedFitness: number
  plantedPastures: number
  forestryOrNaturalPasture: number
  preservationOfFaunaOrFlora: number
  year?: string
  report?: string
}

export type TaxPayerDeclarationType = {
  total: number
  permanentPreservationArea: number
  legalReserveArea: number
  taxableArea: number
  areaOccupiedWithWorks: number
  usableArea: number
  areaWithReforestation: number
  areaUsedInRuralActivity: number
  year?: string
  cib?: string
  owner?: string
}
export async function getTaxPayerDeclarations(
  page: number,
  limit: number = 6,
  text?: string,
  field?: string
) {
  return agilleClient.get(`/TaxPayerDeclaration/list`, {
    ...getPaginationParams(page, limit),
    ...buildSearchArgs(text, field),
  })
}
export function importDeclarations(attachmentId: string) {
  return agilleClient.post(`/TaxPayerDeclaration/csv`, {attachmentId})
}
export function getITRDeclartion(id: string) {
  return agilleClient.get(`/ITRDeclaration/${id}`)
}
export function getBareLand(year: string) {
  return agilleClient.get(`/BareLand`, {year})
}
export function putBareLand(parsedBareLand: BareLandType) {
  return agilleClient.put(`/BareLand`, parsedBareLand, {params: {year: parsedBareLand.year}})
}
export function getTaxPayerDeclaration(year: string, cib: string) {
  return agilleClient.get(`/TaxPayerDeclaration`, {year, cib})
}
export function putTaxPayerDeclaration(parsedTaxPayerDeclaration: TaxPayerDeclarationType) {
  return agilleClient.put(`/TaxPayerDeclaration`, parsedTaxPayerDeclaration, {
    params: {year: parsedTaxPayerDeclaration.year, cib: parsedTaxPayerDeclaration.cib},
  })
}
