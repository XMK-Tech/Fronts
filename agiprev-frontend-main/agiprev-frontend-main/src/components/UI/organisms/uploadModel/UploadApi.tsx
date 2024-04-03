import Api, { getResp } from '../../../../services/Api';

export type AttachmentType = {
  id: string;
  type: string;
  owner: string;
  ownerId: string;
  url: string;
  externalId: string;
  displayName: string;
};

export async function uploadFiles(files: File[]) {
  //TODO: get ID from file
  const attachments: AttachmentType[] = [];
  for (const file of files) {
    const attachment = await uploadFile(file);
    attachments.push(attachment);
  }
  return attachments;
}

/**
 * This function doesn't use React Query because it is not related to any
 * data fetching. It is just a function that uploads a file to the server.
 * @param file file to be uploaded
 */
async function uploadFile(file: File) {
  const data = await Api.postForm('/Attachment', {
    Attachment: file,
    Owner: 'Owner',
    OwnerId: 'OwnerId',
  });

  return getResp<AttachmentType>(data);
}
