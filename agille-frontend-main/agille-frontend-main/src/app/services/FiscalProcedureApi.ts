import {buildSearchArgs} from '../utils/functions'
import {agilleClient} from './HttpService'
import {ProprietyType} from './ProprietyApi'

type CreateFiscalProcedureParams = {
  intimationYear: string
  processNumber: string
  taxParams: number[]
  status: number
  proprietyId: string
}

export type FiscalProcedure = {
  cibNumber: string
  createdAt: string
  id: string
  intimationYear: string
  taxParams: number[]
  processNumber: string
  propriety: ProprietyType
  status: number
  stages: ProcedurePhase[]
}

export enum ProcedureStageStatus {
  Issued = 0,

  DeliveredOnTime = 1,

  DeliveredAfterExpiration = 2,

  AnsweredOnTime = 3,

  AnsweredAfterExpiration = 4,

  Closed = 5,

  ForwardedToTaxProcess = 6,

  InProgress = 7,

  Canceled = 8,

  SubpoenaResponse = 9,
}
export enum ProcedureStageType {
  ReleaseNotification = 0,

  NoticeWarn = 1,

  Notice = 2,
}

export enum ProcedureStatus {
  NotStarted = '1',
  InProgress = '2',
  Finished = '3',
}

export type ProcedurePhase = {
  arCode: string
  certificationDate: string | null
  cutOffDate: string | null
  fileUrl: string | null
  id: string
  number: string
  status: ProcedureStageStatus | string
  type: ProcedureStageType | string
  attachmentIds: string[] | null
  attachments?: {
    displayName: string
    externalId?: string
    id?: string
    owner?: string
    ownerId?: string
    type: symbol
    url?: string
  }[]
  fineAmount: number
  trackingCode: string | null
  forwardTermUrl?: string | null
  joiningTermUrl?: string | null
  subjectId: string | null
  subjectName?: string | null
  createdAt?: Date | string
  replyTo?: string | null
}
type TaxProcedureDashboardItens = {
  count: number
  month: string
  year: string
  date: Date
}

export type TaxProcedureApiTypes = {
  total: number
  startingReference: Date
  endingReference: Date
  itens: TaxProcedureDashboardItens[]
}

export function getPaginationParams(page: number, limit: number = 10) {
  return {Limit: limit, Offset: page}
}

export async function getFiscalProcedure(id: string) {
  return await agilleClient.get(`/TaxProcedure/${id}`)
}

export async function getFilteredFiscalProcedures(
  text: string | undefined,
  field: string | undefined,
  page: number,
  limit: number = 6
) {
  const pagination = getPaginationParams(page, limit)
  return agilleClient.get(`/TaxProcedure`, {...buildSearchArgs(text, field), ...pagination})
}

export async function updateFiscalProcedures(
  id: string,
  parsedFiscalProcedure: CreateFiscalProcedureParams
) {
  return agilleClient.put(`/TaxProcedure/${id}`, parsedFiscalProcedure)
}

export async function createFiscalProcedures(parsedFiscalProcedure: CreateFiscalProcedureParams) {
  return agilleClient.post(`/TaxProcedure`, parsedFiscalProcedure)
}

export function getApiPropriety() {
  return agilleClient.get(`/Propriety`)
}
export function selectApiPropriety() {
  return agilleClient.get(`/Propriety/Select`)
}

export function createFiscalProcedurePhase(
  taxProcedureId: string,
  phase: Omit<ProcedurePhase, 'id'>
) {
  return agilleClient.post(`/TaxStage/${taxProcedureId}`, phase)
}
export function updateFiscalProcedurePhase(
  taxProcedureId: string | null,
  phase: Omit<ProcedurePhase, 'id'>
) {
  return agilleClient.put(`/TaxStage/${taxProcedureId}`, phase)
}

export function getFiscalProcedurePhase(taxProcedureId: string | null) {
  return agilleClient.get(`/TaxStage/${taxProcedureId}`)
}
export function getFiscalProcedureDashboard() {
  return agilleClient.get(`/TaxProcedure/dashboard`)
}

export function updateTaxProcedureCultureDeclaration(
  ProprietyId: string | null,
  declaration?: {
    declarations: {
      area?: number
      cultureId: string
      month: number
      maleCount?: number
      femaleCount?: number
    }[]
    year?: string
  }
) {
  return agilleClient.put(`/Propriety/${ProprietyId}/culture-declarations`, declaration)
}

export type ExportTypes = {
  startDate: string
  endDate: string
  url: string
}
export function getExportProcedures(parsedExportProcedures: ExportTypes) {
  return agilleClient.getDownload(`/TaxProcedure/report`, parsedExportProcedures, 'report.pdf')
}

export function getExportActivity(parsedExportProcedures: ExportTypes) {
  return agilleClient.getDownload(`/TaxProcedure/log-report`, parsedExportProcedures, 'report.pdf')
}

export function getExportAgriculture(parsedExportProcedures: ExportTypes) {
  return agilleClient.getDownload(
    `/CultureDeclaration/report/agriculture`,
    parsedExportProcedures,
    'report.pdf'
  )
}
export function getExportAnimals(parsedExportProcedures: ExportTypes) {
  return agilleClient.getDownload(
    `/CultureDeclaration/report/animals`,
    parsedExportProcedures,
    'report.pdf'
  )
}
export function getExportFishArea(parsedExportProcedures: ExportTypes) {
  return agilleClient.getDownload(
    `/CultureDeclaration/report/fish-area`,
    parsedExportProcedures,
    'report.pdf'
  )
}

export function getExportProperty(props: {
  name: string
  document: string
  cib: string
  AllProprieties: boolean
}) {
  return agilleClient.getDownload(
    `/Propriety/bareland-report`,
    {...props},
    'report.pdf'
  )
}

export function getExportCity(props: {year: number; AllProprieties: boolean}) {
  return agilleClient.getDownload(`/Propriety/bareland-report`, props, 'report.pdf')
}
