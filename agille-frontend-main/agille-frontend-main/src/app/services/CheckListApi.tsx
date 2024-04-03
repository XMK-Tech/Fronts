import {string} from 'yup/lib/locale'
import {agilleClient} from './HttpService'

export enum CheckListStatus {
  PEDING = 0,
  SENT = 1,
  APROVED = 2,
  REJECTED = 3,
}

export type ChecklistAttachment = {
  id: string
  type: string
  owner: string
  ownerId: string
  url: string
  externalId: string
  displayName: string
}

export type CheckListType = {
  id: string
  text: string
  status: number
  justification: string
  lastUpdateAt: Date
  attachments: ChecklistAttachment[]
}

export type AttachmentsType = {
  attachments: string[]
}
type UpdateCheckListStatus = {
  status: number
  justification?: string
}
export async function getChecklist() {
  return agilleClient.get<CheckListType[]>(`/Checklist`)
}

export async function updateCheckList(id: string, parsedCheckList: AttachmentsType) {
  return agilleClient.put(`/CheckList/attachments/${id}`, parsedCheckList)
}

export async function postChecklistStatus(
  id: string,
  parsedCheckListStastus: UpdateCheckListStatus
) {
  return agilleClient.put(`/Checklist/${id}/status`, parsedCheckListStastus)
}
