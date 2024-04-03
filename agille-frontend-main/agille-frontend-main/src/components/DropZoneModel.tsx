import {useRef, useState} from 'react'
import Dropzone, {FileWithPath} from 'react-dropzone'
import Table from '../app/components/Table/Table'
import {mapContent} from '../app/components/Table/TableHead'
import {uploadAttachment} from '../app/services/AttachmentApi'
import EmptyStateList from '../app/utils/components/EmptyStateList'
import IsLoadingList from '../app/utils/components/IsLoadingList'

export type Files = {
  id: string
  displayName?: string
  name: string
  type: string
  url?: string
}

type DropZoneModelProps = {
  title: string
  onUploaded?: (attachmentId: string[], files: Files[]) => void
  files?: Files[]
}

export default function DropZoneModel(props: DropZoneModelProps) {
  const [loading, setLoading] = useState(false)
  const dateRef = useRef<Date>()
  const [files, setFiles] = useState<Files[]>([])

  const handleFileDrop = async (acceptedFiles: FileWithPath[]) => {
    setLoading(true)
    const ids: string[] = [...allFiles.map((f) => f.id)]
    const startedAt = new Date()
    dateRef.current = startedAt
    for (const file of acceptedFiles) {
      if (dateRef.current.getTime() !== startedAt.getTime()) {
        break
      }
      const response = await uploadAttachment({
        attachment: file,
        owner: 'Attachment',
        ownerId: '1',
      })
      ids.push(response.data.id)
    }
    const uploadedFilesData: Files[] = acceptedFiles.map((file, i) => ({
      id: ids[i + allFiles.length],
      name: file.name,
      type: file.type,
    }))

    if (dateRef.current.getTime() === startedAt.getTime()) {
      setLoading(false)
      props.onUploaded?.(ids, allFiles)
      setFiles((prevArquivos) => [...prevArquivos, ...uploadedFilesData])
    }
  }

  const handleRemoveFile = (index: number) => {
    const file = allFiles[index]
    if (props.files?.includes(file)) {
      const remainingFiles = allFiles.filter((f) => f !== file)
      props.onUploaded?.(
        remainingFiles.map((f) => f.id),
        remainingFiles
      )
    } else {
      setFiles((prevArquivos) => {
        return prevArquivos.filter((f) => f !== file)
      })
    }
  }
  const allFiles = [...(props.files || []), ...files]
  const renderFileList = () => {
    if (!allFiles || allFiles.length === 0) {
      return <EmptyStateList text='Lista Vazia' />
    }
    return (
      <Table
        rows={allFiles.map((file, index) => ({
          columns: [
            ...mapContent([file.type, file.name], 'normal'),
            {
              content: (
                <div className='d-flex'>
                  {props.files?.length === undefined ||
                    (props.files.length > 0 && (
                      <div style={{marginRight: 4, marginLeft: 4}}>
                        <a href={file.url} className='btn btn-sm btn-primary m-5px'>
                          <i className='fas fa-download  p-0'></i>
                        </a>
                      </div>
                    ))}

                  <div>
                    <button
                      className='btn btn-sm btn-primary'
                      onClick={() => handleRemoveFile(index)}
                      style={{marginRight: 4, marginLeft: 4}}
                    >
                      <i className='fas fa-trash p-0 m-5px'></i>
                    </button>
                  </div>
                </div>
              ),
            },
          ],
        }))}
        headColumns={mapContent(['TIPO', 'NOME', ''])}
      />
    )
  }

  return (
    <Dropzone onDrop={handleFileDrop} noKeyboard>
      {({getRootProps, getInputProps, acceptedFiles}) => (
        <>
          <div className='card-body d-flex flex-column justify-content-center shadow rounded bg-light w-80px text-center'>
            <span className='card-label fw-bolder fs-5 mb-8'>{props.title}</span>
            <div
              {...getRootProps({
                className:
                  'dzu-dropzone notice d-flex align-items-center justify-content-center bg-light rounded border-primary border border-dashed p-10',
              })}
            >
              <input {...getInputProps()} />
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    style={{color: 'red'}}
                    src='/media/svg/files/upload-file.svg'
                    className='mb-2'
                    alt=''
                  />
                  <div style={{minWidth: 160}} className='text-danger mb-4 fs-9'>
                    O tamanho máximo de arquivo permitido para upload é de 5MB
                  </div>
                </div>

                <div className='text-primary fs-5'>Upload de arquivos</div>
              </div>
            </div>
          </div>
          <div className='card-body d-flex flex-column shadow rounded bg-light text-center w-400px'>
            {allFiles.length ? (
              <>
                <span className='card-label fw-bolder fs-5 mb-8'>Lista de Arquivos</span>

                {loading ? <IsLoadingList /> : renderFileList()}
              </>
            ) : (
              <EmptyStateList text='Lista Vazia' />
            )}
          </div>
        </>
      )}
    </Dropzone>
  )
}
