import 'react-dropzone-uploader/dist/styles.css'
import Dropzone, {IFileWithMeta, IUploadParams, StatusValue} from 'react-dropzone-uploader'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import {agilleClient} from '../../services/HttpService'
import {RootState} from '../../../setup'
import {useSelector} from 'react-redux'
import React from 'react'

export type DropZoneUpProps = {
  acceptArchive: string
  width: number
  height: number
  title: string
  url?: string
  onChangeFile: (files: File[], filesMeta: IFileWithMeta[]) => void
  onStatusChange?: ({meta, file}: IFileWithMeta, status: StatusValue) => void
  getUploadParams?(file: IFileWithMeta): IUploadParams | Promise<IUploadParams>
  autoUpload?: boolean
  value?: string
}

export const DropZoneUp = (props: DropZoneUpProps) => {
  const getUploadParams =
    props.getUploadParams ||
    (() => {
      return {url: props.url as string}
    })
  const handleChangeStatus = (fileWithMeta: IFileWithMeta, status: StatusValue) => {
    if (props.onStatusChange) {
      props.onStatusChange(fileWithMeta, status)
    }
  }

  const handleSubmit = (files: IFileWithMeta[], allFiles: IFileWithMeta[]) => {
    allFiles.forEach((f) => f.remove())
    const newFiles = files.map((f) => f.file)
    props.onChangeFile(newFiles, files)
  }

  return (
    <div className='text-center d-flex justify-content-center flex-column align-items-center'>
      <h3 className='mb-5 mw-250px'>{props.title}</h3>
      <Dropzone
        autoUpload={props.autoUpload}
        accept={props.acceptArchive}
        inputWithFilesContent='Adicionar novos documentos'
        submitButtonContent={'Cancelar'}
        inputContent={
          <div>
            <div
              className='mb-2'
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img
                src={toAbsoluteUrl('/media/svg/files/upload.svg')}
                className='mb-2 mw-50'
                alt=''
              ></img>
              <span style={{color: 'red', fontSize: '8px'}}>
                O tamanho máximo de arquivo permitido para upload <br /> é de 5MB
              </span>
            </div>

            <div className=' class="text-hover-primary fs-5  mb-2'>Upload de arquivo</div>

            <span style={{color: '#B5B5C3', fontSize: '12px'}}>
              Clique aqui ou arraste e solte o arquivo
            </span>
          </div>
        }
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        styles={{
          dropzone: {
            width: props.width,
            height: props.height,
            borderRadius: 15,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: '#009EF7',
            textAlign: 'center',
            backgroundColor: '#F1FAFF',
          },

          dropzoneActive: {borderColor: 'green'},
        }}
        maxFiles={1}
      ></Dropzone>
    </div>
  )
}

export const AttachmentDropZone = (props: {
  title?: string
  acceptArchive?: string
  onSubmit: (file: File, attachmentId: string, fileWithMeta: IFileWithMeta, fileUrl: string) => void
}) => {
  const store = useSelector<RootState>((s) => s)
  return (
    <DropZoneUp
      acceptArchive={props.acceptArchive ? props.acceptArchive : ''}
      width={250}
      height={250}
      title={props.title || ''}
      getUploadParams={(file) => {
        const params = agilleClient.getUploadParams(file, store)
        return params
      }}
      onChangeFile={() => {}}
      onStatusChange={(file, status) => {
        if (status !== 'done') return
        if (file) {
          const response = JSON.parse(file.xhr?.response || '')
          props.onSubmit(file.file, response?.content?.data?.id, file, response?.content?.data?.url)
        }
      }}
    ></DropZoneUp>
  )
}
