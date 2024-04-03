import {buildSearchArgs} from '../utils/functions'
import {agilleClient} from './HttpService'

export enum PersonType {
  Juridical = 1,
  Physical = 2,
}

type AddressesJuridicalPerson = {
  id?: string
  street: string
  district: string
  number: string
  complement: string
  zipcode?: string
  type?: number
  cityId?: string
  owner?: string
  ownerId?: string
  function?: number
}
type PhonesJuridicalPerson = {
  number: string
  type?: number
  typeDescription?: string
}

type CreateJuridicalPerson = {
  name: string
  document: string
  municipalRegistration: string
  displayName: string
  date: string
  profilePicUrl?: string
  isCardOperator?: boolean
  cardRate?: number
  emails: string[]
  phones: PhonesJuridicalPerson[]
  socialMedias?: [
    {
      url?: string
      type?: number
    }
  ]
  addresses: AddressesJuridicalPerson[]
  serviceTypesDescriptionIds?: string[]
}
// type CreatePhysicalPerson = {
//   name: string
//   displayName: string
//   document: string
//   personType: string
// }
type AddressesPhysicalPerson = {
  id?: string
  street: string
  district: string
  number: string
  complement: string
  zipcode?: string
  type: number
  cityId?: string
  owner?: string
  ownerId?: string
  function?: number
}
type PhonesPhysicalPerson = {
  number: string
  type?: number
  typeDescription?: string
}
export type CreatePhysicalPerson = {
  name: string
  document: string
  municipalRegistration: string
  displayName: string
  generalRecord: string
  date: string
  profilePicUrl?: string
  isCardOperator?: boolean
  cardRate?: number
  emails: string[]
  phones: PhonesPhysicalPerson[]
  hasInventoryPerson: boolean

  hasLegalRepresentative: boolean

  socialMedias?: [
    {
      url?: string
      type?: number
    }
  ]
  addresses: AddressesPhysicalPerson[]
  serviceTypesDescriptionIds?: string[]
}

export function getJuridicalPersons(page: number, limit: number = 10, isCardOperator?: boolean) {
  return agilleClient.get(`/juridical-persons`, {
    ...getPaginationParams(page, limit),
    isCardOperator,
  })
}
export function getPersons(
  text: string | undefined,
  field: string | undefined,
  page: number,
  limit: number = 10
) {
  const pagination = getPaginationParams(page, limit)
  return agilleClient.get(`/persons`, {
    ...buildSearchArgs(text, field),
    ...pagination,
  })
}
export function selectPersons() {
  return agilleClient.get(`/persons/Select`)
}

export function putUsers() {
  return agilleClient.put(`/persons/users`, {})
}
export function putUser(id: string) {
  return agilleClient.put(`/persons/user/${id}`, {})
}

export function getPersonById(id: string) {
  return agilleClient.get(`/persons/${id}`)
}

export function importPersons(attachmentId: string) {
  return agilleClient.post(`/persons/csv`, {attachmentId})
}
export function getJuridicalPerson(id: string) {
  return agilleClient.get(`/juridical-persons/${id}`)
}
export function getPaginationParams(page: number, limit: number = 10) {
  return {Limit: limit, Offset: page}
}
export async function createJuridicalPerson(parsedJuridicalPerson: CreateJuridicalPerson) {
  return agilleClient.post(`/juridical-persons`, parsedJuridicalPerson)
}

export async function updateJuridicalPerson(
  id: string,
  parsedJuridicalPerson: CreateJuridicalPerson
) {
  return agilleClient.put(`/juridical-persons/${id}`, parsedJuridicalPerson)
}

export function getPhysicalPersons(page: number, limit: number = 10) {
  return agilleClient.get(`/physical-persons`, {...getPaginationParams(page, limit)})
}

export function getPhysicalPerson(id: string) {
  return agilleClient.get(`/physical-persons/${id}`)
}

export async function createPhysicalPerson(parsedJuridicalPerson: CreatePhysicalPerson) {
  return agilleClient.post(`/physical-persons`, parsedJuridicalPerson)
}

export async function updatePhysicalPerson(
  id: string,
  parsedJuridicalPerson: CreatePhysicalPerson
) {
  return agilleClient.put(`/physical-persons/${id}`, parsedJuridicalPerson)
}
export function getCompanyCardRate(id: string, page: number, limit: number) {
  return agilleClient.get(`/CompanyCardRate/operator/${id}`, {...getPaginationParams(page, limit)})
}
export function getCompanyCardRateAverage(id: string) {
  return agilleClient.get(`/CompanyCardRate/operator/${id}/rate-average`)
}

export async function getApiServiceType() {
  return agilleClient.get(`/ServiceType`)
}

export function getServiceTypePerson(id: string) {
  return agilleClient.get(`/ServiceType/person/${id}`)
}
export function getNotification() {
  return agilleClient.get(`/Notification`)
}
export function getNoticeId(id: string) {
  return agilleClient.get(`/Notice/${id}`)
}
export function createCompanyCardRate(rate: number, companyId: string, cardOperatorId: string) {
  return agilleClient.post(`/CompanyCardRate`, {
    rate: rate,
    companyId: companyId,
    cardOperatorId: cardOperatorId,
  })
}

export function deleteCompanyCardRate(id: string) {
  return agilleClient.delete(`/companyCardRate/${id}`)
}

export function selectPersonsByPropriety(propriety: string) {
  return agilleClient.get(`/propriety/${propriety}/SelectProprietaries`)
}
