import {agilleClient, BaseApiResponse} from './HttpService'

export type UploadFile = {
  attachment: File
  owner: string
  ownerId: string
}

export type Attachment = {
  url: string
  id: string
}

export const uploadAttachment = async (owner: UploadFile) => {
  const fd = new FormData()
  fd.append('Owner', owner.owner)
  fd.append('OwnerId', owner.ownerId)
  fd.append('Attachment', owner.attachment)
  const response = await agilleClient.post('/Attachment', fd, {
    headers: {'Content-Type': 'multipart/form-data'},
    transformRequest: () => fd,
  })
  return response as BaseApiResponse<Attachment>
}
