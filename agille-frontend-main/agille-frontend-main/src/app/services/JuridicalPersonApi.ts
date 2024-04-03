import {number} from 'yup'
import {buildSearchArgs} from '../utils/functions'
import {agilleClient} from './HttpService'

type CreateUserParams = {
  username: string
  secondaryPhoneNumber?: string
  phoneNumber: number
  document: string
  email: string
  municipalRegistration: string
  fullname?: string
  enrollment: string
  name: string
}

export type JuridicalPersonParams = {
  document: string
  municipalRegistration: string
  name: string
  isCardOperator?: boolean
  displayName?: string
  date?: Date
  startDate?: Date
  profilePicUrl?: string
  emails?: string[]
  phones?: Phone[]
  addresses?: Address[]
  cardRate?: number
  serviceTypesDescriptionIds?: string[]
}

export type Address = {
  id?: string
  street?: string
  district?: string
  number?: string
  county?: string
  complement?: string
  zipcode?: string
  type?: number
  cityId?: string
  owner?: string
  ownerId?: string
}

export type Phone = {
  number: string
  type: number
  typeDescription: string
}
export const defaultJuridicalPersonValues = {
  id: '',
  name: '',
  document: '',
  municipalRegistration: '',
}
export type JuridicalPerson = {
  id: string
  personId: string
  name: string
  fullName: string
  email: string
  municipalRegistration: string
  addresses: Address[]
  cardRate: number
  date: string
  createdAt?: string
  displayName: string
  document: string
  phones: Phone[]
}

export type CompanyCardRate = {
  cardOperatorId: string
  companyDocument: string
  companyName: string
  cardOperatorName: string
  companyId: string
  id: string
  rate: number
}

export type CompanyCardRateClient = {
  id: string
  document: string
  name: string
  displayName: string
  operatorDocument: string
  rate: number
}

export function getJuridicalPersonsTransactions(
  document: string,
  dataCrossId: string,
  page: number,
  limit: number = 10
) {
  return getTransactions(page, limit, dataCrossId, document)
}

export function getCardOperatorTransactions(
  document: string,
  dataCrossId: string,
  page: number,
  limit: number = 10
) {
  return getTransactions(page, limit, dataCrossId, null, document)
}

function getTransactions(
  page: number,
  limit: number,
  dataCrossId: string,
  document: string | null,
  operatorDocument?: string
) {
  return agilleClient.get(`/juridical-persons/transactions`, {
    ...getPaginationParams(page, limit),
    DataCrossId: dataCrossId,
    Document: document,
    CardOperatorDocument: operatorDocument,
  })
}

export function getJuridicalPersons(
  page: number,
  limit: number = 10,
  isCardOperator: boolean | null = null,
  text?: string | undefined,
  field?: string | undefined
) {
  return agilleClient.get(`/juridical-persons`, {
    ...getPaginationParams(page, limit),
    isCardOperator,
    ...buildSearchArgs(text, field),
  })
}
//TODO : altera rota
export function getTaxPayersWithRates(
  operatorId: string,
  value: string,
  field: string,
  page: number,
  limit: number = 10
) {
  return agilleClient.get(`/juridical-persons`, {
    ...getPaginationParams(page, limit),
    ...buildSearchArgs(value, field),
    operatorId,
  })
}

export function getCompanyCardRateClient(
  id: string,
  value: string,
  field: string,
  page: number,
  limit: number = 10
) {
  return agilleClient.get(`/CompanyCardRate/companies/${id}`, {
    ...getPaginationParams(page, limit),
    ...buildSearchArgs(value, field),
  })
}

export function getJuridicalPerson(id: string) {
  return agilleClient.get<JuridicalPerson>(`/juridical-persons/${id}`)
}
export function getPaginationParams(page: number, limit: number = 10) {
  return {Limit: limit, Offset: page}
}
export async function createJuridicalPerson(parsedJuridicalPerson: JuridicalPersonParams) {
  return await agilleClient.post(`/juridical-persons`, parsedJuridicalPerson)
}

export async function updateJuridicalPerson(id: string, user: JuridicalPersonParams) {
  return await updatePersons(id, {
    document: user.document,
    municipalRegistration: user.document,
    name: user.name,
    isCardOperator: user.isCardOperator,
    cardRate: user.cardRate,
    serviceTypesDescriptionIds: user.serviceTypesDescriptionIds,
    addresses: user.addresses,
    startDate: user.startDate,
  })
}

async function updatePersons(id: string, user: JuridicalPersonParams) {
  return await agilleClient.put(`/juridical-persons/${id}`, user)
}
