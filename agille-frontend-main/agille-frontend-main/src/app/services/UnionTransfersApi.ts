import {ExportTypes} from './FiscalProcedureApi'
import {agilleClient} from './HttpService'

export type UnionTransfers = {
  value: number
  date: Date | string
  status: number
  id: string
}
type UnionTransfersItens = {
  value: number
  month: string
  year: string
  date?: Date
}
export type UnionTransfersDashboard = {
  totalValue: number
  startingReference?: Date
  endingReference?: Date
  itens: UnionTransfersItens[]
}
const enum UnionTransfersStatus {
  ACTIVE = 0,
  INACTIVE = 1,
}
export const getStatus = (status: number) => {
  switch (status) {
    case UnionTransfersStatus.ACTIVE:
      return 'Ativa'
    case UnionTransfersStatus.INACTIVE:
      return 'Inativa'
  }
}

export function getUnionTransfers() {
  return agilleClient.get(`/UnionTransfers`)
}
export function getUnionTransfersDashboard() {
  return agilleClient.get(`/UnionTransfers/dashboard`)
}
export function postUnionTransfers(parsedUnionTransfers: UnionTransfers) {
  return agilleClient.post(`/UnionTransfers`, parsedUnionTransfers)
}
export function putUnionTransfers(id: string, parsedUnionTransfers: UnionTransfers) {
  return agilleClient.put(`/UnionTransfers/${id}`, parsedUnionTransfers)
}
export function getExportTransfers(parsedExportTransfers: ExportTypes) {
  return agilleClient.getDownload(`/UnionTransfers/report`, parsedExportTransfers, 'report.pdf')
}
