import {number} from 'yup'
import {Franchise} from '../modules/auth/redux/AuthTypes'
import {buildSearchArgs} from '../utils/functions'
import {agilleClient, middlewareClient} from './HttpService'
import {CreateUserParams, parseAuditorUser} from './UsersApi'

export function getEntities(page: number, limit: number = 6, text?: string, field?: string) {
  return middlewareClient.get(`/entities`, {
    ...getPaginationParams(page, limit),
    ...buildSearchArgs(text, field),
  })
}
export function selectEntities(fetchAll: boolean = false) {
  const url = `/entities/select${fetchAll ? '' : '/currentUser'}`
  return middlewareClient.get(url)
}

export function getPaginationParams(page: number, limit: number = 10) {
  return {Limit: limit, Offset: page}
}

function getParsedEntitie(entitie: EntitieParams) {
  const contract = {
    name: 'string',
    description: 'string',
    startDate: new Date(),
    endDate: new Date(),
  }
  const parsedEntitie = {
    name: entitie.name,
    franchiseId: entitie.franchiseId,
    entityImage: entitie.entityImage,
    address: entitie.address,
    contract: contract,
    document: entitie.document,
    responsible: entitie.responsible
      ? parseAuditorUser(null, entitie.responsible, entitie.permissions ?? [])
      : null,
    dbName: entitie.dbName,
  }
  return parsedEntitie
}
type EntitieParamsAddress = {
  id?: string
  street?: string
  district?: string
  complement?: string
  zipcode?: string
  number?: string
  type?: number
  typeDescription?: string
  cityId?: string
  stateId?: string
  countryId?: string
  cityName?: string
  stateName?: string
  countryName?: string
}

type EntitieParams = {
  address: EntitieParamsAddress
  document?: string
  name: string
  demoMode?: boolean
  franchiseId: Franchise
  entityImage: string
  responsible?: CreateUserParams
  permissions?: ('ContribuinteDTE' | 'Auditor' | 'AuditorDTE')[]
  dbName?: string
}

export async function getEntitie(id: string) {
  return await middlewareClient.get(`/entities/${id}`)
}

export async function createEntitie(entitie: EntitieParams) {
  const parsedEntitie = getParsedEntitie(entitie)
  return await middlewareClient.post(`/entities`, parsedEntitie)
}

export async function updateEntitie(id: string, entitie: EntitieParams) {
  const parsedEntitie = getParsedEntitie(entitie)

  return await middlewareClient.put(`/entities/${id}`, parsedEntitie)
}

// Agille API

export type EntitiesSettingsAcountParams = {
  name: string
  street: string
  entityImage: string
  content: {
    responsibleName: string
    legalBasisWarning: string
    legalBasisNotice: string
  }
}
type EntitiesBareLandTypes = {
  type?: string
  value?: number
}
type EntitiesCredentials = {
  user?: string
  password?: string
  administrativeCode?: string
  contract?: string
  document?: string
  se?: string
  card?: string
}
type EntitiesISS = {
  responsibleName?: string
  legalBasisWarning?: string
  legalBasisNotice?: string
}
type EntitiesITR = {
  document?: string
  ibgeCode?: string
  state?: string
  seal?: string
  proprietyCount?: 0
  municipalityNumber?: string
  neighborhood?: string
  financeSecretary?: string
  logoUrl?: string
  contractStatus?: true
  demarcationZones?: true
  contractComplaint?: Date
  contractValidity?: Date
  fundraisingPerspective?: number
  fundraisingEffective?: number
  herdIndex?: number
  carShapeFileUrl?: string
  center?: string
  aliquot?: number
  gMapsName?: string
  credentials?: EntitiesCredentials | null
  cityLimitsFile?: string
}
type EntitiesAddress = {
  street?: string
  district?: string
  complement?: string
  zipCode?: string
  number?: string
  type?: number
  cityId?: string
  cityName?: string
  stateId?: string
  stateName?: string
}
type EntitiesDTE = {
  dteModel?: string
}

export type EntitiesType = {
  name?: string
  demoMode?: boolean
  entityImage?: string
  attachmentId?: string
  document?: string
  address?: EntitiesAddress
  iss?: EntitiesISS
  itr?: EntitiesITR
  dte?: EntitiesDTE
  bareLandTypes?: EntitiesBareLandTypes[]
  city?: string
  state?: string
}

export function getEntitiesAgille() {
  return agilleClient.get('/Entities')
}
export function pathEntitiesAgille(parsedEntitiesITR: EntitiesType) {
  return agilleClient.patch('/Entities', parsedEntitiesITR)
}
export function getEntitiesITRSettingsAcount() {
  return agilleClient.get<EntitiesType>('/Entities')
}

export async function updateCarMapUrl(mapUrl: string, cityMapUrl: string) {
  return pathEntitiesAgille({
    itr: {
      carShapeFileUrl: mapUrl,
      cityLimitsFile: cityMapUrl,
    },
  })
}

// End Agille API
