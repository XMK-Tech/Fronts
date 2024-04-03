import React from 'react'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone, {IFileWithMeta, StatusValue} from 'react-dropzone-uploader'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {agilleClient} from '../../services/HttpService'
import {RootState} from '../../../setup'
import {useSelector} from 'react-redux'
import {DropZoneUpProps} from './DropZoneUp'
import {getFileNameFromUrl} from '../functions'

export const DropZoneModel = (props: DropZoneUpProps) => {
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
    <div style={{width: props.width}} className='text-center '>
      <h3 className='text-center mb-5 mw-250px'>{props.title}</h3>
      <Dropzone
        autoUpload={props.autoUpload}
        accept={props.acceptArchive}
        inputWithFilesContent='Adicionar novos documentos'
        submitButtonContent={'Cancelar'}
        inputContent={
          <>
            {!props.value ? (
              <div>
                <img
                  src={toAbsoluteUrl('/media/svg/files/upload.svg')}
                  className='mb-5'
                  alt=''
                ></img>
                <div className=' text-hover-primary fs-6  mb-2'>Upload de arquivo</div>
                <span
                  style={{
                    color: '#B5B5C3',
                    fontSize: '12px',
                    marginLeft: '10px',
                    marginRight: '10px',
                  }}
                >
                  Clique aqui ou arraste e solte o arquivo
                </span>
              </div>
            ) : (
              <>
                <div>
                  <img
                    src={toAbsoluteUrl('/media/svg/files/pdf.svg')}
                    className='mb-5'
                    alt=''
                  ></img>

                  <div
                    className='fs-6  mb-6'
                    style={{
                      color: '#B5B5C3',
                      fontSize: '12px',
                      marginLeft: '10px',
                      marginRight: '10px',
                    }}
                  >
                    {getFileNameFromUrl(props.value)}
                  </div>
                  <div className='fs-6'>Editar</div>
                </div>
              </>
            )}
          </>
        }
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        styles={{
          dropzone: {
            width: props.width,
            height: props.height,
            borderRadius: 15,
            textAlign: 'center',
            backgroundColor: '#F1FAFF',
          },
          dropzoneActive: {borderColor: 'green'},
        }}
        maxFiles={1}
      ></Dropzone>
      {props.value && (
        <div className='text-center mt-4'>
          <a href={props.value} className='text-center text-hover-info fw-bold fs-6 ms-5'>
            Dowload do arquivo
          </a>
        </div>
      )}
    </div>
  )
}
export const AttachmentDropZoneReview = (props: {
  title?: string
  value?: string
  acceptArchive?: string
  onSubmit: (file: File, attachmentId: string, fileWithMeta: IFileWithMeta, fileUrl: string) => void
}) => {
  const store = useSelector<RootState>((s) => s)
  return (
    <DropZoneModel
      acceptArchive={props.acceptArchive ? props.acceptArchive : ''}
      width={180}
      height={200}
      value={props.value}
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
    ></DropZoneModel>
  )
}
