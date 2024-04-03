import {buildSearchArgs, getPaginationParams} from '../utils/functions'
import {agilleClient} from './HttpService'

export function createNoticeTemplate(
  module: number,
  template: string,
  modelName: string,
  type: number,
  daysToExpire: number
) {
  return agilleClient.post('/NoticeTemplate', {
    module: module,
    htmlTemplate: template,
    name: modelName,
    type: type,
    daysToExpire,
  })
}

export function editNoticeTemplate(
  module: number,
  id: string,
  template: string,
  modelName: string,
  type: number,
  daysToExpire?: number
) {
  return agilleClient.put(`/NoticeTemplate/${id}`, {
    htmlTemplate: template,
    name: modelName,
    type: type,
    daysToExpire,
    module: module,
  })
}

export function putNoticeProtocol(
  id: string,
  document: string,
  name: string,
  phone: string,
  isContribuint?: boolean,
  date?: Date
) {
  const signedBy = !isContribuint ? '0' : '1'
  return agilleClient.put(`/Notice/${id}/return-protocol`, {
    document: document,
    name: name,
    phone: phone,
    signedBy: signedBy,
    date: date,
  })
}
export function putNoticeAction(
  noticeId: string,
  status: number,
  description: string,
  date: string
) {
  return agilleClient.put(`/Notice/status`, {
    noticeId: noticeId,
    status: status,
    description: description,
    date: date,
  })
}

export function downloadNoticePreview(template: string) {
  return agilleClient.postDownload('/notice/preview', {template}, 'preview.pdf')
}

export type NoticeTemplate = {
  id: string
  htmlTemplate: string
  name: string
  type: NoticeType
}

export enum NoticeType {
  Notice,
  Warning,
  Finding,
  Launch,
  Summons,
}

export function getNoticeToText(type: NoticeType, plural: boolean = false) {
  if (plural) {
    switch (type) {
      case NoticeType.Notice:
        return ' Notificações '
      case NoticeType.Warning:
        return ' Autuações '
      case NoticeType.Finding:
        return ' Constatações '
      case NoticeType.Launch:
        return ' Lançamentos '
      case NoticeType.Summons:
        return ' Intimações '
    }
  } else {
    switch (type) {
      case NoticeType.Notice:
        return ' Notificação '
      case NoticeType.Warning:
        return ' Autuação '
      case NoticeType.Finding:
        return ' Constatação '
      case NoticeType.Launch:
        return ' Lançamento '
      case NoticeType.Summons:
        return ' Intimação '
    }
  }
}

export function getNoticeColor(type: NoticeType) {
  switch (type) {
    case NoticeType.Notice:
      return 'text-warning'
    case NoticeType.Warning:
      return 'text-danger'
    case NoticeType.Finding:
      return 'text-success'
    case NoticeType.Launch:
      return 'text-primary'
    case NoticeType.Summons:
      return 'text-info'
  }
}

export function getNoticeTemplatesByType(module: string, type: string, page: number = 0, limit: number = 6) {
  return agilleClient.get(`/NoticeTemplate`, {
    ...buildSearchArgs(type, 'type'),
    ...buildSearchArgs(module, 'module'),
    ...getPaginationParams(page, limit),
  })
}

export function getNoticeTemplate(module: string) {
  return agilleClient.get(`/NoticeTemplate`, {
    ...buildSearchArgs(module, 'module'),
  })
}

export function getNoticeTemplateDetaisl(id: string) {
  return agilleClient.get(`/NoticeTemplate/${id}`)
}

export function getNoticeTemplateFields(id: string) {
  return agilleClient.get(`/NoticeTemplate/${id}/fields`)
}

export function createNoticeManual(
  templateId: string,
  subjectId: string,
  type: NoticeType,
  aliquot: number,
  observation: string,
  daysToExpire: number,
  rateType: number,
  tags: any
) {
  return agilleClient.post('/Notice/manual', {
    templateId: templateId,
    subjectId: subjectId,
    type: type,
    aliquot: aliquot,
    observation: observation,
    daysToExpire: daysToExpire,
    rateType: rateType,
    tags: tags,
  })
}

export function createNotice(
  templateId: string,
  divergencyIds: string[],
  aliquot: number,
  observation: string,
  type: NoticeType,
  daysToExpire: number,
  rateType?: number
) {
  return agilleClient.post('/Notice', {
    templateId: templateId,
    divergencyIds: divergencyIds,
    aliquot: aliquot,
    observation: observation,
    type,
    daysToExpire,
    rateType: rateType,
  })
}

export type Notice = {
  id: string
  templateId: string
  url: string
  divergencyIds: string[]
  type: NoticeType
  aliquot: number
  observation: string
  name: string
}

export function getNotices(
  type: NoticeType,
  text: string | undefined,
  field: string | undefined,
  pageNumber: number,
  pageSize: number = 6
) {
  const pagination = getPaginationParams(pageNumber, pageSize)
  return agilleClient.get('/Notice', {
    Type: type,
    ...buildSearchArgs(text, field),
    ...pagination,
  })
}

export async function taxProcessReport(template: any) {
  return agilleClient.postDownload('/TaxProcess', template, 'relatorio.pdf')
}

export type JoinTermProps = {
  homePageNumber: number
  finalPageNumber: number
  atualPageNumber: number
  spaceForLetterhead: boolean
  withObjection: boolean
  proprietyCib: string
  documentNumber: string
  processNumber: string
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
export type ArTermProps = {
  additionalInformation: string
  recipient: ArRecipient
  devolution: ArDevolution
}

export async function postAr(id: string, parsedAr: ArTermProps) {
  return agilleClient.postDownload(`/AR/${id}`, parsedAr, 'termo de AR.pdf')
}
export async function postJoin(id: string, parsedJoin: JoinTermProps) {
  return agilleClient.postDownload(`/AR/join-term/${id}`, parsedJoin, 'termo de juntada.pdf')
}

export async function getArAddress(subjectId: string) {
  return agilleClient.get(`/AR/address/${subjectId}`)
}
