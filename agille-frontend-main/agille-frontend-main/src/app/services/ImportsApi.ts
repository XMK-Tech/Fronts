import {buildSearchArgs} from '../utils/functions'
import {agilleClient} from './HttpService'
import {getPaginationParams} from './UsersApi'

export function getImports(page: number, limit: number = 6, text?: string, field?: string) {
  return agilleClient.get('/ImportFile', {
    ...getPaginationParams(page, limit),
    ...buildSearchArgs(text, field),
  })
}

export enum ImportType {
  Transactions,
  Invoice,
}

export type ImportFile = {
  attachmentId: string
  type: ImportType
  isSimplified: boolean
}

export function createImport({attachmentId, type, isSimplified}: ImportFile) {
  return agilleClient.post('/ImportFile', {attachmentId, type, isSimplified})
}

export function notifyImportFileDownloaded(id: string) {
  return agilleClient.post(`/ImportFile/download/${id}`, null)
}

export function uploadManualFile(id: string, attachmentId: string) {
  return agilleClient.post(`/ImportFile/manual-upload`, {id, attachmentId})
}

export function approveImport(id: string) {
  return agilleClient.post(`/ImportFile/approve/${id}`, null)
}

export function rejectImport(id: string, reason: string) {
  return agilleClient.post(`/ImportFile/reject/${id}`, {reason})
}
export function approveImportReplacement(id: string) {
  return agilleClient.post(`/ImportFile/approve-replacement/${id}`, null)
}
export function rejectImportReplacement(id: string) {
  return agilleClient.post(`/ImportFile/reject-replacement/${id}`, null)
}

export function getEntries(page: number, limit: number, startDate: Date, endDate: Date) {
  return agilleClient.get('/ImportFile/entries', {
    ...getPaginationParams(page, limit),

    startingReference: startDate,
    endingReference: endDate,
  })
}
