import {Data} from '@react-google-maps/api'
import {buildSearchArgs} from '../utils/functions'
import {TaxPayerDeclarationType} from './DeclarationApi'
import {getPaginationParams} from './EntitiesApi'
import {agilleClient} from './HttpService'
import {PersonType} from './PersonApi'
export type ProprietyCarType = {
  car: string
  cib: string
  id: string
  name: string
  owner?: null
  declarations: TaxPayerDeclarationType
}
type ProprietyAddress = {
  cityId?: string
  cityName?: string
  complement: string
  district?: string
  id?: string
  number: string
  postalCode: string
  street: string
  type: number
  zipcode: string
  carNumber?: string
  certificateNumber?: string
}
type ProprietyCharacteristics = {
  hasElectricity: boolean
  hasFishingPotential: boolean
  hasInternet: boolean
  hasNaturalWaterSpring: boolean
  hasPhone: boolean
  hasPotentialForEcotourism: boolean
  cibNumber?: string
}
type ProprietyContact = {
  email: string
  fax: string
  phoneNumber: string
  phoneType: number
}
export enum PropertyType {
  Chacara = 1,
  Fazenda = 2,
  Estancia = 3,
  Haras = 4,
  Fishing = 5,
  Ranch = 6,
  Sitio = 7,
  Other = 8,
}
export enum settlementType {
  Dominio = 1,
  Possossao = 2,
}
export type ProprietyType = {
  address?: ProprietyAddress
  carNumber: string
  certificateNumber: string
  characteristics: ProprietyCharacteristics
  cibNumber: string
  contact: ProprietyContact
  createdAt?: string
  declaredArea: number
  hasPropertyCertificate: boolean
  hasRegularizedLegalReserve: boolean
  hasSquattersInTheArea: boolean
  id?: string
  incraCode: string
  lastUpdatedAt?: string
  legalReserveArea: number
  municipalRegistration: string
  name: string
  occupancyPercentage: number
  occupancyTime: number
  registration: string
  settlementName?: string
  settlementType?: number
  type?: number
  permanentPreservation: number
  legalReserve: number
  busyWithImprovements: number
  reforestation: number
  goodSuitabilityFarming: number
  regularFitnessFarming: number
  restrictedAptitudeFarming: number
  plantedPasture: number
  //TODO: Validate contract (the name will be changed)
  coordinates: any
  coordenates: any
  location?: any
  ownersDocument: string[]
  linkedCib?: string
  hasPosers: boolean
  owners?: {
    document: string
    name: string
    type: PersonType
  }[]
}
type CreatePropriety = ProprietyType
export type ModelsCattle = {
  reference: number
  cattle: number
  buffalos: number
  equine: number
  sheep: number
  goats: number
}

export type ProprietyCatlle = {
  proprietyId?: string
  procedureId: string
  models: ModelsCattle[]
}

export type ProprietyReport = {
  entityName: string
  proprietyCount: number
  proprieties: {
    proprietyId: string
    hectares: number
    hasOwnersFromAnotherEntity: boolean
  }[]
}

export function getProprieties(
  text: string | undefined,
  field: string | undefined,
  pageNumber: number,
  pageSize: number = 8
) {
  const pagination = getPaginationParams(pageNumber, pageSize)
  return agilleClient.get<ProprietyType[]>(`/Propriety`, {
    ...buildSearchArgs(text, field),
    ...pagination,
  })
}
export function getPropriety(id: string) {
  return agilleClient.get(`/Propriety/${id}`)
}
export async function createPropriety(parsedPropriety: CreatePropriety) {
  return agilleClient.post(`/Propriety`, parsedPropriety)
}
export async function updatePropriety(id: string, parsedPropriety: CreatePropriety) {
  return agilleClient.put(`/Propriety/${id}`, parsedPropriety)
}
export function importProprieties(attachmentId: string) {
  return agilleClient.post(`/Propriety/csv`, {attachmentId})
}
export function getProprietyCar() {
  return agilleClient.get(`/Propriety/car`)
}
export async function updateProprietyCattle(parsedProprietyCattle: ProprietyCatlle) {
  return agilleClient.put(`/ProprietyCattle`, parsedProprietyCattle)
}
export function getProprietyCattle(id: string) {
  return agilleClient.get(`/ProprietyCattle/${id}`)
}
export function getProprietyReport() {
  return agilleClient.get(`/Propriety/dashboard`)
}
