import { agilleClient } from "./HttpService"

export async function getCommand(reference: string) {
  return await agilleClient.get(`/AgiprevCrawler/command`, {reference}, )
}

export type importManyFilesType ={
    competence: string,
    itens: {
        attachmentId: string,
        dataDescription: string
      }[]
}

export async function importManyFiles(props: importManyFilesType) {
  return await agilleClient.post(`/AgiprevCrawler/import-many-files`, props)
}