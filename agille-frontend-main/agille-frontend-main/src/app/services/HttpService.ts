import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {saveAs} from 'file-saver'
import {IFileWithMeta, IUploadParams} from 'react-dropzone-uploader'
import environment from '../../setup/environment'

export type BaseApiResponse<T> = {
  data: T
  rawResponse: any
  metadata: {
    sortColumn: string
    sortDirection: string
    offset: number
    limit: number
    quickSearch: string
    dataSize: number
  }
}

function getData<T = any>(res: AxiosResponse<any>): BaseApiResponse<T> {
  return {
    data: res?.data?.content?.data,
    metadata: res?.data?.content?.metadata ?? {},
    rawResponse: res?.data,
  }
}

const downloadConfig: AxiosRequestConfig = {
  responseType: 'blob',
}
function download(response: BaseApiResponse<any>, filename: string) {
  saveAs(response.rawResponse, filename)
}
const getAxiosDefaultHeaders = (state: any) => {
  const tenantId = state?.auth?.selectedEntity
  const accessToken = state?.auth?.accessToken
  return {tenantId, accessToken}
}

function httpClientFactory(baseUrl: string) {
  const client = {
    baseUrl,
    getUploadParams: (file: IFileWithMeta, store: any): IUploadParams => {
      const axiosHeaders = getAxiosHeaders()
      const storeHeaders = getAxiosDefaultHeaders(store)
      return {
        url: `${baseUrl}/Attachment`,
        headers: {
          ...axiosHeaders,
          ...storeHeaders,
        },
        fields: {
          owner: 'Agille',
          ownerId: 'Agille',
          Attachment: file.file,
        },
      }
    },
    async postDownload(url: string, obj: any, filename: string) {
      const res = await this.post(url, obj, downloadConfig)
      download(res, filename)
      return res
    },
    async getDownload(url: string, obj: any, filename: string) {
      const res = await this.get(url, obj, downloadConfig)
      download(res, filename)
      return res
    },
    async post(url: string, obj: any, config?: AxiosRequestConfig) {
      const res = await axios.post(`${baseUrl}${url}`, obj, config)
      return getData(res)
    },
    async put(url: string, obj: any, config?: AxiosRequestConfig) {
      const res = await axios.put(`${baseUrl}${url}`, obj, config)
      return getData(res)
    },
    async patch(url: string, obj: any, config?: AxiosRequestConfig) {
      const res = await axios.patch(`${baseUrl}${url}`, obj, config)
      return getData(res)
    },
    async delete(url: string, config?: AxiosRequestConfig) {
      const res = await axios.delete(`${baseUrl}${url}`, config)
      return getData(res)
    },
    async get<T = any>(url: string, obj?: any, config?: AxiosRequestConfig) {
      const res = await axios.get(`${baseUrl}${url}`, {
        params: obj,
        ...config,
      })
      return getData<T>(res)
    },
  }
  return client
}

export const middlewareClient = httpClientFactory(environment.middlewareApi)

export const agilleClient = httpClientFactory(environment.agilleApi)

export const certClient = httpClientFactory('https://certificate.agille.digital/api/v1')

function getAxiosHeaders() {
  return axios.defaults.headers.common
}
