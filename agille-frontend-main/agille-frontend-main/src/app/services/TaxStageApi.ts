import {ProcedurePhase} from './FiscalProcedureApi'
import {agilleClient} from './HttpService'

export type JoinTermProps = {
  taxStageId: string
  homePageNumber: number
  finalPageNumber: number
  atualPageNumber: number
  spaceForLetterhead: boolean
}
export type ForwardTermProps = {
  taxProcedureId: string
  homePageNumber: number
  finalPageNumber: number
  atualPageNumber: number
  spaceForLetterhead: boolean
  withObjection: boolean
}
type ArDevolution = {
  street: string
  number: string
  cityName: string
  stateName: string
  complement: string
  zipCode: string
  description: string
}
type ArRecipient = {
  street: string
  number: string
  cityName: string
  stateName: string
  complement: string
  zipCode: string
  description: string
}
export type ReplyType = {
  certificationDate: Date | string
  type?: number
  status: number | string
  attachmentIds: string[] | null
}
export type ArTermProps = {
  taxStageId: string
  additionalInformation: string
  recipient: ArRecipient
  devolution: ArDevolution
}

export async function postArTerm(parsedArTerm: ArTermProps) {
  return agilleClient.postDownload(`/TaxStage/ar-term`, parsedArTerm, 'termo de AR.pdf')
}
export async function postJoinTerm(parsedJoinTerm: JoinTermProps) {
  return agilleClient.postDownload(`/TaxStage/join-term`, parsedJoinTerm, 'termo de juntada.pdf')
}

export async function postForwardTerm(parsedForwardTerm: ForwardTermProps) {
  return agilleClient.postDownload(
    `/TaxStage/forward-term`,
    parsedForwardTerm,
    'Termo de encaminhamento.pdf'
  )
}

export async function postReply(id: string | null | undefined, parsedReply: ReplyType) {
  return agilleClient.post(`/TaxStage/${id}/reply`, parsedReply)
}

export async function getArTermAddress(taxStageId: string) {
  return agilleClient.get(`/TaxStage/ar-term/address/${taxStageId}`)
}
